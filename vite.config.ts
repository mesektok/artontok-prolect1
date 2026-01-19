
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

export default defineConfig(({ mode }) => {
  // // Fix: Use path.resolve() to obtain the current working directory safely to avoid type errors on process.cwd()
  const env = loadEnv(mode, path.resolve(), '');
  
  // // Fix: Manually calculate __dirname for compatibility with ES modules environment
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  
  return {
    // base: './' 는 모든 자산을 상대 경로로 불러오게 하여 
    // 어떤 하위 디렉토리(GitHub 리포지토리명)에서도 검은 화면 없이 작동하게 합니다.
    base: './',
    
    plugins: [react()],
    
    define: {
      // 앱 내에서 process.env.API_KEY를 사용할 수 있도록 설정
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || ''),
    },
    
    resolve: {
      alias: {
        // @ 경로를 현재 루트로 매핑 (필요 시 사용)
        '@': path.resolve(__dirname, './'),
      },
    },
    
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // 빌드 시 깨끗한 결과물을 위해 소스맵 제외 (선택 사항)
      sourcemap: false,
    },
    
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
  };
});
