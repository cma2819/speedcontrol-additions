import { Module, Action, getModule } from 'vuex-module-decorators';
import store from '../../plugin/store';
import ImportModule from '../_lib/importModule';

@Module({ dynamic: true, store, name: 'twitchGamesImport', namespaced: true })
class TwitchGamesImport extends ImportModule {

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
    public importGames({sheetIndex, lineIdIndex, gameNameIndex}: {sheetIndex: number; lineIdIndex: number; gameNameIndex: number}): void {
        this._startImport();
        nodecg.sendMessage('importTwitchGamesFromSpreadsheet', {
            url: this.spreadsheetUrl,
            sheetName: this.sheets[sheetIndex].name,
            lineIdIndex,
            gameNameIndex
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

export const twitchGamesImportModule = getModule(TwitchGamesImport);