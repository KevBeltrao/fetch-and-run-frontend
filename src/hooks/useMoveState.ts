import { useEffect, useState } from 'react';

export const MOVE_OPTIONS = {
  LEFT: 'LEFT',
  RIGHT: 'RIGHT',
  STOP: 'STOP',
} as const;

export type MoveOptions = (typeof MOVE_OPTIONS)[keyof typeof MOVE_OPTIONS];

const useMoveState = () => {
  const [moveState, setMoveState] = useState<MoveOptions>(MOVE_OPTIONS.STOP);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'a') {
        setMoveState(MOVE_OPTIONS.LEFT);
      }

      if (event.key === 'd') {
        setMoveState(MOVE_OPTIONS.RIGHT);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === 'a' && moveState === MOVE_OPTIONS.LEFT) {
        setMoveState(MOVE_OPTIONS.STOP);
      }

      if (event.key === 'd' && moveState === MOVE_OPTIONS.RIGHT) {
        setMoveState(MOVE_OPTIONS.STOP);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [moveState]);

  return moveState;
};

export default useMoveState;
