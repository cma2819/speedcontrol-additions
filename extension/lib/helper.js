"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleSpreadsheetUrlToId = void 0;
const url_1 = require("url");
const googleSpreadsheetUrlToId = (url) => {
    const spreadSheetUrl = new url_1.URL(url);
    const pathNames = spreadSheetUrl.pathname.split('/');
    // pathName must be '[0]/spreadsheets'[1]/'d'[2]/<spreadsheet id>[3]
    return pathNames[3] || '';
};
exports.googleSpreadsheetUrlToId = googleSpreadsheetUrlToId;
