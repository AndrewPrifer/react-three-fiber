import Reconciler, { extend, prepare, applyProps, Root } from '@react-three/reconciler'

function createRenderer<TCanvas>() {
  const reconciler = Reconciler({})
  return { reconciler, applyProps }
}

export { prepare, createRenderer, extend }
export type { Root }
