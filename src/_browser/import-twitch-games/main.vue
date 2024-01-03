<template>
  <v-app>
    <v-container
      class="pa-0"
    >
      <v-row>
        <v-col
          :cols="12"
        >
          <v-text-field
            v-model="spreadsheetUrl"
            block
            filled
            label="Google Spreadsheet URL"
            :error-messages="[]"
          ></v-text-field>
          <v-btn
            class="mb-2"
            block
            :loading="isLoading"
            :disabled="isLoading"
            @click="loadSpreadsheet"
          >
            Load Spreadsheet Data
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          :cols="3"
        >
          Select source sheet
        </v-col>
        <v-col
          :cols="9"
        >
          <v-select
            v-model="sheetIndex"
            :items="sheetItems"
            :menu-props="{top: true, offsetY: true}"
            :disabled="!isLoaded"
            label="Sheet Name"
            dense
            @change="onChangeSheetItem"
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          :cols="2"
        >
          Select Column
        </v-col>
      </v-row>
      <v-row>
        <v-col
          :cols="6"
        >
          <v-select
            v-model="lineIdIndex"
            :items="columnItems"
            :menu-props="{top: true, offsetY: true}"
            :disabled="!isSheetSelected"
            label="Schedule Line ID"
            dense
          ></v-select>
        </v-col>
        <v-col
          :cols="6"
        >
          <v-select
            v-model="gameNameIndex"
            :items="columnItems"
            :menu-props="{top: true, offsetY: true}"
            :disabled="!isSheetSelected"
            label="Twitch Game Name"
            dense
          ></v-select>
        </v-col>
      </v-row>
    </v-container>
    <v-btn
      :disabled="!isColumnsSelected || isCompleted"
      :loading="isImporting"
      class="mb-2"
      color="success"
      block
      @click="onSubmitImport"
    >
      {{ isCompleted ? 'Finish to import! Close this dialog.' : 'Import from Spreadsheet' }}
    </v-btn>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import { twitchGamesImportModule } from './twitchGamesImport';

@Component
export default class App extends Vue {
  spreadsheetUrl = '';
  sheetIndex = -1;
  lineIdIndex = -1;
  gameNameIndex = -1;

  get isLoading (): boolean {
    return twitchGamesImportModule.isLoading;
  }

  get isLoaded (): boolean {
    return twitchGamesImportModule.isLoaded;
  }

  get isImporting (): boolean {
    return twitchGamesImportModule.isImporting;
  }

  get isCompleted (): boolean {
    return twitchGamesImportModule.isCompleted;
  }

  get isSheetSelected (): boolean {
    return twitchGamesImportModule.isSheetSelected;
  }

  get isColumnsSelected (): boolean {
    if (this.lineIdIndex < 0 || this.gameNameIndex < 0) {
      return false;
    }
    return true;
  }

  get sheetItems (): {text: string; value: number}[] {
    return twitchGamesImportModule.sheets.map((sheet, index) => {
      return {
        text: sheet.name,
        value: index
      };
    })
  }

  get columnItems (): {text: string; value: number}[] {
    return twitchGamesImportModule.activeColumns.map((column, index) => {
      return {
        text: column,
        value: index
      };
    });
  }

  @Emit()
  loadSpreadsheet(): void {
    this.sheetIndex = -1;
    this.lineIdIndex = -1;
    this.gameNameIndex = -1;
    twitchGamesImportModule.loadSpreadsheet(this.spreadsheetUrl);
  }

  @Emit()
  onChangeSheetItem(index: number): void {
    twitchGamesImportModule.updateActiveColumns(index);
  }

  @Emit()
  onSubmitImport(): void {
    twitchGamesImportModule.importGames({
      sheetIndex: this.sheetIndex,
      lineIdIndex: this.lineIdIndex,
      gameNameIndex: this.gameNameIndex
    });
  }
}
</script>
