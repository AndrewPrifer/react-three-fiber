// @ts-nocheck
import Reconciler from '@react-three/reconciler'
import { Object3D } from 'three'

// Familiar stuff from Paul's demo

function rNbr(number: number) {
  return parseFloat(number.toFixed(Math.round(2)))
}

function santitize(prop: any): any {
  switch (typeof prop) {
    case 'string':
      return `"${prop}"`
    case 'boolean':
      return prop
    case 'number':
      return rNbr(prop)
    case 'object': {
      if (Array.isArray(prop)) return JSON.stringify(prop.map(santitize))
      else return 'object'
    }
    default:
      return 'object'
  }
}

function stringifyProps(type: string, props: Record<string, any>) {
  const santized = Object.keys(props)
    .map((key) => `${key}={${santitize(props[key])}}`)
    .join(' ')
  return `<${type}${santized ? ' ' + santized : ''}>`
}

// Familiar stuff over
// You can find an example using this reconciler in the ClickAndHover demo, but you could add it to any one of them

/**
 * This will serve as the container for our dom mirror.
 */
export const diagramRoot = document.createElement('div')

/**
 * We map the threejs instances to dom instances.
 */
const map = new Map<Object3D, HTMLElement>()

/**
 * You construct the reconciler the same way you normally would, except you provide functions that map the default
 * host-config properties to your properties.
 *
 * Totally not sure if this is the most convenient way, we could pick any  of the myriad plugin/middleware patterns.
 */
export const reconciler = Reconciler({
  createInstance:
    (base) =>
    (type, { children, ...props }, ...rest) => {
      const instance = document.createElement('div')
      instance.textContent = stringifyProps(type, props)
      instance.style.marginLeft = '10px'

      const threeInstance = base(type, { children, ...props }, ...rest)

      map.set(threeInstance, instance)

      return threeInstance
    },
  appendInitialChild: (base) => (parentInstance, child) => {
    if (child) map.get(parentInstance).appendChild(map.get(child))
    return base(parentInstance, child)
  },
  appendChild: (base) => (parentInstance, child) => {
    if (child) map.get(parentInstance).appendChild(map.get(child))
    return base(parentInstance, child)
  },
  appendChildToContainer: (base) => (parentInstance, child) => {
    if (child) diagramRoot.appendChild(map.get(child))
    return base(parentInstance, child)
  },
  insertBefore: (base) => (parentInstance, child, beforeChild) => {
    if (child) map.get(parentInstance).insertBefore(map.get(child), map.get(beforeChild))
    return base(parentInstance, child, beforeChild)
  },
  removeChild: (base) => (parentInstance, child) => {
    if (child) map.get(parentInstance).removeChild(map.get(child))
    return base(parentInstance, child)
  },
  removeChildFromContainer: (base) => (parentInstance, child) => {
    if (child) map.get(parentInstance).removeChild(map.get(child))
    return base(parentInstance, child)
  },
  commitUpdate:
    (base) =>
    (instance, updatePayload, type, oldProps, { children, ...props }) => {
      if (map.get(instance)) {
        map.get(instance).childNodes[0].textContent = stringifyProps(type, props)
      }

      return base(instance, updatePayload, type, oldProps, { children, ...props })
    },
})

/**
 * Connect our reconciler to the devtools.
 */
reconciler.injectIntoDevTools({
  bundleType: process.env.NODE_ENV === 'production' ? 0 : 1,
  rendererPackageName: '@react-three/fiber -- with extended reconciler 😎',
  version: '17.0.2',
})
