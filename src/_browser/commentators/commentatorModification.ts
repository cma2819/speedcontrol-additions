import { VuexModule, Module, Action, getModule, Mutation } from 'vuex-module-decorators';
import store from '../../plugin/store';
import { Commentator } from '../../../nodecg/generated/commentator';

export enum transitionStatus {
    commentators,
    creationForm,
    modificationForm
}

@Module({ dynamic: true, store, name: 'commentatorModification', namespaced: true })
class CommentatorModification extends VuexModule {
    transition = transitionStatus.commentators;
    name = '';
    id: string|null = null;
    twitch = '';
    nico = '';
    youtube = '';
    twitter = '';
    assignedRunIdArray: string[] = [];

    @Mutation
    public updateModifyCommentator(commentator: Commentator): void {
        this.name = commentator.name;
        this.id = commentator.id;
        this.twitch = commentator.social.twitch || '';
        this.nico = commentator.social.nico || '';
        this.youtube = commentator.social.youtube || '';
        this.twitter = commentator.social.twitter || '';
        this.assignedRunIdArray = commentator.assignedRunIdArray;
    }

    @Mutation
    public updateToCreation(): void {
      this.id = null;
      this.name = '';
      this.twitch = '';
      this.nico = '';
      this.youtube = '';
      this.twitter = '';
      this.assignedRunIdArray = [];
    }

    @Mutation
    public openModificationForm(): void {
        this.transition = transitionStatus.modificationForm;
    }

    @Mutation
    public closeForm(): void {
        this.transition = transitionStatus.commentators;
    }

    @Mutation
    public openCreationForm(): void {
        this.transition = transitionStatus.creationForm;
    }

    @Action
    public transitionToModification(commentator: Commentator): void {
        this.updateModifyCommentator(commentator);
        this.openModificationForm();
    }

    @Action transitionToCreation(): void {
      this.updateToCreation();
      this.openCreationForm();
    }

    @Action
    public transitionToCommentator(): void {
        this.closeForm();
    }
}

export const commentatorModificationModule = getModule(CommentatorModification);
