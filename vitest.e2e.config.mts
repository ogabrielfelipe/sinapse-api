import { defineConfig, mergeConfig } from 'vitest/config'
import vitestConfig from './vitest.config.mjs'

export default mergeConfig(
  vitestConfig,
  defineConfig({
    test: {
      include: ['**/*.e2e-{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      environmentMatchGlobs: [['src/**', 'prisma']],
      environment: 'prisma',
      environmentOptions: {
        adapter: 'psql',
        envFile: '.env.test',
        prismaEnvVarName: 'DATABASE_URL', // Optional
        transformMode: 'ssr', // Optional
      },
    },
  }),
)
