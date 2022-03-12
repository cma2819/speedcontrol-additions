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
          Select Columns
        </v-col>
        <v-col
          :cols="4"
        >
          <v-select
            v-model="runnerNameIndex"
            :items="columnItems"
            :menu-props="{top: true, offsetY: true}"
            :disabled="!isSheetSelected"
            label="Runner Name"
            dense
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          :cols="4"
        >
          <v-select
            v-model="nicoIndex"
            :items="columnItems"
            :menu-props="{top: true, offsetY: true}"
            :disabled="!isSheetSelected"
            label="ニコニココミュニティ"
            dense
          ></v-select>
        </v-col>
        <v-col
          :cols="4"
        >
          <v-select
            v-model="youtubeIndex"
            :items="columnItems"
            :menu-props="{top: true, offsetY: true}"
            :disabled="!isSheetSelected"
            label="Youtube"
            dense
          ></v-select>
        </v-col>
        <v-col
          :cols="4"
        >
          <v-select
            v-model="twitterIndex"
            :items="columnItems"
            :menu-props="{top: true, offsetY: true}"
            :disabled="!isSheetSelected"
            label="Twitter"
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
import { userAdditionImportModule } from './userAdditionImport';

@Component
export default class App extends Vue {
  spreadsheetUrl = '';
  sheetIndex = -1;
  runnerNameIndex = -1;
  nicoIndex = -1;
  youtubeIndex = -1;
  twitterIndex = -1;

  get isLoading (): boolean {
    return userAdditionImportModule.isLoading;
  }

  get isLoaded (): boolean {
    return userAdditionImportModule.isLoaded;
  }

  get isImporting (): boolean {
    return userAdditionImportModule.isImporting;
  }

  get isCompleted (): boolean {
    return userAdditionImportModule.isCompleted;
  }

  get isSheetSelected (): boolean {
    return userAdditionImportModule.isSheetSelected;
  }

  get isColumnsSelected (): boolean {
    if (this.nicoIndex < 0 || this.youtubeIndex < 0 || this.runnerNameIndex < 0 || this.twitterIndex < 0) {
      return false;
    }
    return true;
  }

  get sheetItems (): {text: string; value: number}[] {
    return userAdditionImportModule.sheets.map((sheet, index) => {
      return {
        text: sheet.name,
        value: index
      };
    })
  }

  get columnItems (): {text: string; value: number}[] {
    return userAdditionImportModule.activeColumns.map((column, index) => {
      return {
        text: column,
        value: index
      };
    });
  }

  @Emit()
  loadSpreadsheet(): void {
    this.sheetIndex = -1;
    this.runnerNameIndex = -1;
    this.nicoIndex = -1;
    this.youtubeIndex = -1;
    this.twitterIndex = -1;
    userAdditionImportModule.loadSpreadsheet(this.spreadsheetUrl);
  }

  @Emit()
  onChangeSheetItem(index: number): void {
    userAdditionImportModule.updateActiveColumns(index);
  }

  @Emit()
  onSubmitImport(): void {
    userAdditionImportModule.importAddition({
      sheetIndex: this.sheetIndex,
      indexes: {
        name: this.runnerNameIndex,
        nico: this.nicoIndex,
        youtube: this.youtubeIndex,
        twitter: this.twitterIndex
      }
    });
  }
}
</script>
