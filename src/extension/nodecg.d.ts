import { CreateNodecgInstance } from 'ts-nodecg/server';
import { Configschema } from '../nodecg/generated/configschema';
import { ReplicantMap } from '../nodecg/replicants';
import { SpeedcontrolReplicantMap } from '../nodecg/speedcontrol';
import { MessageMap } from '../nodecg/messages';

type SpeedcontrolNodeCG = CreateNodecgInstance<
  'nodecg-speedcontrol',
  {},
  SpeedcontrolReplicantMap,
  {},
  true
>

export type NodeCG = CreateNodecgInstance<
  'ome-speedrun-layout',
  Configschema,
  ReplicantMap,
  MessageMap
> & SpeedcontrolNodeCG
