import { type Dispatch, type SetStateAction, useEffect } from 'react';

import { type Players } from '../components/Game/Game';
import { useWebSocket } from '../context/WebSocketContext';

interface UpdateStateMessage {
  type: 'updateState';
  payload: Record<string, { X: number; Y: number }>;
}

interface PlayerLeaveMessage {
  type: 'playerLeave';
  payload: {
    playerId: string;
  };
}

type UpdateStateMessagePlayer = UpdateStateMessage['payload'][string];

const isUpdateStateMessage = (
  message: unknown,
): message is UpdateStateMessage => {
  if ((message as UpdateStateMessage).type !== 'updateState') return false;
  if (
    typeof (message as UpdateStateMessage).payload !== 'object' ||
    (message as UpdateStateMessage).payload === null
  )
    return false;

  return true;
};

const isPlayerLeaveMessage = (
  message: unknown,
): message is PlayerLeaveMessage => {
  if ((message as PlayerLeaveMessage).type !== 'playerLeave') return false;
  if (typeof (message as PlayerLeaveMessage).payload?.playerId !== 'string')
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
      const message = JSON.parse(event.data);

      if (isUpdateStateMessage(message)) {
        return setPlayers((prevPlayers) =>
          Object.entries<UpdateStateMessagePlayer>(message.payload).reduce(
            (acc, [id, player]) => {
              if (id === playerId) return acc;

              return {
                ...acc,
                [id]: {
                  x: player.X,
                  y: player.Y,
                  color: 'blue',
                },
              };
            },
            prevPlayers,
          ),
        );
      }

      if (isPlayerLeaveMessage(message)) {
        return setPlayers((prevPlayers) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { [message.payload.playerId]: _, ...rest } = prevPlayers;
          return rest;
        });
      }
    };

    socket.addEventListener('message', handleMessage);
    return () => socket.removeEventListener('message', handleMessage);
  }, [playerId, setPlayers, socket]);
};

export default useHandleWebsocketMessage;
