import { useFrame } from '@react-three/fiber';
import { useRef, type RefObject } from 'react';
import * as THREE from 'three';

import { useWebSocket } from '../context/WebSocketContext';

import { RUNNING_OPTIONS, type MoveOptions } from './useMoveState';

const TWENTY_FPS_INTERVAL = 1 / 20;

interface UseUpdatePlayerPositionProps {
  playerId: string;
  moveState: MoveOptions;
  playerRef: RefObject<THREE.Mesh | null>;
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

    const step = 0.01;
    let { x } = playerRef.current.position;
    const { y } = playerRef.current.position;

    const worldPosition = new THREE.Vector3();
    playerRef.current?.getWorldPosition(worldPosition);
    const { y: trueY } = worldPosition;

    if (moveState.running === RUNNING_OPTIONS.LEFT) {
      x -= step;
    } else if (moveState.running === RUNNING_OPTIONS.RIGHT) {
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
        y: trueY,
      },
    });
    socket?.send(moveMessage);
    lastTimeRef.current = elapsedTime;
  });
};

export default useUpdatePlayerPosition;
