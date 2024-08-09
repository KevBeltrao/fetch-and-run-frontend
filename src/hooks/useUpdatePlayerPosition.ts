import { type MeshProps, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

import { useWebSocket } from '../context/WebSocketContext';

import { MOVE_OPTIONS, type MoveOptions } from './useMoveState';

const TWENTY_FPS_INTERVAL = 1 / 20;

interface UseUpdatePlayerPositionProps {
  playerId: string;
  moveState: MoveOptions;
  playerRef: React.MutableRefObject<MeshProps | null>;
}

const useUpdatePlayerPosition = ({
  playerRef,
  playerId,
  moveState,
}: UseUpdatePlayerPositionProps) => {
  const lastTimeRef = useRef(0);
  const { socket } = useWebSocket();

  useFrame(({ clock }) => {
    if (!playerRef.current) return;

    const step = 0.1;
    let { x } = playerRef.current.position;
    const { y } = playerRef.current.position;

    if (moveState === MOVE_OPTIONS.LEFT) {
      x -= step;
    } else if (moveState === MOVE_OPTIONS.RIGHT) {
      x += step;
    }

    playerRef.current.position.set(x, y, 0);

    const elapsedTime = clock.getElapsedTime();
    const timeSinceLastCall = elapsedTime - lastTimeRef.current;

    if (timeSinceLastCall < TWENTY_FPS_INTERVAL) return;

    const moveMessage = JSON.stringify({
      type: 'playerMove',
      payload: {
        playerId,
        x,
        y,
      },
    });
    socket?.send(moveMessage);
    lastTimeRef.current = elapsedTime;
  });
};

export default useUpdatePlayerPosition;
