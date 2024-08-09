import {
  forwardRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from 'react';

interface PlayerProps {
  position: [number, number, number];
  color: string;
}

const Player: ForwardRefExoticComponent<PlayerProps & RefAttributes<unknown>> =
  forwardRef(({ position, color }, ref) => (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  ));

export default Player;
