import { Canvas, type MeshProps } from '@react-three/fiber';
import { type FC, useEffect, useRef, useState } from 'react';

import { useWebSocket } from '../../context/WebSocketContext';

import Player from './components/Player';

interface UpdateStateMessage {
  type: 'updateState';
  payload: {
    Players: Record<string, { X: number; Y: number }>;
  };
}

type UpdateStateMessagePlayer =
  UpdateStateMessage['payload']['Players'][string];

const isUpdateStateMessage = (
  message: unknown,
): message is UpdateStateMessage => {
  if (typeof message !== 'object' || message === null) return false;
  if (!('type' in message)) return false;
  if (!('payload' in message)) return false;
  if (typeof message.payload !== 'object' || message.payload === null)
    return false;
  if (!('Players' in message.payload)) return false;
  if (
    typeof message.payload.Players !== 'object' ||
    message.payload.Players === null
  )
    return false;

  return true;
};

interface GameProps {
  playerId: string;
}

type Players = Record<string, { x: number; y: number; color: string }>;

const Game: FC<GameProps> = ({ playerId }) => {
  const { socket } = useWebSocket();
  const [players, setPlayers] = useState<Players>({});
  const playerRef = useRef<MeshProps>(null);
  console.log({ players });

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);

      if (isUpdateStateMessage(message)) {
        setPlayers((prevPlayers) =>
          Object.entries<UpdateStateMessagePlayer>(
            message.payload.Players,
          ).reduce((acc, [id, player]) => {
            if (id === playerId) return acc;

            return {
              ...acc,
              [id]: {
                x: player.X,
                y: player.Y,
                color: 'blue',
              },
            };
          }, prevPlayers),
        );
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => socket.removeEventListener('message', handleMessage);
  }, [playerId, socket]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!playerRef.current) return;

      const step = 0.1;
      let { x, y } = playerRef.current.position;

      switch (event.key) {
        case 'w':
          y += step;
          break;
        case 'a':
          x -= step;
          break;
        case 's':
          y -= step;
          break;
        case 'd':
          x += step;
          break;
        default:
          return;
      }

      playerRef.current.position.set(x, y, 0);

      const moveMessage = JSON.stringify({
        type: 'playerMove',
        payload: { playerId, x, y },
      });
      socket?.send(moveMessage);
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [playerId, socket]);

  return (
    <Canvas style={{ height: '100%', width: '100%' }}>
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
    </Canvas>
  );
};

export default Game;
