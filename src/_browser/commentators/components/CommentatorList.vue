<template>
  <v-expansion-panels
    accordion
    class="body-2"
  >
    <commentator-panel
      v-for="(commentator, index) in commentatorArray"
      :key="index"
      :commentator="commentator"
    ></commentator-panel>
  </v-expansion-panels>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { replicantModule } from '../../../plugin/replicant';
import CommentatorPanel from './CommentatorPanel.vue';
import { CommentatorArray } from '../../../../nodecg/generated/commentatorArray';

@Component({
  components: {
    CommentatorPanel
  }
})
export default class CommentatorList extends Vue {
  get commentatorArray(): CommentatorArray {
    return replicantModule.commentatorArray;
  }
}
</script>