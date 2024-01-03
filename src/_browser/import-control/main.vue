<template>
  <v-app>
    <div class="mb-2">
      Import from Google Spreadsheet.
    </div>
    <v-btn
      :disabled="!isGoogleApiDefined"
      block
      value="1"
      nodecg-dialog="import-user-addition"
      class="mb-2"
    >
      User Addition Import
    </v-btn>
    <v-btn
      :disabled="!isGoogleApiDefined"
      block
      value="1"
      nodecg-dialog="import-commentator"
      class="mb-2"
    >
      Commentator Import
    </v-btn>
    <v-btn
      :disabled="!isGoogleApiDefined"
      block
      value="1"
      nodecg-dialog="import-twitch-games"
    >
      Twitch Games Import
    </v-btn>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { replicantModule } from '../../plugin/replicant';

@Component
export default class App extends Vue {
  get isGoogleApiDefined (): boolean {
    return replicantModule.googleApiDefined;
  }
}
</script>
