import * as THREE from 'three'
import React, { useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { reconciler, diagramRoot } from '../diagram'

const mesh = new THREE.Mesh(new THREE.BoxGeometry(), new THREE.MeshBasicMaterial({ color: 'red' }))
const group = new THREE.Group()
group.add(mesh)

function Box(props: any) {
  const ref = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  useFrame((state) => {
    ref.current.position.y = Math.sin(state.clock.elapsedTime) / 3
  })
  return (
    <mesh
      ref={ref}
      onPointerOver={(e) => setHovered(true)}
      onPointerOut={(e) => setHovered(false)}
      onClick={() => setClicked(!clicked)}
      scale={clicked ? [1.5, 1.5, 1.5] : [1, 1, 1]}
      {...props}>
      <boxBufferGeometry />
      <meshBasicMaterial color={hovered ? 'hotpink' : 'aquamarine'} />
    </mesh>
  )
}

function Box2(props: any) {
  return <primitive object={group} {...props} onClick={() => console.log('hi')} />
}

export default function App() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    ref.current!.append(diagramRoot)
  }, [])

  return (
    <>
      <div
        ref={ref}
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 10,
        }}
      />
      <Canvas reconciler={reconciler}>
        <group>
          <Box position={[-0.5, 0, 0]} />
        </group>
        <Box2 position={[0.5, 0, 0]} />
      </Canvas>
    </>
  )
}
