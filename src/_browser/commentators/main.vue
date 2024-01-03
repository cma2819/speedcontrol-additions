<template>
  <v-app :style="{minHeight: '520px'}">
    <transition name="view-transition">
      <commentator-modification-form v-if="isModification"></commentator-modification-form>
      <commentator-creation-form v-else-if="isCreation"></commentator-creation-form>
      <div v-else>
        <div class="ma-2">
          Add commentator's information in speedcontrol bundle.
        </div>
        <div :style="{height: '480px',overflowY: 'scroll'}">
          <commentator-list></commentator-list>
        </div>
        <v-btn
          class="my-2"
          block
          color="success"
          @click="openCreationForm"
        >
          Add Commentator
        </v-btn>
      </div>
    </transition>
  </v-app>
</template>

<script lang="ts">
import { Vue, Component, Emit } from 'vue-property-decorator';
import { commentatorModificationModule as commentatorModification, transitionStatus } from './commentatorModification';
import CommentatorList from './components/CommentatorList.vue';
import CommentatorModificationForm from './components/CommentatorModificationForm.vue';
import CommentatorCreationForm from './components/CommentatorCreationForm.vue';

@Component({
  components: {
    CommentatorList,
    CommentatorModificationForm,
    CommentatorCreationForm,
  }
})
export default class App extends Vue {
  get isModification(): boolean {
    return commentatorModification.transition === transitionStatus.modificationForm;
  }

  get isCreation(): boolean {
    return commentatorModification.transition === transitionStatus.creationForm;
  }

  @Emit()
  openCreationForm(): void {
    commentatorModification.transitionToCreation();
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
