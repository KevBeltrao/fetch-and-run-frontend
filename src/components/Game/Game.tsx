import { RigidBody, type RapierRigidBody } from '@react-three/rapier';
import { useRef, useState, type FC } from 'react';

import useHandleWebsocketMessage from '../../hooks/useHandleWebsocketMessage';
import useMoveState from '../../hooks/useMoveState';
import useUpdatePlayerPosition from '../../hooks/useUpdatePlayerPosition';

import Player from './components/Player';

interface GameProps {
  playerId: string;
}

export type Players = Record<string, { x: number; y: number; color: string }>;

const Game: FC<GameProps> = ({ playerId }) => {
  const [players, setPlayers] = useState<Players>({});

  const rigidBodyRef = useRef<RapierRigidBody>(null);
  const isOnGround = useRef(true);

  const { moveState } = useMoveState({ rigidBodyRef, isOnGround });

  useUpdatePlayerPosition({
    rigidBodyRef,
    playerId,
    moveState,
    isOnGround,
  });
  useHandleWebsocketMessage({ playerId, setPlayers });

  return (
    <>
      {Object.keys(players).map((id) => (
        <Player
          key={id}
          position={[players[id].x, players[id].y, 0]}
          color={players[id].color}
        />
      ))}

      <RigidBody
        restitution={0}
        ref={rigidBodyRef}
        colliders="cuboid"
        lockRotations
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject?.name === 'ground') {
            isOnGround.current = true;
          }
        }}
        onCollisionExit={({ other }) => {
          if (other.rigidBodyObject?.name === 'ground') {
            isOnGround.current = false;
          }
        }}
      >
        <Player position={[0, 0, 0]} color="red" />
      </RigidBody>

      <RigidBody name="ground" type="fixed" colliders="cuboid">
        <mesh position={[2, 0, 0]}>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshBasicMaterial color="purple" />
        </mesh>
      </RigidBody>

      <RigidBody name="ground" type="fixed" colliders="cuboid">
        <mesh position={[0, -1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <boxGeometry args={[15, 6, 0.3]} />
          <meshBasicMaterial color="blue" />
        </mesh>
      </RigidBody>

      <ambientLight />
      <pointLight position={[10, 10, 10]} />
    </>
  );
};

export default Game;
