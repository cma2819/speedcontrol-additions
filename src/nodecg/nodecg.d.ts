import { CreateNodecgConstructor, CreateNodecgInstance } from 'ts-nodecg/browser';
import { Configschema } from './generated/configschema';
import { MessageMap } from './messages';
import { ReplicantMap } from './replicants';
import { SpeedcontrolReplicantMap } from './speedcontrol';

export type BundleNodecgInstance = CreateNodecgInstance<
'speedcontrol-additions',
Configschema,
ReplicantMap,
MessageMap
>;

export type BundleNodecgConstructor = CreateNodecgConstructor<
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

export type SpeedcontrolConstructor = CreateNodecgConstructor<
'nodecg-speedcontrol',
never,
SpeedcontrolReplicantMap,
never,
true
>;
