import { CreateNodecgInstance } from 'ts-nodecg/server'
import { Configschema } from '../nodecg/generated';
import { ReplicantMap } from '../nodecg/replicants';
import { SpeedcontrolReplicantMap } from '../nodecg/speedcontrol';

export type BundleNodecgInstance = CreateNodecgInstance<
'speedcontrol-additions',
Configschema,
ReplicantMap,
MessageMap
>;

export type SpeedcontrolInstance = CreateNodecgInstance<
'nodecg-speedcontrol',
never,
SpeedcontrolReplicantMap,
never,
true
>;

export type NodeCG = BundleNodecgInstance | SpeedcontrolInstance
