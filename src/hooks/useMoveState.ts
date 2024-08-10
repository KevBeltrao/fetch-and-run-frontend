import type { RapierRigidBody } from '@react-three/rapier';
import {
  useEffect,
  useState,
  type MutableRefObject,
  type RefObject,
} from 'react';

export const RUNNING_OPTIONS = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  STOP: 'STOP',
} as const;

export type RunningOptions =
  (typeof RUNNING_OPTIONS)[keyof typeof RUNNING_OPTIONS];
export interface MoveOptions {
  running: RunningOptions;
}

interface UseMoveStateProps {
  rigidBodyRef: RefObject<RapierRigidBody>;
  isOnGround: MutableRefObject<boolean>;
}

const useMoveState = ({ rigidBodyRef, isOnGround }: UseMoveStateProps) => {
  const [moveState, setMoveState] = useState<MoveOptions>({
    running: RUNNING_OPTIONS.STOP,
  });

  useEffect(() => {
    const runningCommands: Record<string, RunningOptions> = {
      a: RUNNING_OPTIONS.LEFT,
      arrowleft: RUNNING_OPTIONS.LEFT,
      d: RUNNING_OPTIONS.RIGHT,
      arrowright: RUNNING_OPTIONS.RIGHT,
    } as const;

    const jumpCommands: Record<string, boolean> = {
      w: true,
      arrowup: true,
      ' ': true,
    } as const;

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (key in runningCommands) {
        return setMoveState((prevState) => ({
          ...prevState,
          running: runningCommands[key],
        }));
      }

      if (key in jumpCommands && rigidBodyRef.current && isOnGround.current) {
        rigidBodyRef.current.applyImpulse({ x: 0, y: 0.5, z: 0 }, true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();

      if (
        key in runningCommands &&
        moveState.running === runningCommands[key]
      ) {
        setMoveState((prevState) => ({
          ...prevState,
          running: RUNNING_OPTIONS.STOP,
        }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOnGround, moveState, rigidBodyRef]);

  return { moveState, setMoveState };
};

export default useMoveState;
