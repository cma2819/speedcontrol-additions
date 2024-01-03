import { VuexModule, Module, Action, getModule } from 'vuex-module-decorators';
import store from '../../plugin/store';

@Module({ dynamic: true, store, name: 'importControl', namespaced: true })
class ImportControl extends VuexModule {
    
    @Action
    public addDialogEventListener(): void {
        const dialog = nodecg.getDialogDocument('import-dialog');
        dialog.addEventListener('dialog-opened', () => {
            console.log('opened!');
        })
    }
}

export const importControlModule = getModule(ImportControl);