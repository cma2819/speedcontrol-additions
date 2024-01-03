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


      <v-form class="my-2">

        <v-text-field
          v-model="name"
          label="Name"
          filled
          hide-details
        ></v-text-field>

        <v-text-field
          v-model="twitch"
          filled
          label="Twitch"
          hide-details
        ></v-text-field>

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

        <v-select
          v-model="assigned"
          :items="assignRuns"
          label="担当"
          multiple
          chips
          filled
        ></v-select>

        <v-btn
          class="mt-2"
          block
          color="primary"
          @click="createCommentator"
        >
          Create
        </v-btn>
      </v-form>
    </v-sheet>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import { commentatorModificationModule as commentatorModification } from '../commentatorModification';
import { replicantModule } from '../../../plugin/replicant';
import { speedcontrolModule } from '../../../plugin/speedcontrol';

@Component
export default class CommentatorCreationForm extends Vue {
  twitch = commentatorModification.twitch;
  name = commentatorModification.name;
  nico = commentatorModification.nico;
  youtube = commentatorModification.youtube;
  twitter = commentatorModification.twitter;
  assigned = commentatorModification.assignedRunIdArray;

  get assignRuns(): {id: string; text: string; value: string; }[] {
    return speedcontrolModule.runDataArray.map((run) => {
      return {
        id: run.id,
        text: `${run.game} - ${run.category}`,
        value: run.externalID
      };
    })
  }

  @Emit()
  close(): void {
    commentatorModification.transitionToCommentator();
  }

  @Emit()
  createCommentator (): void {
      replicantModule.createCommentator({
        name: this.name,
        twitch: this.twitch,
        nico: this.nico,
        youtube: this.youtube,
        twitter: this.twitter,
        assignedRunIdArray: this.assigned,
      });
      this.close();
    }
  }
}
</script>
