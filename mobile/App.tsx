import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MobileYouTubeProvider } from './src/context/MobileYouTubeContext';
import { MobileLiveListenerProvider } from './src/context/MobileLiveListenerContext';
import { HomeScreen } from './src/screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <MobileYouTubeProvider>
        <MobileLiveListenerProvider>
          <HomeScreen />
        </MobileLiveListenerProvider>
      </MobileYouTubeProvider>
    </SafeAreaProvider>
  );
}
