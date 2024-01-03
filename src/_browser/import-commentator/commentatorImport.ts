import { Module, Action, getModule } from 'vuex-module-decorators';
import store from '../../plugin/store';
import ImportModule from '../_lib/importModule';

@Module({ dynamic: true, store, name: 'userAdditionImport', namespaced: true })
class CommentatorImport extends ImportModule {

    @Action
    public loadSpreadsheet(url: string): void {
        this._startLoad();
        nodecg.sendMessage('loadSheetsFromSpreadsheet',url, (err, result) => {
            if (err) {
                console.error('Failed to load Spreadsheet.');
                this._finishLoad();
                return;
            }
            this._updateSpreadsheetUrl(url);
            this._updateSheets(result);
            this._finishLoad();
            return;
        })
    }

    @Action
    public updateActiveColumns(index: number): void {
        const columns = this.sheets[index].columns;
        this._updateActiveColumns(columns);
    }
    
    @Action
    public importAddition({sheetIndex, indexes}: {
            sheetIndex: number;
            indexes: {runId: number; name: number; nico: number; youtube: number; twitter: number; twitch: number};
        }): void {
        this._startImport();
        nodecg.sendMessage('importCommentatorFromSpreadsheet', {
            url: this.spreadsheetUrl,
            sheetName: this.sheets[sheetIndex].name,
            indexes
        }).then((result: boolean) => {
            if (result) {
                this._completeImport();
            }
        }).catch((err: Error) => {
            this._finishImport();
            console.error(err);
        })
    }
}

export const commentatorImportModule = getModule(CommentatorImport);