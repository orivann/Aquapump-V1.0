import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Head from "expo-router/head";
import Navigation from "@/components/Navigation";

function RootLayoutNav() {
  return (
    <>
      {Platform.OS === 'web' && (
        <Head>
          <title>AquaPump - Smart Water Pumps by AquaTech Group</title>
          <meta name="description" content="Industry-leading smart water pumps from AquaTech Group. 20+ years of excellence in Ramla, Israel. Advanced IoT technology, real-time monitoring, and energy-efficient solutions." />
          <meta name="keywords" content="water pumps, smart pumps, IoT pumps, AquaTech, Ramla Israel, industrial pumps, energy efficient pumps, commercial water pumps, residential pumps" />
          <meta name="author" content="AquaTech Group" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <meta name="theme-color" content="#0EA5E9" />
          <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1" />
          
          <meta property="og:type" content="website" />
          <meta property="og:title" content="AquaPump - Smart Water Pumps by AquaTech Group" />
          <meta property="og:description" content="Industry-leading smart water pumps from AquaTech Group. 20+ years of excellence in Ramla, Israel. Advanced IoT technology, real-time monitoring, and energy-efficient solutions." />
          <meta property="og:site_name" content="AquaPump" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:url" content="https://aquapump.com" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="AquaPump - Smart Water Pumps by AquaTech Group" />
          <meta name="twitter:description" content="Industry-leading smart water pumps from AquaTech Group. 20+ years of excellence in Ramla, Israel." />

          <link rel="canonical" href="https://aquapump.com" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "AquaTech Group",
              "url": "https://aquapump.com",
              "logo": "https://aquapump.com/logo.png",
              "description": "Industry-leading smart water pumps manufacturer with 20+ years of excellence",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Ramla",
                "addressCountry": "IL"
              },
              "sameAs": [
                "https://www.linkedin.com/company/aquatech-group",
                "https://twitter.com/aquatechgroup"
              ]
            })}
          </script>
        </Head>
      )}
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="pumps" options={{ headerShown: false, title: 'Our Pumps' }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <Navigation />
    </>
  );
}

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
      },
    },
  }));
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        if (Platform.OS !== 'web') {
          await SplashScreen.preventAutoHideAsync();
        }
      } catch (e) {
        console.warn('[RootLayout] Splash screen error:', e);
      } finally {
        setIsReady(true);
        if (Platform.OS !== 'web') {
          await SplashScreen.hideAsync();
        }
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return null;
  }

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