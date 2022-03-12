"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.importUserAddition = void 0;
var tslib_1 = require("tslib");
var helper_1 = require("./lib/helper");
var uuid_1 = require("uuid");
// eslint-disable-next-line @typescript-eslint/camelcase
var importUserAddition = function (nodecg, spreadsheet) {
    var logger = new nodecg.Logger(nodecg.bundleName + ":import-user-addition");
    var userAdditionArrayRep = nodecg.Replicant('speedcontrolUserAdditionArray');
    var speedcontrolPlayerArrayRep = nodecg.Replicant('speedcontrolPlayerArray');
    var findSpeedcontrolPlayerByName = function (name) {
        var _a;
        return ((_a = speedcontrolPlayerArrayRep.value) === null || _a === void 0 ? void 0 : _a.find(function (player) {
            return player.name == name;
        })) || null;
    };
    var importAdditionFromSpreadsheet = function (url, sheetName, nameIndex, nicoIndex, youtubeIndex, twitterIndex) { return tslib_1.__awaiter(void 0, void 0, void 0, function () {
        var spreadsheetId, valueResponse, additionDataArray;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    spreadsheetId = helper_1.googleSpreadsheetUrlToId(url);
                    return [4 /*yield*/, spreadsheet.spreadsheets.values.get({
                            spreadsheetId: spreadsheetId,
                            range: sheetName
                        })];
                case 1:
                    valueResponse = _a.sent();
                    if (!valueResponse.data.values) {
                        return [2 /*return*/, false];
                    }
                    additionDataArray = valueResponse.data.values.filter(function (_, index) {
                        return index !== 0;
                    }).map(function (values) {
                        var targetPlayer = findSpeedcontrolPlayerByName(values[nameIndex]);
                        return {
                            id: (targetPlayer === null || targetPlayer === void 0 ? void 0 : targetPlayer.id) || uuid_1.v4(),
                            social: {
                                nico: values[nicoIndex] !== '' ? values[nicoIndex] : undefined,
                                youtube: values[youtubeIndex] !== '' ? values[youtubeIndex] : undefined,
                                twitter: values[twitterIndex] !== '' ? values[twitterIndex] : undefined
                            }
                        };
                    });
                    userAdditionArrayRep.value = additionDataArray;
                    return [2 /*return*/, true];
            }
        });
    }); };
    nodecg.listenFor('importAdditionFromSpreadsheet', function (_a, ack) {
        var url = _a.url, sheetName = _a.sheetName, indexes = _a.indexes;
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
