"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spreadsheet = void 0;
const googleapis_1 = require("googleapis");
const importUserAddition_1 = require("./importUserAddition");
const importCommentator_1 = require("./importCommentator");
const helper_1 = require("./lib/helper");
const importTwitchGames_1 = require("./importTwitchGames");
const spreadsheet = (nodecg) => {
    const logger = new nodecg.Logger(`${nodecg.bundleName}:spreadsheet`);
    const googleApiDefinedRep = nodecg.Replicant('googleApiDefined', { defaultValue: false });
    const googleApiKey = nodecg.bundleConfig.googleApiKey;
    if (!googleApiKey) {
        logger.warn('Google API Key is undefined.');
    }
    googleApiDefinedRep.value = true;
    const spreadsheet = googleapis_1.google.sheets({
        version: 'v4',
        auth: googleApiKey
    });
    const loadSpreadsheet = async (url, ack) => {
        const spreadsheetId = (0, helper_1.googleSpreadsheetUrlToId)(url);
        try {
            if (spreadsheetId === '') {
                throw new Error('Spreadsheet URL is invalid.');
            }
            // Get spreadsheet basis
            const spreadsheetBasis = await spreadsheet.spreadsheets.get({
                spreadsheetId: spreadsheetId
            });
            const sheetTitles = spreadsheetBasis.data.sheets?.map((sheet) => {
                return sheet.properties ? sheet.properties.title || '' : '';
            }).filter((title) => {
                return title !== '';
            });
            if (!sheetTitles) {
                throw new Error('Failed to load from spreadsheet.');
            }
            // Get columns every sheets
            const ranges = sheetTitles.map((title) => {
                return `${title}!1:1`;
            });
            const sheetResponse = await spreadsheet.spreadsheets.values.batchGet({
                spreadsheetId: spreadsheetId,
                ranges
            });
            if (!sheetResponse.data.valueRanges) {
                throw new Error('Failed to get response from spreadsheet.');
            }
            const sheetArray = sheetResponse.data.valueRanges?.map((values, index) => {
                const columns = values.values ? values.values[0] : [];
                return {
                    name: sheetTitles[index],
                    columns
                };
            });
            ack(null, sheetArray);
        }
        catch (err) {
            logger.error(err);
            ack(err);
        }
    };
    nodecg.listenFor('loadSheetsFromSpreadsheet', loadSpreadsheet);
    (0, importUserAddition_1.importUserAddition)(nodecg, spreadsheet);
    (0, importCommentator_1.importCommentator)(nodecg, spreadsheet);
    (0, importTwitchGames_1.importTwitchGames)(nodecg, spreadsheet);
};
exports.spreadsheet = spreadsheet;
