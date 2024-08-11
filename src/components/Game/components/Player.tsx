import { type FC } from 'react';

interface PlayerProps {
  position: [number, number, number];
  color: string;
}

const Player: FC<PlayerProps> = ({ position, color }) => (
  <mesh position={position}>
    <boxGeometry args={[0.5, 0.5, 0.5]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

export default Player;
