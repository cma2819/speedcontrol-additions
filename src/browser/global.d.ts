import {
  CreateNodecgInstance,
  CreateNodecgConstructor
} from 'ts-nodecg/browser';
import { SpeedcontrolReplicantMap } from '../nodecg/speedcontrol';
import { BundleNodecgConstructor, BundleNodecgInstance } from '../nodecg/nodecg';

type SpeedcontrolInstance = CreateNodecgInstance<
'nodecg-speedcontrol',
never,
SpeedcontrolReplicantMap,
never,
true
>;

type SpeedcontrolConstructor = CreateNodecgConstructor<
'nodecg-speedcontrol',
never,
SpeedcontrolReplicantMap,
never,
true
>;

declare global {
  const nodecg: BundleNodecgInstance | SpeedcontrolInstance;

  const NodeCG: BundleNodecgConstructor | SpeedcontrolConstructor;
}
