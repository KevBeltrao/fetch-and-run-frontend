import { type MeshProps } from '@react-three/fiber';
import { type FC, useRef, useState } from 'react';

import useMoveState from '../../hooks/useMoveState';
import useHandleWebsocketMessage from '../../hooks/useHandleWebsocketMessage';
import useUpdatePlayerPosition from '../../hooks/useUpdatePlayerPosition';

import Player from './components/Player';

interface GameProps {
  playerId: string;
}

export type Players = Record<string, { x: number; y: number; color: string }>;

const Game: FC<GameProps> = ({ playerId }) => {
  const [players, setPlayers] = useState<Players>({});

  const playerRef = useRef<MeshProps>(null);

  const moveState = useMoveState();

  useUpdatePlayerPosition({ playerRef, playerId, moveState });
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
      <Player ref={playerRef} position={[0, 0, 0]} color="red" />

      <ambientLight />
      <pointLight position={[10, 10, 10]} />
    </>
  );
};

export default Game;
