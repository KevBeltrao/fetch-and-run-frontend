import { forwardRef } from 'react';
import type { Mesh } from 'three';

interface PlayerProps {
  position: [number, number, number];
  color: string;
}

const Player = forwardRef<Mesh, PlayerProps>(({ position, color }, ref) => (
  <mesh ref={ref} position={position}>
    <boxGeometry args={[0.5, 0.5, 0.5]} />
    <meshStandardMaterial color={color} />
  </mesh>
));

export default Player;
