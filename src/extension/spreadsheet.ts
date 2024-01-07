import { BundleNodecgInstance } from './nodecg';
import { google } from 'googleapis';
import { importUserAddition } from './importUserAddition';
import { importCommentator } from './importCommentator';
import { googleSpreadsheetUrlToId } from './lib/helper';
import { importTwitchGames } from './importTwitchGames';

export const spreadsheet = (nodecg: BundleNodecgInstance): void => {
    const logger = new nodecg.Logger(`${nodecg.bundleName}:spreadsheet`);
    const googleApiDefinedRep = nodecg.Replicant('googleApiDefined', { defaultValue: false });

    const googleApiKey = nodecg.bundleConfig.googleApiKey;
    if (!googleApiKey) {
        logger.warn('Google API Key is undefined.');
    }
    googleApiDefinedRep.value = true;
    const spreadsheet = google.sheets({
        version: 'v4',
        auth: googleApiKey
    });

    const loadSpreadsheet = async (url: string, ack: any): Promise<void> => {
        const spreadsheetId = googleSpreadsheetUrlToId(url);
        try {
            if (spreadsheetId === '') {
                throw new Error('Spreadsheet URL is invalid.')
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
            const ranges = sheetTitles.map((title): string => {
                return `${title}!1:1`;
            })
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
        } catch (err) {
            logger.error(err);
            ack(err);
        }
    }
    nodecg.listenFor('loadSheetsFromSpreadsheet', loadSpreadsheet);

    importUserAddition(nodecg, spreadsheet);
    importCommentator(nodecg, spreadsheet);
    importTwitchGames(nodecg, spreadsheet);

}