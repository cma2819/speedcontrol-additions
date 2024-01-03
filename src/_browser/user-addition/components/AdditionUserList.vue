<template>
  <v-expansion-panels
    accordion
    class="body-2"
  >
    <addition-user-panel
      v-for="(user, index) in users"
      :key="index"
      :player="user.player"
      :user-addition="user.userAddition"
    ></addition-user-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { replicantModule } from '../../../plugin/replicant';
import AdditionUserPanel from './AdditionUserPanel.vue';
import { SpeedcontrolPlayer } from '../../../../nodecg/generated/speedcontrolPlayer';
import { SpeedcontrolUserAddition } from '../../../../nodecg/generated/speedcontrolUserAddition';
import { SpeedcontrolUserAdditionArray, SpeedcontrolPlayerArray } from '../../../../nodecg/replicants';

@Component({
  components: {
    AdditionUserPanel
  }
})
export default class AdditionUserList extends Vue {
  get userAdditionArray(): SpeedcontrolUserAdditionArray {
    return replicantModule.speedcontrolUserAdditionArray;
  }
  get playerArray(): SpeedcontrolPlayerArray {
    return replicantModule.speedcontrolPlayerArray;
  }

  get users(): {
    player: SpeedcontrolPlayer | undefined;
    userAddition: SpeedcontrolUserAddition;
  }[] {
    return this.userAdditionArray.map((userAddition: SpeedcontrolUserAddition) => {
      const speedcontrolPlayer = this.playerArray.find((player: SpeedcontrolPlayer) => {
        return player.id === userAddition.id;
      });
      return {
        player: speedcontrolPlayer,
        userAddition: userAddition
      };
    });
  }
}
</script>
