import { VuexModule, Module, Action, getModule, Mutation } from 'vuex-module-decorators';
import store from '../../plugin/store';
import { SpeedcontrolUserAddition } from '../../../nodecg/generated/speedcontrolUserAddition';

export enum transitionStatus {
    userPanel,
    modificationForm
}

@Module({ dynamic: true, store, name: 'userModification', namespaced: true })
class UserModification extends VuexModule {
    transition = transitionStatus.userPanel;
    name = '';
    id = '';
    nico = '';
    youtube = '';
    twitter = '';

    @Mutation
    public updateName(name: string): void {
        this.name = name;
    }

    @Mutation
    public updateModifyAddition(userAddition: SpeedcontrolUserAddition): void {
        this.id = userAddition.id;
        this.nico = userAddition.social.nico || '';
        this.youtube = userAddition.social.youtube || '';
        this.twitter = userAddition.social.twitter || '';
    }

    @Mutation
    public closeModificationForm(): void {
        this.transition = transitionStatus.userPanel;
    }

    @Mutation
    public openModificationForm(): void {
        this.transition = transitionStatus.modificationForm;
    }

    @Action
    public transitionToModification({ name, userAddition }: { name: string; userAddition: SpeedcontrolUserAddition }): void {
        this.updateName(name);
        this.updateModifyAddition(userAddition);
        this.openModificationForm();
    }

    @Action
    public transitionToUserPanel(): void {
        this.closeModificationForm();
    }
}

export const userModificationModule = getModule(UserModification);