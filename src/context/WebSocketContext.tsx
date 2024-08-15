import {
  createContext,
  type FC,
  type PropsWithChildren,
  useContext,
  useState,
} from 'react';

const WebSocketContext = createContext<WebSocketContextType | null>(null);

interface WebSocketContextType {
  socket: WebSocket | null;
  connectWebSocket: (matchId: string, playerId: string) => void;
}

const WebSocketProvider: FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  const connectWebSocket: WebSocketContextType['connectWebSocket'] = (
    matchId,
    playerId,
  ) => {
    const websocket = new WebSocket(
      `${import.meta.env.VITE_API_URL}/websocket?matchId=${matchId}`,
    );

    websocket.onopen = () => {
      console.log('WebSocket is open now.');
      const initialMessage = JSON.stringify({
        type: 'initial',
        payload: {
          playerId: playerId,
        },
      });
      websocket.send(initialMessage);
    };

    websocket.onmessage = (event) => {
      console.log('Message from server:', event.data);
    };

    websocket.onclose = () => {
      console.log('WebSocket is closed now.');
    };

    websocket.onerror = (error) => {
      console.log('WebSocket error:', error);
    };

    setSocket(websocket);
  };

  return (
    <WebSocketContext.Provider value={{ socket, connectWebSocket }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

export default WebSocketProvider;
