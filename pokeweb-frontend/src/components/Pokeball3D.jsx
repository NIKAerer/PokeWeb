import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, RectAreaLightHelper } from "@react-three/drei";
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib';
RectAreaLightUniformsLib.init();


function Pokeball() {
  const groupRef = useRef();

  useFrame((state, delta) => {
     if (groupRef.current) groupRef.current.rotation.z += delta * 0.08; 
  });

  return (
    <group ref={groupRef} rotation={[0, 0, 0]} scale={1.8}>
      
      {/* === Partie rouge === */}
      <mesh>
        <sphereGeometry args={[1, 256, 256, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#ff1c4d"
          roughness={0.65}
          metalness={0.2}
          clearcoat={1}
          clearcoatRoughness={0.1}
          sheen={0.2}
        />
      </mesh>

      {/* === Partie blanche === */}
      <mesh rotation={[Math.PI, 0, 0]}>
        <sphereGeometry args={[1, 256, 256, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.55}
          metalness={0.05}
          clearcoat={1}
          clearcoatRoughness={0.1}
          sheen={0.2}
        />
      </mesh>

      {/* Bande noire */}
      <mesh>
        <cylinderGeometry args={[1, 1, 0.1, 256]} />
        <meshPhysicalMaterial
          color="#000000"
          metalness={0.9}
          roughness={0.1}
          clearcoat={1}
        />
      </mesh>

      {/* Bouton central */}
      <mesh position={[0, 0, 1.01]}>
        <circleGeometry args={[0.18,256]} />
        <meshPhysicalMaterial
          color="#cccccc"
          emissive="#9a9a9a"
          emissiveIntensity={0.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          sheen={0.2}
        />
      </mesh>

      {/* Cercle noir fin au centre du bouton */}
      <mesh position={[0, 0, 1.015]}>
        <ringGeometry args={[0.1, 0.118, 256]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Bordure noire autour du bouton */}
      <mesh position={[0, 0, 1]}>
        <ringGeometry args={[0.1, 0.22, 256]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}

function Pokeball3D() {
  return (
    <div className="w-full h-[600px]">
      <Canvas
        camera={{ position: [0, 0, 3]}}
        dpr={[1, 2]}
        gl={{ antialias: true, toneMappingExposure: 1.2 }}
      >
      <ambientLight intensity={0.08} color="#ffffff" />

      <rectAreaLight
        position={[-3, 2, 5]}
        width={6}
        height={6}
        intensity={0.18}
        color="#fff"
      />
      

      <Pokeball />

      {/* Halo énergétique */}
      <mesh>
        <sphereGeometry args={[1.3, 64, 64]} />
        <meshBasicMaterial color="#ff1c4d" transparent opacity={0.1} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.6, 64, 64]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.05} />
      </mesh>

      <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
}


export default Pokeball3D;