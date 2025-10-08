import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Head from "expo-router/head";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  return (
    <>
      {Platform.OS === 'web' && (
        <Head>
          <title>AquaPump - Smart Water Pumps by AquaTech Group</title>
          <meta name="description" content="Industry-leading smart water pumps from AquaTech Group. 20+ years of excellence in Ramla, Israel. Advanced IoT technology, real-time monitoring, and energy-efficient solutions." />
          <meta name="keywords" content="water pumps, smart pumps, IoT pumps, AquaTech, Ramla Israel, industrial pumps, energy efficient pumps" />
          <meta name="author" content="AquaTech Group" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <meta name="theme-color" content="#19C3E6" />
          
          <meta property="og:type" content="website" />
          <meta property="og:title" content="AquaPump - Smart Water Pumps by AquaTech Group" />
          <meta property="og:description" content="Industry-leading smart water pumps from AquaTech Group. 20+ years of excellence in Ramla, Israel. Advanced IoT technology, real-time monitoring, and energy-efficient solutions." />
          <meta property="og:site_name" content="AquaPump" />
          <meta property="og:locale" content="en_US" />
          
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="AquaPump - Smart Water Pumps by AquaTech Group" />
          <meta name="twitter:description" content="Industry-leading smart water pumps from AquaTech Group. 20+ years of excellence in Ramla, Israel." />
          
          <link rel="canonical" href="https://aquapump.com" />
        </Head>
      )}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="pumps" options={{ headerShown: true, title: 'Our Pumps' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <ThemeProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <RootLayoutNav />
          </GestureHandlerRootView>
        </ThemeProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}