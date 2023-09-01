import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const Porsche = () => {
  const porsche = useGLTF("./porsche/scene.gltf");

  return (
    <primitive
      object={porsche.scene}
      scale={3.5}
      position-y={0}
      rotation-y={0}
    />
  );
};

const PorscheCanvas = () => {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 6]}
      gl={{ preserveDrawingBuffer: true }}
      camera={{
        fov: 60,
        near: 0.1,
        far: 300,
        position: [0, 10, 0], // Position the camera above the scene
        rotation: [-Math.PI / 2, 0, 0], // Rotate the camera to look down
      }}
    >
      {/* Ambient Light */}
      <ambientLight intensity={0.5} color="#ffffff" />

      {/* Directional Light */}
      <directionalLight position={[10, 10, 5]} intensity={5.5} castShadow />

      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          autoRotate
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Porsche />

        <Preload all />
      </Suspense>
    </Canvas>
  );
};

export default PorscheCanvas;
