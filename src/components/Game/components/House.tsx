import { RigidBody } from '@react-three/rapier';
import { type FC } from 'react';

interface HouseProps {
  position: [number, number, number];
  handleFinishMap: () => void;
}

const House: FC<HouseProps> = ({ position, handleFinishMap }) => {
  return (
    <RigidBody type="fixed" sensor onIntersectionEnter={handleFinishMap}>
      <mesh position={position}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshBasicMaterial color="black" />
      </mesh>
    </RigidBody>
  );
};

export default House;
