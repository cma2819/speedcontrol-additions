<template>
  <v-expansion-panel>
    <v-expansion-panel-header>
      <span class="font-weight-bold">{{ player.name }}</span>
    </v-expansion-panel-header>
    <v-expansion-panel-content>
      <div>
        <v-chip
          label
          small
          class="mr-1 mb-1"
          color="#dddddd"
          text-color="#000000"
        >
          ID
        </v-chip>
        {{ player.id }}
      </div>
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
        {{ player.social.twitch }}
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
        {{ userAddition.social.nico }}
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
        {{ userAddition.social.youtube }}
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
        {{ userAddition.social.twitter }}
      </div>
      <div>
        <v-btn
          class="mx-2"
          fab
          small
          outlined
          color="white"
          @click="openUserModification"
        >
          <v-icon x-small>
            fas fa-edit
          </v-icon>
        </v-btn>
      </div>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator';
import { RunDataPlayer } from '../../../../types/RunData';
import { COLORS } from '../../../plugin/styles';
import { SpeedcontrolUserAddition } from '../../../../nodecg/generated/speedcontrolUserAddition';
import { userModificationModule as userModification } from '../userModification';

@Component
export default class AdditionUserPanel extends Vue {
  @Prop(Object) readonly player!: RunDataPlayer;
  @Prop(Object) readonly userAddition!: SpeedcontrolUserAddition;
  readonly colors = COLORS;

  @Emit()
  async openUserModification(): Promise<void> {
    userModification.transitionToModification({name: this.player.name, userAddition: this.userAddition});
  }
}
</script>
