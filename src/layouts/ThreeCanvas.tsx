import { Canvas } from '@react-three/fiber';
import type { FC, PropsWithChildren } from 'react';

const ThreeCanvas: FC<PropsWithChildren> = ({ children }) => {
  return <Canvas style={{ height: '100%', width: '100%' }}>{children}</Canvas>;
};

export default ThreeCanvas;
