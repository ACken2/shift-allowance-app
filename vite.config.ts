import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			containers: fileURLToPath(new URL('./src/containers', import.meta.url)),
			components: fileURLToPath(new URL('./src/components', import.meta.url)),
		},
	},
	build: {
		outDir: 'dist',
	},
	test: {
		environment: 'jsdom',
		globals: true,
		setupFiles: './src/setupTests.ts',
		pool: 'threads',
		fileParallelism: false,
	},
});
