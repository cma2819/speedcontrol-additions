import { BundleNodecgInstance, NodeCG, SpeedcontrolInstance } from './nodecg';
import { sheets_v4 } from 'googleapis';
import { v4 as uuid} from 'uuid';
import { googleSpreadsheetUrlToId } from './lib/helper';
import { Commentator, CommentatorArray } from '../nodecg/replicants';
import { clone } from 'lodash';

export const importCommentator = (nodecg: NodeCG, spreadsheet: sheets_v4.Sheets): void => {
    const logger = new nodecg.Logger(`${nodecg.bundleName}:import-commentator`);
    const commentatorArrayRep = (nodecg as BundleNodecgInstance).Replicant('commentatorArray', {
        defaultValue: []
    });
    const speedcontrolRuns = (nodecg as SpeedcontrolInstance).Replicant('runDataArray', 'nodecg-speedcontrol');

    const mergeAssignedRunId = (commentators: Commentator[]) => {
        return commentators.reduce((prev, commentator) => {
            if (commentator.name in prev) {
                prev[commentator.name].assignedRunIdArray.push(...commentator.assignedRunIdArray);
            } else {
                prev[commentator.name] = commentator;
            }
            return prev;
        }, {} as Record<string, Commentator>)
    }

    const importCommentatorFromSpreadsheet = async (
        url: string, sheetName: string, runIdIndex: number, nameIndex: number, twitchIndex: number, nicoIndex: number, youtubeIndex: number, twitterIndex: number
    ): Promise<boolean> => {
        const spreadsheetId = googleSpreadsheetUrlToId(url);
        const valueResponse = await spreadsheet.spreadsheets.values.get({
            spreadsheetId,
            range: sheetName
        });

        if (!valueResponse.data.values) {
            return false;
        }

        const runs = clone(speedcontrolRuns.value ?? []);
        const commentatorArray: CommentatorArray = valueResponse.data.values.filter((_, index) => {
            return index !== 0;
        }).map((values) => {
            const runIdValue = values[runIdIndex] as string;
            const speedcontrolRun = runs.find(run => run.externalID === runIdValue.trim());
            return {
                id: uuid(),
                assignedRunIdArray: speedcontrolRun ? [speedcontrolRun.id] : [],
                name: values[nameIndex] !== '' ? values[nameIndex] : undefined,
                social: {
                    twitch: values[twitchIndex] !== '' ? values[twitchIndex] : undefined,
                    nico: values[nicoIndex] !== '' ? values[nicoIndex] : undefined,
                    youtube: values[youtubeIndex] !== '' ? values[youtubeIndex] : undefined,
                    twitter: values[twitterIndex] !== '' ? values[twitterIndex] : undefined
                }
            };
        });
        commentatorArrayRep.value = Object.values(mergeAssignedRunId(commentatorArray));
        return true;
    }

    (nodecg as BundleNodecgInstance).listenFor('importCommentatorFromSpreadsheet', ({url, sheetName, indexes}: {
        url: string;
        sheetName: string;
        indexes: {
            runId: number;
            name: number;
            twitch: number;
            nico: number;
            youtube: number;
            twitter: number;
        };
    }, ack: any) => {
        try {
            ack(null, importCommentatorFromSpreadsheet(url, sheetName, indexes.runId, indexes.name, indexes.twitch, indexes.nico, indexes.youtube, indexes.twitter));
        } catch(err) {
            logger.error(err);
            ack(err);
        }
    });
}