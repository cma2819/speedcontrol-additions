<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <span class="font-weight-bold">{{ commentator.name }}</span>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <div>
        <v-chip
          label
          small
          class="mr-1 mb-2"
          :color="colors.twitch.primary"
          :text-color="colors.twitch.text"
        >
          Twitch
        </v-chip>
        {{ commentator.social.twitch }}
      </div>
      <div>
        <v-chip
          label
          small
          class="mr-1 mb-2"
          :color="colors.nico.primary"
          :text-color="colors.nico.text"
        >
          niconico
        </v-chip>
        {{ commentator.social.nico }}
      </div>
      <div>
        <v-chip
          label
          small
          class="mr-1 mb-2"
          :color="colors.youtube.primary"
          :text-color="colors.youtube.text"
        >
          Youtube
        </v-chip>
        {{ commentator.social.youtube }}
      </div>
      <div>
        <v-chip
          label
          small
          class="mr-1 mb-2"
          :color="colors.twitter.primary"
          :text-color="colors.twitter.text"
        >
          Twitter
        </v-chip>
        {{ commentator.social.twitter }}
      </div>
      <div>
        <v-chip
          label
          small
          class="mr-1 mb-1"
          color="#dddddd"
          text-color="#000000"
        >
          Assigned
        </v-chip>
        <div class="ml-2">
          <div
            v-for="(runExpression, index) in assignedRunNames"
            :key="index"
            class="text-truncate"
          >
            {{ runExpression }}
          </div>
        </div>
      </div>
      <div class="mt-2">
        <v-btn
          class="mx-2"
          fab
          small
          outlined
          color="white"
          @click="openCommentatorModification"
        >
          <v-icon x-small>
            fas fa-edit
          </v-icon>
        </v-btn>
        <v-btn
          class="mx-2"
          fab
          small
          outlined
          color="white"
          @click="deleteCommentator"
        >
          <v-icon x-small>
            fas fa-user-minus
          </v-icon>
        </v-btn>
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { Commentator } from '../../../../nodecg/generated/commentator';
import { COLORS } from '../../../plugin/styles';
import { commentatorModificationModule as commentatorModification } from '../commentatorModification';
import { speedcontrolModule } from '../../../plugin/speedcontrol';
import { replicantModule } from '../../../plugin/replicant';

@Component
export default class CommentatorPanel extends Vue {
  @Prop(Object) readonly commentator!: Commentator;
  readonly colors = COLORS;

  get assignedRunNames(): string[] {
    return this.commentator.assignedRunIdArray.map((runId) => {
      const assigndRun = speedcontrolModule.runDataArray.find((runData) => {
        return runData.externalID === runId;
      });
      if (assigndRun) {
        return `${assigndRun.category} - ${assigndRun.game}`;
      }
      return 'Unknown Run';
    });
  }

  @Emit()
  async openCommentatorCreation(): Promise<void> {
    commentatorModification.transitionToCreation();
  }

  @Emit()
  async openCommentatorModification(): Promise<void> {
    commentatorModification.transitionToModification(this.commentator);
  }

  @Emit()
  async deleteCommentator(): Promise<void> {
    replicantModule.removeCommentator(this.commentator.id);
  }

}
</script>
