import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { type Players } from '../components/Game/Game';
import { useWebSocket } from '../context/WebSocketContext';

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

interface UseHandleWebsocketMessageProps {
  playerId: string;
  setPlayers: Dispatch<SetStateAction<Players>>;
}

const useHandleWebsocketMessage = ({
  playerId,
  setPlayers,
}: UseHandleWebsocketMessageProps) => {
  const { socket } = useWebSocket();

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (event: MessageEvent) => {
      console.log(event.data);
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
  }, [playerId, setPlayers, socket]);
};

export default useHandleWebsocketMessage;
