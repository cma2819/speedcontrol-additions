import { NodeCG } from './nodecg';
import { SpeedcontrolPlayer } from '../nodecg/generated/speedcontrolPlayer';
import { SpeedcontrolUserAddition } from '../nodecg/generated/speedcontrolUserAddition';
import { RunDataArray } from '../nodecg/external/speedcontrol/runDataArray';
import clone from 'clone';

export const speedcontrolUserAddition = (nodecg: NodeCG): void => {
    const logger = new nodecg.Logger(`${nodecg.bundleName}:user-addition`);
    const speedcontrolPlayers = nodecg.Replicant('speedcontrolPlayerArray', {
        defaultValue: []
    });
    const userAdditionArray = nodecg.Replicant('speedcontrolUserAdditionArray', {
        defaultValue: []
    });
    const speedcontrolRunDataArray = nodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
    speedcontrolRunDataArray.on('change', (newVal: RunDataArray) => {
        const players: SpeedcontrolPlayer[] = newVal.flatMap((runData) => {
            return runData.teams.flatMap((team) => {
                return clone(team.players);
            });
        });
        const filteredPlayers = players.filter((player, index, self) => {
            return self.findIndex((target) => {
                return target.id === player.id
            }) === index;
        });
        speedcontrolPlayers.value = filteredPlayers;
        userAdditionArray.value = filteredPlayers.map((player) => {
            return userAdditionArray.value.find((userAddition) => {
                return player.externalID === userAddition.id;
            }) || {
                id: player.id,
                social: {}
            };
        });
    });

    const updateUserAddition = (userAddition: SpeedcontrolUserAddition): void => {
        if (!userAdditionArray.value) {
            return;
        }
        const index = userAdditionArray.value.findIndex((target) => {
            return target.id === userAddition.id;
        });
        if (index >= 0) {
            userAdditionArray.value[index] = userAddition;
            logger.info(`Update user addition ${index}`);
        }
        return;
    }

    nodecg.listenFor('updateUserAddition', updateUserAddition);
}