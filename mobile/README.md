# 📱 Shesh Patar Gaan — Mobile Application

> *React Native & Expo Mobile Client for Shesh Patar Gaan (শেষ পাতার গান) featuring analog cassette deck UI, YouTube audio streaming, and live listener presence.*

---

## 📖 Overview

The mobile application brings the complete Bengali nostalgia cassette deck experience to Android and iOS mobile devices. Built with **React Native** and **Expo SDK 54**, it features:

- 📼 **Walkman-Inspired Mobile UI**: Retro cassette player deck with animated rotating reels, bias markings, and physical deck sounds.
- 🎧 **YouTube Playback Integration**: Background audio streaming powered by `react-native-youtube-iframe`.
- 🗂️ **Archive & Memory Navigation**: Bottom tab navigation between Cassette Deck, Music Archives, and Diary Memory Wall.
- 📻 **Realtime Database Presence Sync**: Real-time connection to Firebase Realtime Database reporting active listener presence and fetching live station statistics.

---

## 📥 Android APK Download & Installation

A standalone Android APK build is available via Expo EAS:

- 📥 **[Download Android APK (Direct Link)](https://expo.dev/artifacts/eas/Kgbpvbwu0_Gc_zqiCzJXU0JKZLASLP1iUXmLK8W1DHo.apk)**
- 📲 **[Open EAS Build Page](https://expo.dev/accounts/armaan_11/projects/shesh-patar-gaan-mobile/builds/375460c9-6dfa-4c87-a0e8-f70d13e08c0e)**

### How to Install on Android

1. Open the [EAS Build Page](https://expo.dev/accounts/armaan_11/projects/shesh-patar-gaan-mobile/builds/375460c9-6dfa-4c87-a0e8-f70d13e08c0e) on your Android device or scan the QR code.
2. Download the `.apk` file.
3. Allow installation from unknown sources in Android settings if prompted.
4. Tap **Install** to launch the mobile app.

---

## 🛠️ Environment Variables Setup

The mobile application connects to the same Firebase Realtime Database used by the web version. Environment variables are loaded using Expo's `EXPO_PUBLIC_` prefix.

1. Create a local `.env` file inside the `mobile/` folder:
   ```bash
   cp .env.example .env
   ```

2. Fill in your Firebase configuration variables in `mobile/.env`:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   EXPO_PUBLIC_FIREBASE_DATABASE_URL=https://your_database_url.firebaseio.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

> ⚠️ **Note**: `mobile/.env` is ignored by git (`.gitignore`). Do NOT commit real secret values to GitHub.

---

## 🚀 Local Development Commands

To run the mobile app locally:

```bash
# 1. Change directory to mobile
cd mobile

# 2. Install dependencies
npm install

# 3. Start Expo local development server
npx expo start
```

### Additional Commands

- **Android Emulator**: `npx expo start --android`
- **Web Preview**: `npx expo start --web`
- **TypeScript Verification**: `npm run lint` (`tsc --noEmit`)

---

## 🔴 Firebase Integration

The mobile Firebase service (`mobile/src/services/mobileFirebasePresence.ts`) automatically:

1. Connects to Firebase Realtime Database at startup.
2. Reports active presence to `/presence/mobile_listener_<id>`.
3. Cleans up presence on disconnect (`onDisconnect().remove()`).
4. Reads daily listener stats and peak listener records from `/stats/${YYYY-MM-DD}`.

---

## 🏗️ EAS Build Configuration

The mobile app is configured for Android APK builds using EAS Build (`eas.json`):

```json
{
  "cli": {
    "version": ">= 15.0.0"
  },
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### Triggering an EAS Build

To create a new APK build on EAS Cloud:

```bash
# Push environment variables to EAS preview environment (if modified)
npx eas-cli secret:create --scope project --env-file .env

# Run Android preview build
npx eas-cli build --platform android --profile preview
```

---

## 📋 Release Summary

- **Account**: `armaan_11`
- **Project**: `shesh-patar-gaan-mobile`
- **Build ID**: `375460c9-6dfa-4c87-a0e8-f70d13e08c0e`
- **Package Name**: `com.sheshpatargaan.app`
