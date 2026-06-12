import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(async ({ mode }) => {
  const plugins = [react()];

  // ✅ Dynamically import lovable-tagger only in development to avoid ESM require issues
  if (mode === 'development') {
    const { componentTagger } = await import('lovable-tagger');
    plugins.push(componentTagger());
  }

  return {
    plugins,
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        // Simplify custom paths
        '@': path.resolve(__dirname, './src'),

        // ✅ Keep package version aliases
        'vaul@1.1.2': 'vaul',
        'sonner@2.0.3': 'sonner',
        'recharts@2.15.2': 'recharts',
        'react-resizable-panels@2.1.7': 'react-resizable-panels',
        'react-hook-form@7.55.0': 'react-hook-form',
        'react-day-picker@8.10.1': 'react-day-picker',
        'next-themes@0.4.6': 'next-themes',
        'lucide-react@0.487.0': 'lucide-react',
        'input-otp@1.4.2': 'input-otp',
        'embla-carousel-react@8.6.0': 'embla-carousel-react',
        'cmdk@1.1.1': 'cmdk',
        'class-variance-authority@0.7.1': 'class-variance-authority',
        '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',

        // ✅ Figma image asset aliases
        'figma:asset/fc9e0fb363ea50f06254f1ce635653bee6dab4c1.png': path.resolve(__dirname, './src/assets/fc9e0fb363ea50f06254f1ce635653bee6dab4c1.png'),
        'figma:asset/f7cc924189778152b702dd16d8167c831b79b64c.png': path.resolve(__dirname, './src/assets/f7cc924189778152b702dd16d8167c831b79b64c.png'),
        'figma:asset/f6cad553f57d1dc208b2c4d61a95cfc7a46ccbf8.png': path.resolve(__dirname, './src/assets/f6cad553f57d1dc208b2c4d61a95cfc7a46ccbf8.png'),
        'figma:asset/f5575d8f5c5073585466226b821f83044ac2feb2.png': path.resolve(__dirname, './src/assets/f5575d8f5c5073585466226b821f83044ac2feb2.png'),
        'figma:asset/e5c0b02830cff12b38961d729bb34cb8e1126e2c.png': path.resolve(__dirname, './src/assets/e5c0b02830cff12b38961d729bb34cb8e1126e2c.png'),
        'figma:asset/e49d9dee72723fd8bdbe1c51ea7be3d43cf4de7b.png': path.resolve(__dirname, './src/assets/e49d9dee72723fd8bdbe1c51ea7be3d43cf4de7b.png'),
        'figma:asset/ddfacdaa0a5604851834c98b66dd054d207ec8c8.png': path.resolve(__dirname, './src/assets/ddfacdaa0a5604851834c98b66dd054d207ec8c8.png'),
        'figma:asset/db58ea0127e8ad2399d9f28222f6bcb0446ce891.png': path.resolve(__dirname, './src/assets/db58ea0127e8ad2399d9f28222f6bcb0446ce891.png'),
        'figma:asset/bdf772703c1f65dd08f34d61f636b0dbe220681b.png': path.resolve(__dirname, './src/assets/bdf772703c1f65dd08f34d61f636b0dbe220681b.png'),
        'figma:asset/b2ea6722d0036ab90e69d8abcda355acfd3c0cbb.png': path.resolve(__dirname, './src/assets/b2ea6722d0036ab90e69d8abcda355acfd3c0cbb.png'),
        'figma:asset/ad763c2921c25a0c844c255968e7b2a8dcf029cb.png': path.resolve(__dirname, './src/assets/ad763c2921c25a0c844c255968e7b2a8dcf029cb.png'),
        'figma:asset/a3d71be07a9d660969dffea5a85717267457b3bc.png': path.resolve(__dirname, './src/assets/a3d71be07a9d660969dffea5a85717267457b3bc.png'),
        'figma:asset/9d273dee56dc1d6219bbf3763012eb437be7be7b.png': path.resolve(__dirname, './src/assets/9d273dee56dc1d6219bbf3763012eb437be7be7b.png'),
        'figma:asset/9558e0c846f30c8aa5939cc9c165ba28bc0f9e1e.png': path.resolve(__dirname, './src/assets/9558e0c846f30c8aa5939cc9c165ba28bc0f9e1e.png'),
        'figma:asset/850551b45815c75661657b884ccce2af4ad5f0bc.png': path.resolve(__dirname, './src/assets/850551b45815c75661657b884ccce2af4ad5f0bc.png'),
        'figma:asset/832ad4487a2fdcd5f09322ba53b74b5656a09bd8.png': path.resolve(__dirname, './src/assets/832ad4487a2fdcd5f09322ba53b74b5656a09bd8.png'),
        'figma:asset/66c38fe3b7f639c209b1c5089f8aef58d3fdfdf4.png': path.resolve(__dirname, './src/assets/66c38fe3b7f639c209b1c5089f8aef58d3fdfdf4.png'),
        'figma:asset/6057c26e372856f887d94475b36ae88c3aa7ed84.png': path.resolve(__dirname, './src/assets/6057c26e372856f887d94475b36ae88c3aa7ed84.png'),
        'figma:asset/5bd91f872e7c1f8cc8a9b57a10c2e5503ecca26c.png': path.resolve(__dirname, './src/assets/5bd91f872e7c1f8cc8a9b57a10c2e5503ecca26c.png'),
        'figma:asset/5a8c2dd706b9ab9206444d9bab55c1dce0e00b2a.png': path.resolve(__dirname, './src/assets/5a8c2dd706b9ab9206444d9bab55c1dce0e00b2a.png'),
        'figma:asset/56eec9f31f5047398a011db41854b5a8c8a20924.png': path.resolve(__dirname, './src/assets/56eec9f31f5047398a011db41854b5a8c8a20924.png'),
        'figma:asset/44c0fe7f60207bc68596839df3eba740a215d24a.png': path.resolve(__dirname, './src/assets/44c0fe7f60207bc68596839df3eba740a215d24a.png'),
        'figma:asset/409ed5f751806f8023bc3b462845618f2dce0566.png': path.resolve(__dirname, './src/assets/409ed5f751806f8023bc3b462845618f2dce0566.png'),
        'figma:asset/3f11ce12997d9c6313379b839bd614ec3b6475b6.png': path.resolve(__dirname, './src/assets/3f11ce12997d9c6313379b839bd614ec3b6475b6.png'),
        'figma:asset/3c0fefa1a462fc424307776078ef40e23596d3fa.png': path.resolve(__dirname, './src/assets/3c0fefa1a462fc424307776078ef40e23596d3fa.png'),
        'figma:asset/2b9d147cd4bc2e8066aa4be3962f3b56cbeaa1cf.png': path.resolve(__dirname, './src/assets/2b9d147cd4bc2e8066aa4be3962f3b56cbeaa1cf.png'),
        'figma:asset/2235823097710444c6aa28fa04e48c2a27202094.png': path.resolve(__dirname, './src/assets/2235823097710444c6aa28fa04e48c2a27202094.png'),
        'figma:asset/19f75d718df8ede7167628d5393f1d27667f8713.png': path.resolve(__dirname, './src/assets/19f75d718df8ede7167628d5393f1d27667f8713.png'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            mediapipe: ['@mediapipe/tasks-vision'],
          },
        },
      },
    },
    server: {
      host: '::',
      port: 8080,
      open: true,
    },
    preview: {
      port: 8080,
      host: true,
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL || 'https://aeynylzqkojwakxgwuzn.supabase.co'),
      'import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY': JSON.stringify(process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFleW55bHpxa29qd2FreGd3dXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MzY1NzAsImV4cCI6MjA3ODAxMjU3MH0.v8iUGEDfWXOTXVMr-BaA9qu2gxDFuCU4KPDQXCzH2J8'),
    },
    optimizeDeps: {
      exclude: ['@mediapipe/tasks-vision'],
    },
  };
});
