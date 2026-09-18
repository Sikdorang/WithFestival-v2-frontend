import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: [
    '**/__tests__/**/*.(unit|integration).test.[jt]s?(x)',
    '**/*.(unit|integration).test.[jt]s?(x)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.svg\\?react$': '<rootDir>/src/shared/lib/testing/svgMock.tsx',
    '\\.(svg|png|jpg|jpeg|gif|webp)$':
      '<rootDir>/src/shared/lib/testing/fileMock.ts',
  },
  setupFiles: ['<rootDir>/src/shared/lib/testing/jest.env.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/shared/lib/testing/setupTests.ts'],
  transform: {
    '^.+\\.(t|j)sx?$': [
      '@swc/jest',
      {
        jsc: {
          target: 'es2022',
          parser: {
            syntax: 'typescript',
            tsx: true,
            dynamicImport: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
            hidden: {
              jest: true,
            },
          },
        },
        module: {
          type: 'commonjs',
        },
      },
    ],
  },
  transformIgnorePatterns: ['/node_modules/(?!(axios|uuid)/)'],
  clearMocks: true,
  restoreMocks: true,
  collectCoverageFrom: [
    // FSD layers
    'src/shared/**/*.{ts,tsx}',
    'src/entities/**/*.{ts,tsx}',
    'src/features/**/*.{ts,tsx}',
    // Legacy modules covered by FSD public APIs (behavior unchanged)
    'src/stores/**/*.{ts,tsx}',
    'src/apis/**/*.{ts,tsx}',
    'src/hooks/useLogin.ts',
    'src/hooks/useOrder.ts',
    'src/hooks/useWaiting.ts',
    'src/utils/**/*.{ts,tsx}',
    'src/routes/authLoader.tsx',
    'src/components/common/exceptions/ProtectedRoute.tsx',
    'src/components/common/inputs/QuantityController.tsx',
    'src/constants/routes.ts',
    'src/constants/storage.ts',
    'src/constants/message.ts',
    '!src/**/*.test.{ts,tsx}',
    '!src/**/index.ts',
    '!src/shared/lib/testing/**',
    '!src/apis/common/**',
    '!src/apis/coupon.ts',
    '!src/apis/dating.ts',
    '!src/apis/loveAlarm.ts',
    '!src/apis/message.ts',
    '!src/apis/mission.ts',
    '!src/apis/reservation.ts',
  ],
  coverageThreshold: {
    global: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
};

export default config;
