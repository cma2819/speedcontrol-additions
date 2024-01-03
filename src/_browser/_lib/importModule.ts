import { VuexModule, Mutation } from 'vuex-module-decorators';
import { SheetData } from '../../../types/SheetData';

export default class ImportDialog extends VuexModule {
    isLoaded = false;
    isLoading = false;
    isSheetSelected = false;
    isImporting = false;
    isCompleted = false;
    sheets: SheetData[] = [];
    spreadsheetUrl = '';
    activeColumns: string[] = [];

    @Mutation
    protected _startLoad(): void {
        this.isLoaded = false;
        this.isSheetSelected = false;
        this.isLoading = true;
    }

    @Mutation
    protected _finishLoad(): void {
        this.isLoading = false;
        this.isCompleted = false;
    }

    @Mutation
    protected _startImport(): void {
        this.isImporting = true;
        this.isCompleted = false;
    }

    @Mutation
    protected _finishImport(): void {
        this.isImporting = false;
    }

    @Mutation
    protected _completeImport(): void {
        this.isImporting = false;
        this.isCompleted = true;
    }

    @Mutation
    protected _updateSpreadsheetUrl(url: string): void {
        this.spreadsheetUrl = url;
    }

    @Mutation
    protected _updateSheets(sheets: SheetData[]): void {
        this.sheets = sheets;
        this.isLoaded = true;
    }

    @Mutation
    protected _updateActiveColumns(columns: string[]): void {
        this.activeColumns = columns;
        this.isSheetSelected = true;
    }

}
