"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.speedcontrolUserAddition = void 0;
const clone_1 = __importDefault(require("clone"));
const speedcontrolUserAddition = (nodecg) => {
    const additionsNodecg = nodecg;
    const speedcontrolNodecg = nodecg;
    const logger = new additionsNodecg.Logger(`${additionsNodecg.bundleName}:user-addition`);
    const speedcontrolPlayers = additionsNodecg.Replicant('speedcontrolPlayerArray', {
        defaultValue: []
    });
    const userAdditionArray = additionsNodecg.Replicant('speedcontrolUserAdditionArray', {
        defaultValue: []
    });
    const speedcontrolRunDataArray = speedcontrolNodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
    speedcontrolRunDataArray.on('change', (newVal) => {
        const players = newVal.flatMap((runData) => {
            return runData.teams.flatMap((team) => {
                return (0, clone_1.default)(team.players);
            });
        });
        const filteredPlayers = players.filter((player, index, self) => {
            return self.findIndex((target) => {
                return target.id === player.id;
            }) === index;
        });
        speedcontrolPlayers.value = filteredPlayers;
        userAdditionArray.value = filteredPlayers.map((player) => {
            return userAdditionArray.value.find((userAddition) => {
                return player.id === userAddition.id;
            }) || {
                id: player.id,
                social: {}
            };
        });
    });
    const updateUserAddition = (userAddition) => {
        if (!userAdditionArray.value) {
            return;
        }
        const index = userAdditionArray.value.findIndex((target) => {
            return target.id === userAddition.id;
        });
        if (index >= 0) {
            userAdditionArray.value[index] = {
                ...userAddition,
                social: {
                    nico: userAddition.social.nico !== '' ? userAddition.social.nico : undefined,
                    youtube: userAddition.social.youtube !== '' ? userAddition.social.youtube : undefined,
                    twitter: userAddition.social.twitter !== '' ? userAddition.social.twitter : undefined,
                },
            };
            logger.info(`Update user addition ${index}`);
        }
        return;
    };
    additionsNodecg.listenFor('updateUserAddition', (data, cb) => {
        if (cb && !cb.handled) {
            updateUserAddition(data);
            cb(null);
        }
    });
};
exports.speedcontrolUserAddition = speedcontrolUserAddition;
