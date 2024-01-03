<template>
  <v-app :style="{minHeight: '520px'}">
    <transition name="view-transition">
      <user-modification-form v-if="isModification"></user-modification-form>
      <div v-else>
        <div class="ma-2">
          Add runner's information in speedcontrol bundle.
        </div>
        <div :style="{height: '480px',overflowY: 'scroll'}">
          <addition-user-list></addition-user-list>
        </div>
      </div>
    </transition>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { userModificationModule as userModification, transitionStatus } from './userModification';
import AdditionUserList from './components/AdditionUserList.vue';
import UserModificationForm from './components/UserModificationForm.vue';

@Component({
  components: {
    AdditionUserList,
    UserModificationForm
  }
})
export default class App extends Vue {
  get isModification(): boolean {
    if (userModification.transition === transitionStatus.modificationForm) {
      return true;
    }
    return false;
  }
}
</script>

<style scoped>
  .view-transition-enter-active {
    transition: all .5s;
  }

  .view-transition-enter, .view-transition-leave {
    opacity: 0;
    transform: translateY(10px);
  }
</style>
