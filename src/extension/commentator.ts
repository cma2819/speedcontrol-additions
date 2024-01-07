import { v4 as uuid} from 'uuid';
import { Commentator } from '../nodecg/generated/commentator';
import { BundleNodecgInstance, NodeCG } from './nodecg';

type Social = {
  twitch?: string;
  nico?: string;
  youtube?: string;
  twitter?: string;
}

export const commentator = (_nodecg: NodeCG): void => {
  const nodecg = _nodecg as BundleNodecgInstance

  const logger = new nodecg.Logger(`${nodecg.bundleName}:commentator`);
  const commentatorArrayRep = nodecg.Replicant('commentatorArray', {
      defaultValue: []
  });

  const updateCommentator = (commentator: Commentator): void => {

    if (!commentatorArrayRep.value) { return; }

    const commentatorIndex = commentatorArrayRep.value.findIndex((repCommentator) => {
      return repCommentator.id === commentator.id;
    });

    if (commentatorIndex < -1) { return; }

    commentatorArrayRep.value[commentatorIndex] = commentator;

    logger.info(`Update commentator ${commentatorIndex}`);
  }

  const createCommentator = ({name, social, assigned}: {name: string; social: Social; assigned: string[]}): void => {

    if (!commentatorArrayRep.value) { return; }

    commentatorArrayRep.value.push({
      id: uuid(),
      name,
      social : {
        twitch: social.twitch !== '' ? social.twitch : undefined,
        nico: social.nico !== '' ? social.nico : undefined,
        youtube: social.youtube !== '' ? social.youtube : undefined,
        twitter: social.twitter !== '' ? social.twitter : undefined,
      },
      assignedRunIdArray: assigned
    });

    logger.info(`Add commentator ${JSON.stringify({ name, social, assigned })}`);
  }

  const removeCommentator = (id: string): void => {

    if (!commentatorArrayRep.value) { return; }

    commentatorArrayRep.value = commentatorArrayRep.value.filter((commentator) => {
      return commentator.id !== id;
    });

    logger.info(`Remove commentator, id=${id}`);
  }

  nodecg.listenFor('updateCommentator', (data, ack) => {
    updateCommentator(data);

    if (ack && !ack.handled) {
      ack(null);
    }
  });

  nodecg.listenFor('createCommentator', (data, ack) => {
    createCommentator({
      name: data.name,
      social: data.social,
      assigned: data.assignedRunIdArray,
    });

    if (ack && !ack.handled) {
      ack(null);
    }
  });

  nodecg.listenFor('removeCommentator', (data, ack) => {
    removeCommentator(data);

    if (ack && !ack.handled) {
      ack(null);
    }
  });
}
