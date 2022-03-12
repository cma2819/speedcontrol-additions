import { NodeCG } from './nodecg';
// eslint-disable-next-line @typescript-eslint/camelcase
import { sheets_v4 } from 'googleapis';
import { googleSpreadsheetUrlToId } from './lib/helper';
import { SpeedcontrolUserAdditionArray } from '../nodecg/replicants';
import { SpeedcontrolPlayer } from '../nodecg/generated';
import { v4 as uuidv4 } from 'uuid';

// eslint-disable-next-line @typescript-eslint/camelcase
export const importUserAddition = (nodecg: NodeCG, spreadsheet: sheets_v4.Sheets): void => {
    const logger = new nodecg.Logger(`${nodecg.bundleName}:import-user-addition`);
    const userAdditionArrayRep = nodecg.Replicant('speedcontrolUserAdditionArray');
    const speedcontrolPlayerArrayRep = nodecg.Replicant('speedcontrolPlayerArray');

    const findSpeedcontrolPlayerByName = (name: string): SpeedcontrolPlayer|null => {
      return speedcontrolPlayerArrayRep.value?.find((player) => {
        return player.name == name;
      }) || null;
    }

    const importAdditionFromSpreadsheet = async (
        url: string, sheetName: string, nameIndex: number, nicoIndex: number, youtubeIndex: number, twitterIndex: number
    ): Promise<boolean> => {
        const spreadsheetId = googleSpreadsheetUrlToId(url);
        const valueResponse = await spreadsheet.spreadsheets.values.get({
            spreadsheetId,
            range: sheetName
        });

        if (!valueResponse.data.values) {
            return false;
        }
        const additionDataArray: SpeedcontrolUserAdditionArray = valueResponse.data.values.filter((_, index) => {
            return index !== 0;
        }).map((values) => {
            const targetPlayer = findSpeedcontrolPlayerByName(values[nameIndex]);
            return {
                id: targetPlayer?.id || uuidv4(),
                social: {
                    nico: values[nicoIndex] !== '' ? values[nicoIndex] : undefined,
                    youtube: values[youtubeIndex] !== '' ? values[youtubeIndex] : undefined,
                    twitter: values[twitterIndex] !== '' ? values[twitterIndex] : undefined
                }
            };
        });
        userAdditionArrayRep.value = additionDataArray;
        return true;
    }

    nodecg.listenFor('importAdditionFromSpreadsheet', ({url, sheetName, indexes}: {
        url: string;
        sheetName: string;
        indexes: {
            name: number;
            nico: number;
            youtube: number;
            twitter: number;
        };
    }, ack: any) => {
        try {
            ack(null, importAdditionFromSpreadsheet(url, sheetName, indexes.name, indexes.nico, indexes.youtube, indexes.twitter));
        } catch(err) {
            logger.error(err);
            ack(err);
        }
    });
}