import { defineConfig } from 'vite'
import { resolve } from 'path'
import react from '@vitejs/plugin-react-swc'
export default defineConfig({
  assetsInclude: ['src/assets/**'],
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
      '@constants': resolve(__dirname, 'src/constants'),
      '@containers': resolve(__dirname, 'src/containers'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@modals': resolve(__dirname, 'src/modals'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@selectors': resolve(__dirname, 'src/selectors'),
      '@store': resolve(__dirname, 'src/store'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@types': resolve(__dirname, 'src/types'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@validators': resolve(__dirname, 'src/validators'),
    }
  },
  plugins: [react()],
})
