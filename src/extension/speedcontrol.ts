import { BundleNodecgInstance, NodeCG, SpeedcontrolInstance } from './nodecg';

export const speedcontrol = (nodecg: NodeCG): void => {
	const additionsNodecg = nodecg as BundleNodecgInstance;
	const speedcontrolNodecg = nodecg as SpeedcontrolInstance;
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
        })
        if (currentRunIndex >= 0) {
            currentRunIndexRep.value = currentRunIndex;
        }
    })
}
