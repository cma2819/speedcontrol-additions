"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importCommentator = void 0;
const uuid_1 = require("uuid");
const helper_1 = require("./lib/helper");
const lodash_1 = require("lodash");
const importCommentator = (nodecg, spreadsheet) => {
    const logger = new nodecg.Logger(`${nodecg.bundleName}:import-commentator`);
    const commentatorArrayRep = nodecg.Replicant('commentatorArray', {
        defaultValue: []
    });
    const speedcontrolRuns = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
    const mergeAssignedRunId = (commentators) => {
        return commentators.reduce((prev, commentator) => {
            if (commentator.name in prev) {
                prev[commentator.name].assignedRunIdArray.push(...commentator.assignedRunIdArray);
            }
            else {
                prev[commentator.name] = commentator;
            }
            return prev;
        }, {});
    };
    const importCommentatorFromSpreadsheet = async (url, sheetName, runIdIndex, nameIndex, twitchIndex, nicoIndex, youtubeIndex, twitterIndex) => {
        const spreadsheetId = (0, helper_1.googleSpreadsheetUrlToId)(url);
        const valueResponse = await spreadsheet.spreadsheets.values.get({
            spreadsheetId,
            range: sheetName
        });
        if (!valueResponse.data.values) {
            return false;
        }
        const runs = (0, lodash_1.clone)(speedcontrolRuns.value ?? []);
        const commentatorArray = valueResponse.data.values.filter((_, index) => {
            return index !== 0;
        }).map((values) => {
            const runIdValue = values[runIdIndex];
            const speedcontrolRun = runs.find(run => run.externalID === runIdValue.trim());
            return {
                id: (0, uuid_1.v4)(),
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
    };
    nodecg.listenFor('importCommentatorFromSpreadsheet', ({ url, sheetName, indexes }, ack) => {
        try {
            ack(null, importCommentatorFromSpreadsheet(url, sheetName, indexes.runId, indexes.name, indexes.twitch, indexes.nico, indexes.youtube, indexes.twitter));
        }
        catch (err) {
            logger.error(err);
            ack(err);
        }
    });
};
exports.importCommentator = importCommentator;
