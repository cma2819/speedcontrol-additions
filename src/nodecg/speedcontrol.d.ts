import { RunDataArray } from './external/speedcontrol/runDataArray';
import { RunDataActiveRunSurrounding } from './external/speedcontrol/runDataActiveRunSurrounding';
import { Timer } from './external/speedcontrol/timer';

type SpeedcontrolReplicantMap = {
  runDataArray: RunDataArray;
  runDataActiveRunSurrounding: RunDataActiveRunSurrounding;
  timer: Timer;
};

type SpeedcontrolReplicantName = (
    'runDataArray' |
    'runDataActiveRunSurrounding' |
    'timer'
);

type SpeedcontrolRun = RunDataArray[number];
type SpeedcontrolRunner = SpeedcontrolRun['teams'][number]['players'][number];

export type {
  RunDataArray,
  RunDataActiveRunSurrounding,
  Timer,
  SpeedcontrolReplicantMap,
  SpeedcontrolReplicantName,
  SpeedcontrolRun,
  SpeedcontrolRunner,
};
