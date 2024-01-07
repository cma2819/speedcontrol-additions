"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importUserAddition = void 0;
const helper_1 = require("./lib/helper");
const uuid_1 = require("uuid");
const importUserAddition = (nodecg, spreadsheet) => {
    const logger = new nodecg.Logger(`${nodecg.bundleName}:import-user-addition`);
    const userAdditionArrayRep = nodecg.Replicant('speedcontrolUserAdditionArray');
    const speedcontrolPlayerArrayRep = nodecg.Replicant('speedcontrolPlayerArray');
    const findSpeedcontrolPlayerByName = (name) => {
        return speedcontrolPlayerArrayRep.value?.find((player) => {
            return player.name == name;
        }) || null;
    };
    const importAdditionFromSpreadsheet = async (url, sheetName, nameIndex, nicoIndex, youtubeIndex, twitterIndex) => {
        const spreadsheetId = (0, helper_1.googleSpreadsheetUrlToId)(url);
        const valueResponse = await spreadsheet.spreadsheets.values.get({
            spreadsheetId,
            range: sheetName
        });
        if (!valueResponse.data.values) {
            return false;
        }
        const additionDataArray = valueResponse.data.values.filter((_, index) => {
            return index !== 0;
        }).map((values) => {
            const targetPlayer = findSpeedcontrolPlayerByName(values[nameIndex]);
            return {
                id: targetPlayer?.id || (0, uuid_1.v4)(),
                social: {
                    nico: values[nicoIndex] !== '' ? values[nicoIndex] : undefined,
                    youtube: values[youtubeIndex] !== '' ? values[youtubeIndex] : undefined,
                    twitter: values[twitterIndex] !== '' ? values[twitterIndex] : undefined
                }
            };
        });
        userAdditionArrayRep.value = additionDataArray;
        return true;
    };
    nodecg.listenFor('importAdditionFromSpreadsheet', ({ url, sheetName, indexes }, ack) => {
        try {
            ack(null, importAdditionFromSpreadsheet(url, sheetName, indexes.name, indexes.nico, indexes.youtube, indexes.twitter));
        }
        catch (err) {
            logger.error(err);
            ack(err);
        }
    });
};
exports.importUserAddition = importUserAddition;
