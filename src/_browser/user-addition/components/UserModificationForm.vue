<template>
  <v-app>
    <v-sheet
      color="transparent"
      class="pa-2"
    >
      <div class="text-right">
        <v-btn
          class="mb-4"
          fab
          small
          dark
          @click="close"
        >
          <v-icon x-small>
            fas fa-times
          </v-icon>
        </v-btn>
      </div>

      <v-text-field
        label="Name"
        :value="name"
        solo
        readonly
        hide-details
      ></v-text-field>

      <v-form class="my-2">
        <v-text-field
          v-model="nico"
          filled
          label="ニコニココミュニティ"
          placeholder="co...."
          hide-details
        ></v-text-field>

        <v-text-field
          v-model="youtube"
          filled
          label="Youtube"
          placeholder="チャンネル名"
          hide-details
        ></v-text-field>

        <v-text-field
          v-model="twitter"
          filled
          label="Twitter"
          placeholder="ツイッターID"
          prefix="@"
          hide-details
        ></v-text-field>

        <v-btn
          class="mt-2"
          block
          color="primary"
          @click="updateUserAddition"
        >
          Update
        </v-btn>
      </v-form>
    </v-sheet>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import { userModificationModule as userModification } from '../userModification';
import { replicantModule } from '../../../plugin/replicant';

@Component
export default class UserModificationForm extends Vue {
  id = userModification.id;
  name = userModification.name;
  nico = userModification.nico;
  youtube = userModification.youtube;
  twitter = userModification.twitter;

  @Emit()
  close(): void {
    userModification.transitionToUserPanel();
  }

  @Emit()
  updateUserAddition (): void {
    if (!this.id) {
      return;
    }

    replicantModule.updateUserAddition({
      id: this.id,
      nico: this.nico,
      youtube: this.youtube,
      twitter: this.twitter
    });
    this.close();
  }
}
</script>
