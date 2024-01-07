import { clone } from 'lodash';
import React, { createContext, ReactNode, useEffect, useState } from 'react';
import { RunDataArray, SpeedcontrolRunner } from '../nodecg/speedcontrol';
import { useBundleNodecg, useSpeedcontrolNodecg } from './nodecg';
import { CommentatorArray, SpeedcontrolUserAdditionArray } from '../nodecg/replicants';

type Replicants = {
  userAdditions: SpeedcontrolUserAdditionArray;
  commentators: CommentatorArray;
  speedcontrolRunners: SpeedcontrolRunner[];
  speedcontrolRuns: RunDataArray;
};

export const ReplicantContext = createContext<Partial<Replicants>>({});

type Props = {
  children: ReactNode;
};

export const ReplicantProvider = ({ children }: Props) => {
  const nodecg = useBundleNodecg();
  const speedcontrol = useSpeedcontrolNodecg();

  const [
    userAdditions, setUserAdditions,
  ] = useState<SpeedcontrolUserAdditionArray>();

  const [
    commentators, setCommentators,
  ] = useState<CommentatorArray>();

  const [
    speedcontrolRunners, setSpeedcontrolRunners,
  ] = useState<SpeedcontrolRunner[]>();

  const [
    speedcontrolRuns, setSpeedcontrolRuns,
  ] = useState<RunDataArray>();

  useEffect(() => {
    nodecg.Replicant('speedcontrolUserAdditionArray').on('change', (newVal) => {
      setUserAdditions(clone(newVal));
    });

    nodecg.Replicant('commentatorArray').on('change', (newVal) => {
      setCommentators(clone(newVal));
    });

    speedcontrol.Replicant(
      'runDataArray', 'nodecg-speedcontrol',
    ).on('change', (newVal) => {
      setSpeedcontrolRuns(clone(newVal));

      const runners = newVal.flatMap(
        run => run.teams.flatMap(t => t.players),
      ).filter(
        (player, index, src) => src.findIndex(
          p => p.id === player.id,
        ) === index,
      );
      setSpeedcontrolRunners(clone(runners));
    });
  }, []);

  return (
    <ReplicantContext.Provider value={{ userAdditions, speedcontrolRunners, commentators, speedcontrolRuns }}>
      { children }
    </ReplicantContext.Provider>
  );
};
