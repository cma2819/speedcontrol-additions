"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importTwitchGames = void 0;
const helper_1 = require("./lib/helper");
const importTwitchGames = (nodecg, spreadsheet) => {
    const additionsNodecg = nodecg;
    const speedcontrolNodecg = nodecg;
    const logger = new additionsNodecg.Logger(`${additionsNodecg.bundleName}:import-twitch-games`);
    const speedcontrolRunDataArrayRep = speedcontrolNodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
    const importTwitchGamesFromSpreadsheet = async (url, sheetName, lineIdIndex, gameNameIndex) => {
        const spreadsheetId = (0, helper_1.googleSpreadsheetUrlToId)(url);
        const valueResponse = await spreadsheet.spreadsheets.values.get({
            spreadsheetId,
            range: sheetName
        });
        const runDataArray = speedcontrolRunDataArrayRep.value;
        if (!valueResponse.data.values || !runDataArray) {
            return false;
        }
        const twitchGames = valueResponse.data.values.filter((_, index) => {
            return index !== 0;
        }).map((values) => {
            return {
                id: values[lineIdIndex],
                game: values[gameNameIndex]
            };
        });
        speedcontrolRunDataArrayRep.value = runDataArray.map((runData) => {
            const twitchGame = twitchGames.find((game) => {
                return game.id === runData.externalID;
            });
            if (twitchGame) {
                return Object.assign({}, runData, { gameTwitch: twitchGame.game });
            }
            return runData;
        });
        return true;
    };
    additionsNodecg.listenFor('importTwitchGamesFromSpreadsheet', ({ url, sheetName, lineIdIndex, gameNameIndex }, ack) => {
        try {
            ack(null, importTwitchGamesFromSpreadsheet(url, sheetName, lineIdIndex, gameNameIndex));
        }
        catch (err) {
            logger.error(err);
            ack(err);
        }
    });
};
exports.importTwitchGames = importTwitchGames;
