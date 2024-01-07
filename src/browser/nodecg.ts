import { BundleNodecgInstance } from '../nodecg/nodecg';
import { SpeedcontrolInstance } from './global';

export const useBundleNodecg = (): BundleNodecgInstance => {
  return nodecg as BundleNodecgInstance;
};

export const useSpeedcontrolNodecg = (): SpeedcontrolInstance => {
  return nodecg as SpeedcontrolInstance;
};
