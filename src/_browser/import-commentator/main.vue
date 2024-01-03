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
          :cols="3"
        >
          Select Columns
        </v-col>
        <v-col
          :cols="3"
        >
          <v-select
            v-model="runIdIndex"
            :items="columnItems"
            :menu-props="{top: true, offsetY: true}"
            :disabled="!isSheetSelected"
            label="Run IDs"
            dense
          ></v-select>
        </v-col>
        <v-col
          :cols="3"
        >
          <v-select
            v-model="nameIndex"
            :items="columnItems"
            :menu-props="{top: true, offsetY: true}"
            :disabled="!isSheetSelected"
            label="Name"
            dense
          ></v-select>
        </v-col>
        <v-col
          :cols="3"
        >
          <v-select
            v-model="twitchIndex"
            :items="columnItems"
            :menu-props="{top: true, offsetY: true}"
            :disabled="!isSheetSelected"
            label="Twitch"
            dense
          ></v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col
          :cols="3"
        ></v-col>
        <v-col
          :cols="3"
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
          :cols="3"
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
          :cols="3"
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
import { commentatorImportModule } from './commentatorImport';

@Component
export default class App extends Vue {
  spreadsheetUrl = '';
  sheetIndex = -1;
  runIdIndex = -1;
  nameIndex = -1;
  twitchIndex = -1;
  nicoIndex = -1;
  youtubeIndex = -1;
  twitterIndex = -1;

  get isLoading (): boolean {
    return commentatorImportModule.isLoading;
  }

  get isLoaded (): boolean {
    return commentatorImportModule.isLoaded;
  }

  get isImporting (): boolean {
    return commentatorImportModule.isImporting;
  }

  get isCompleted (): boolean {
    return commentatorImportModule.isCompleted;
  }

  get isSheetSelected (): boolean {
    return commentatorImportModule.isSheetSelected;
  }

  get isColumnsSelected (): boolean {
    if (this.nameIndex < 0 || this.nicoIndex < 0 || this.youtubeIndex < 0 || this.runIdIndex < 0 || this.twitterIndex < 0 || this.twitchIndex < 0) {
      return false;
    }
    return true;
  }

  get sheetItems (): {text: string; value: number}[] {
    return commentatorImportModule.sheets.map((sheet, index) => {
      return {
        text: sheet.name,
        value: index
      };
    })
  }

  get columnItems (): {text: string; value: number}[] {
    return commentatorImportModule.activeColumns.map((column, index) => {
      return {
        text: column,
        value: index
      };
    });
  }

  @Emit()
  loadSpreadsheet(): void {
    this.sheetIndex = -1;
    this.runIdIndex = -1;
    this.nameIndex = -1;
    this.nicoIndex = -1;
    this.youtubeIndex = -1;
    this.twitterIndex = -1;
    this.twitchIndex = -1;
    commentatorImportModule.loadSpreadsheet(this.spreadsheetUrl);
  }

  @Emit()
  onChangeSheetItem(index: number): void {
    commentatorImportModule.updateActiveColumns(index);
  }

  @Emit()
  onSubmitImport(): void {
    commentatorImportModule.importAddition({
      sheetIndex: this.sheetIndex,
      indexes: {
        runId: this.runIdIndex,
        name: this.nameIndex,
        nico: this.nicoIndex,
        youtube: this.youtubeIndex,
        twitter: this.twitterIndex,
        twitch: this.twitchIndex
      }
    });
  }
}
</script>
