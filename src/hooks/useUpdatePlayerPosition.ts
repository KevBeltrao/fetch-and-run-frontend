import { useFrame } from '@react-three/fiber';
import { type RapierRigidBody } from '@react-three/rapier';
import { useRef, type MutableRefObject, type RefObject } from 'react';
import * as THREE from 'three';

import { useWebSocket } from '../context/WebSocketContext';

import { RUNNING_OPTIONS, type MoveOptions } from './useMoveState';

const TWENTY_FPS_INTERVAL = 1 / 20;

interface UseUpdatePlayerPositionProps {
  playerId: string;
  moveState: MoveOptions;
  rigidBodyRef: RefObject<RapierRigidBody>;
  isOnGround: MutableRefObject<boolean>;
}

const useUpdatePlayerPosition = ({
  playerId,
  moveState,
  rigidBodyRef,
  isOnGround,
}: UseUpdatePlayerPositionProps) => {
  const lastTimeRef = useRef(0);
  const { socket } = useWebSocket();

  useFrame(({ clock }) => {
    if (!rigidBodyRef.current) return;

    const speed = 1;
    const jumpStrength = 5;

    const velocity = { x: 0, y: 0, z: 0 };

    if (moveState.running === RUNNING_OPTIONS.LEFT) {
      velocity.x = -speed;
    } else if (moveState.running === RUNNING_OPTIONS.RIGHT) {
      velocity.x = speed;
    } else if (moveState.running === RUNNING_OPTIONS.STOP) {
      velocity.x = 0;
    }

    if (moveState.isJumping && isOnGround.current) {
      velocity.y = jumpStrength;
    } else {
      const currentVelocity = rigidBodyRef.current.linvel();
      velocity.y = currentVelocity.y;
    }

    rigidBodyRef.current.setLinvel(
      new THREE.Vector3(velocity.x, velocity.y, velocity.z),
      true,
    );

    const elapsedTime = clock.getElapsedTime();
    const timeSinceLastCall = elapsedTime - lastTimeRef.current;

    if (timeSinceLastCall < TWENTY_FPS_INTERVAL) return;

    const { x, y } = rigidBodyRef.current.translation();

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
