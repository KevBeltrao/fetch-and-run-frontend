import { RigidBody } from '@react-three/rapier';
import type { FC } from 'react';

interface BoneProps {
  position: [number, number, number];
  grabbedBone: boolean;
  handleGrabBone: () => void;
}

const Bone: FC<BoneProps> = ({ position, grabbedBone, handleGrabBone }) => {
  return (
    <RigidBody type="fixed" sensor onIntersectionEnter={handleGrabBone}>
      <mesh position={position}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial
          color="yellow"
          transparent
          opacity={grabbedBone ? 0.5 : 1}
        />
      </mesh>
    </RigidBody>
  );
};

export default Bone;
