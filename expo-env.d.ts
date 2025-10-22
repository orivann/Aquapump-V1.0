// expo-env.d.ts
/// <reference types="expo/types" />
/// <reference types="expo-router/types" />

declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_URL?: string;
    EXPO_PUBLIC_ENV?: string;
    [key: string]: string | undefined;
  }
}

