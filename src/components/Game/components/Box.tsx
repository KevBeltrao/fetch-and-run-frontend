import { RigidBody } from '@react-three/rapier';
import { type FC } from 'react';

interface BoxProps {
  position: [number, number, number];
}

const Box: FC<BoxProps> = ({ position }) => (
  <group position={position}>
    <RigidBody name="ground" type="fixed" colliders="cuboid">
      <mesh position={[0, 0.2, 0]}>
        <boxGeometry args={[0.49, 0.1, 0.49]} />
        <meshBasicMaterial color="green" />
      </mesh>
    </RigidBody>

    <RigidBody type="fixed" colliders="cuboid">
      <mesh>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="purple" />
      </mesh>
    </RigidBody>
  </group>
);

export default Box;
