import { Physics } from '@react-three/rapier';
import { useState, type FC } from 'react';

import Game from './components/Game/Game';
import { useWebSocket } from './context/WebSocketContext';
import ThreeCanvas from './layouts/ThreeCanvas';

const App: FC = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const matchIdInitialValue = urlParams.get('matchId');

  const { connectWebSocket } = useWebSocket();
  const [matchId, setMatchId] = useState(matchIdInitialValue ?? '');
  const [playerId, setPlayerId] = useState('');
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    connectWebSocket(matchId, playerId);
    setConnected(true);
  };

  return (
    <div style={{ height: '100%', width: '100%' }}>
      {!connected ? (
        <div>
          <h1>WebSocket Game</h1>
          <label>
            Match ID:
            <input
              type="text"
              value={matchId}
              onChange={(event) => setMatchId(event.target.value)}
            />
          </label>
          <br />
          <label>
            Player ID:
            <input
              type="text"
              value={playerId}
              onChange={(event) => setPlayerId(event.target.value)}
            />
          </label>
          <br />
          <button onClick={handleConnect}>Connect</button>
        </div>
      ) : (
        <ThreeCanvas>
          <Physics>
            <Game playerId={playerId} />
          </Physics>
        </ThreeCanvas>
      )}
    </div>
  );
};

export default App;
