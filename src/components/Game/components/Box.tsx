import { RigidBody } from '@react-three/rapier';
import { type FC } from 'react';

interface BoxProps {
  position: [number, number, number];
  args: [number, number, number];
}

const Box: FC<BoxProps> = ({ position, args }) => {
  const groundSize = [args[1] - 0.01, 0.01, args[2] - 0.01] as [
    number,
    number,
    number,
  ];

  const groundPosition = [0, 0.01 + args[2] / 2, 0] as [number, number, number];

  return (
    <group position={position}>
      <RigidBody name="ground" type="fixed" colliders="cuboid">
        <mesh position={groundPosition}>
          <boxGeometry args={groundSize} />
          <meshBasicMaterial color="green" />
        </mesh>
      </RigidBody>

      <RigidBody type="fixed" colliders="cuboid">
        <mesh>
          <boxGeometry args={args} />
          <meshBasicMaterial color="purple" />
        </mesh>
      </RigidBody>
    </group>
  );
};

export default Box;
