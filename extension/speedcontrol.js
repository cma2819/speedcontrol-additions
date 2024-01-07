"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.speedcontrol = void 0;
const speedcontrol = (nodecg) => {
    const additionsNodecg = nodecg;
    const speedcontrolNodecg = nodecg;
    const runDataArrayRep = speedcontrolNodecg.Replicant('runDataArray', 'nodecg-speedcontrol');
    const currentSurroundingRep = speedcontrolNodecg.Replicant('runDataActiveRunSurrounding', 'nodecg-speedcontrol');
    const currentRunIndexRep = additionsNodecg.Replicant('speedcontrolCurrentRunIndex', {
        defaultValue: 0
    });
    currentSurroundingRep.on('change', (newVal) => {
        if (!runDataArrayRep.value) {
            return;
        }
        const currentRunId = newVal.current;
        const currentRunIndex = runDataArrayRep.value.findIndex((runData) => {
            return runData.id === currentRunId;
        });
        if (currentRunIndex >= 0) {
            currentRunIndexRep.value = currentRunIndex;
        }
    });
};
exports.speedcontrol = speedcontrol;
