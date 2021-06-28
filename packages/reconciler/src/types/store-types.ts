import * as THREE from 'three'
import * as React from 'react'
import { DomEvent, EventManager, ThreeEvent } from './event-types'
import * as ReactThreeFiber from './three-types'
import { Instance, InstanceProps } from '..'
import { GetState, SetState } from 'zustand'

export interface Intersection extends THREE.Intersection {
  eventObject: THREE.Object3D
}

export type Subscription = {
  ref: React.MutableRefObject<RenderCallback>
  priority: number
}

export type Dpr = number | [min: number, max: number]
export type Size = { width: number; height: number }
export type Viewport = Size & {
  initialDpr: number
  dpr: number
  factor: number
  distance: number
  aspect: number
}

export type Camera = THREE.OrthographicCamera | THREE.PerspectiveCamera
export type Raycaster = THREE.Raycaster & {
  enabled: boolean
  filter?: FilterFunction
  computeOffsets?: ComputeOffsetsFunction
}

export type RenderCallback = (state: RootState, delta: number) => void

export type Performance = {
  current: number
  min: number
  max: number
  debounce: number
  regress: () => void
}

export type InternalState = {
  active: boolean
  priority: number
  frames: number
  lastProps: StoreProps

  interaction: THREE.Object3D[]
  hovered: Map<string, DomEvent>
  subscribers: Subscription[]
  capturedMap: Map<number, Map<THREE.Object3D, Intersection>>
  initialClick: [x: number, y: number]
  initialHits: THREE.Object3D[]

  subscribe: (callback: React.MutableRefObject<RenderCallback>, priority?: number) => () => void
}

export type RootState = {
  gl: THREE.WebGLRenderer
  scene: THREE.Scene
  camera: Camera
  raycaster: Raycaster
  mouse: THREE.Vector2
  clock: THREE.Clock

  vr: boolean
  linear: boolean
  flat: boolean
  frameloop: 'always' | 'demand' | 'never'
  performance: Performance

  size: Size
  viewport: Viewport & {
    getCurrentViewport: (camera?: Camera, target?: THREE.Vector3, size?: Size) => Omit<Viewport, 'dpr' | 'initialDpr'>
  }

  set: SetState<RootState>
  get: GetState<RootState>
  invalidate: () => void
  advance: (timestamp: number, runGlobalEffects?: boolean) => void
  setSize: (width: number, height: number) => void
  setDpr: (dpr: Dpr) => void
  onPointerMissed?: (event: ThreeEvent<PointerEvent>) => void

  events: EventManager<any>
  internal: InternalState
}

export type FilterFunction = (items: THREE.Intersection[], state: RootState) => THREE.Intersection[]
export type ComputeOffsetsFunction = (event: any, state: RootState) => { offsetX: number; offsetY: number }

export type StoreProps = {
  gl: THREE.WebGLRenderer
  size: Size
  vr?: boolean
  shadows?: boolean | Partial<THREE.WebGLShadowMap>
  linear?: boolean
  flat?: boolean
  orthographic?: boolean
  frameloop?: 'always' | 'demand' | 'never'
  performance?: Partial<Omit<Performance, 'regress'>>
  dpr?: Dpr
  clock?: THREE.Clock
  raycaster?: Partial<Raycaster>
  camera?:
    | Camera
    | Partial<
        ReactThreeFiber.Object3DNode<THREE.Camera, typeof THREE.Camera> &
          ReactThreeFiber.Object3DNode<THREE.PerspectiveCamera, typeof THREE.PerspectiveCamera> &
          ReactThreeFiber.Object3DNode<THREE.OrthographicCamera, typeof THREE.OrthographicCamera>
      >
  onPointerMissed?: (event: ThreeEvent<PointerEvent>) => void
}

export type ApplyProps = (
  instance: Instance,
  newProps: InstanceProps,
  oldProps?: InstanceProps,
  accumulative?: boolean,
) => void
