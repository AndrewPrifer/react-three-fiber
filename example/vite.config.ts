import path from 'path'
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'

export default defineConfig({
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
      '@react-three/fiber': path.resolve('../packages/fiber/src/index.tsx'),
      '@react-three/reconciler': path.resolve('../packages/reconciler/src/index.ts'),
    },
  },
  plugins: [reactRefresh()],
})
