"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.speedcontrolUserAddition = void 0;
var tslib_1 = require("tslib");
var clone_1 = tslib_1.__importDefault(require("clone"));
var speedcontrolUserAddition = function (nodecg) {
    var additionsNodecg = nodecg;
    var speedcontrolNodecg = nodecg;
    var logger = new additionsNodecg.Logger(additionsNodecg.bundleName + ":user-addition");
    var speedcontrolPlayers = additionsNodecg.Replicant('speedcontrolPlayerArray', {
        defaultValue: []
    });
    var userAdditionArray = additionsNodecg.Replicant('speedcontrolUserAdditionArray', {
        defaultValue: []
    });
    var speedcontrolRunDataArray = speedcontrolNodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
    speedcontrolRunDataArray.on('change', function (newVal) {
        var players = newVal.flatMap(function (runData) {
            return runData.teams.flatMap(function (team) {
                return clone_1.default(team.players);
            });
        });
        var filteredPlayers = players.filter(function (player, index, self) {
            return self.findIndex(function (target) {
                return target.id === player.id;
            }) === index;
        });
        speedcontrolPlayers.value = filteredPlayers;
        userAdditionArray.value = filteredPlayers.map(function (player) {
            return userAdditionArray.value.find(function (userAddition) {
                return player.id === userAddition.id;
            }) || {
                id: player.id,
                social: {}
            };
        });
    });
    var updateUserAddition = function (userAddition) {
        if (!userAdditionArray.value) {
            return;
        }
        var index = userAdditionArray.value.findIndex(function (target) {
            return target.id === userAddition.id;
        });
        if (index >= 0) {
            userAdditionArray.value[index] = userAddition;
            logger.info("Update user addition " + index);
        }
        return;
    };
    additionsNodecg.listenFor('updateUserAddition', updateUserAddition);
};
exports.speedcontrolUserAddition = speedcontrolUserAddition;
