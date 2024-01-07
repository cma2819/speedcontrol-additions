import { BundleNodecgInstance, NodeCG, SpeedcontrolInstance } from './nodecg';
import { sheets_v4 } from 'googleapis';
import { googleSpreadsheetUrlToId } from './lib/helper';

export const importTwitchGames = (nodecg: NodeCG, spreadsheet: sheets_v4.Sheets): void => {
	const additionsNodecg = nodecg as BundleNodecgInstance;
	const speedcontrolNodecg = nodecg as SpeedcontrolInstance;

    const logger = new additionsNodecg.Logger(`${additionsNodecg.bundleName}:import-twitch-games`);
    const speedcontrolRunDataArrayRep = speedcontrolNodecg.Replicant('runDataArray', 'nodecg-speedcontrol');

    const importTwitchGamesFromSpreadsheet = async (
        url: string, sheetName: string, lineIdIndex: number, gameNameIndex: number
    ): Promise<boolean> => {
        const spreadsheetId = googleSpreadsheetUrlToId(url);
        const valueResponse = await spreadsheet.spreadsheets.values.get({
            spreadsheetId,
            range: sheetName
        });

        const runDataArray = speedcontrolRunDataArrayRep.value;

        if (!valueResponse.data.values || !runDataArray) {
            return false;
        }

        const twitchGames: {
            id: string;
            game: string;
        }[] = valueResponse.data.values.filter((_, index) => {
            return index !== 0;
        }).map((values) => {
            return {
                id: values[lineIdIndex] as string,
                game: values[gameNameIndex] as string
            };
        });

        speedcontrolRunDataArrayRep.value = runDataArray.map((runData) => {
            const twitchGame = twitchGames.find((game) => {
                return game.id === runData.externalID;
            });

            if (twitchGame) {
                return Object.assign({}, runData, {gameTwitch: twitchGame.game});
            }
            return runData;
        });

        return true;
    }

    additionsNodecg.listenFor('importTwitchGamesFromSpreadsheet', ({url, sheetName, lineIdIndex, gameNameIndex}: {
        url: string;
        sheetName: string;
        lineIdIndex: number;
        gameNameIndex: number;
    }, ack: any) => {
        try {
            ack(null, importTwitchGamesFromSpreadsheet(url, sheetName, lineIdIndex, gameNameIndex));
        } catch(err) {
            logger.error(err);
            ack(err);
        }
    });
}
