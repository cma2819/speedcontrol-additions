import { VuexModule, getModule, Module, Mutation } from 'vuex-module-decorators';
import store from './store';
import { SpeedcontrolReplicantName, RunDataArray } from '../../nodecg/speedcontrol';
import clone from 'clone';

export interface SpeedcontrolReplicantState {
    runDataArray: RunDataArray;
}

@Module({ dynamic: true, store, name: 'speedcontrol', namespaced: true })
class Speedcontrol extends VuexModule implements SpeedcontrolReplicantState {
    runDataArray: RunDataArray = [];

    @Mutation
    public updateRunDataArray (value: RunDataArray): void {
        this.runDataArray = value;
    }

}

export const speedcontrolModule = getModule(Speedcontrol);

const speedcontrolMutations: [SpeedcontrolReplicantName, Function][] = [
    ['runDataArray', speedcontrolModule.updateRunDataArray]
];

speedcontrolMutations.forEach(([name, mutator]) => {
    const replicant = nodecg.Replicant(name, 'nodecg-speedcontrol');

    replicant.on('change', (newVal) => {
        mutator(clone(newVal));
    });
});
