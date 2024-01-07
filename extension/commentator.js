"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentator = void 0;
const uuid_1 = require("uuid");
const commentator = (_nodecg) => {
    const nodecg = _nodecg;
    const logger = new nodecg.Logger(`${nodecg.bundleName}:commentator`);
    const commentatorArrayRep = nodecg.Replicant('commentatorArray', {
        defaultValue: []
    });
    const updateCommentator = (commentator) => {
        if (!commentatorArrayRep.value) {
            return;
        }
        const commentatorIndex = commentatorArrayRep.value.findIndex((repCommentator) => {
            return repCommentator.id === commentator.id;
        });
        if (commentatorIndex < -1) {
            return;
        }
        commentatorArrayRep.value[commentatorIndex] = commentator;
        logger.info(`Update commentator ${commentatorIndex}`);
    };
    const createCommentator = ({ name, social, assigned }) => {
        if (!commentatorArrayRep.value) {
            return;
        }
        commentatorArrayRep.value.push({
            id: (0, uuid_1.v4)(),
            name,
            social: {
                twitch: social.twitch !== '' ? social.twitch : undefined,
                nico: social.nico !== '' ? social.nico : undefined,
                youtube: social.youtube !== '' ? social.youtube : undefined,
                twitter: social.twitter !== '' ? social.twitter : undefined,
            },
            assignedRunIdArray: assigned
        });
        logger.info(`Add commentator ${JSON.stringify({ name, social, assigned })}`);
    };
    const removeCommentator = (id) => {
        if (!commentatorArrayRep.value) {
            return;
        }
        commentatorArrayRep.value = commentatorArrayRep.value.filter((commentator) => {
            return commentator.id !== id;
        });
        logger.info(`Remove commentator, id=${id}`);
    };
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
};
exports.commentator = commentator;
