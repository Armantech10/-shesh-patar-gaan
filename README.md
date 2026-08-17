# 🎵 শেষ পাতার গান — Shesh Patar Gaan

> *A digital Bengali nostalgia archive built around forgotten songs, cassette culture, Kolkata memories, and late-night listening.*

---

## 🌐 Live Website

- **Live Website**: [https://shesh-patar-gaan.vercel.app/](https://shesh-patar-gaan.vercel.app/)

---

## 📱 Android APK

### Latest Release

**Shesh Patar Gaan — Android APK**

[Download Latest Android APK](https://expo.dev/artifacts/eas/LyekE8NLy-aOn9_n3yHpkaxHBNPe1TFbn8SXbDt_sLE.apk)

**Build ID:** 16e17e43-42cc-42a0-9464-b98d00efe55c

[View EAS Build](https://expo.dev/accounts/armaan_11/projects/shesh-patar-gaan-mobile/builds/16e17e43-42cc-42a0-9464-b98d00efe55c)

> **Note**: The EAS installation page can be opened directly on Android mobile devices to download and install the app. Alternatively, scan the QR code on the EAS build page using your Android phone's camera.

---

## 🐙 GitHub Repository

- **GitHub Repository**: [https://github.com/Armantech10/-shesh-patar-gaan.git](https://github.com/Armantech10/-shesh-patar-gaan.git)

---

## ✨ Features

- 🎼 **Curated Bengali Music Archives**: Five distinct atmosphere categories (*বৃষ্টিভেজা দুপুর*, *ওয়াকম্যান ও ক্যাসেট*, *উত্তর কলকাতার আড্ডা*, *ডায়েরির শেষ পাতা*, *শেষ রাতের গান*).
- 📼 **Walkman-Style Cassette Player Deck**: Retro analog cassette deck featuring animated spools, cassette markings (`NORMAL BIAS`, `HIGH BIAS`), side labels (`SIDE A`/`SIDE B`), and synthesized physical button sounds.
- 🎧 **Hidden YouTube Audio Engine**: Background YouTube IFrame API integration for seamless music streaming and track controls.
- 🗂️ **Archive & Track Selection**: Dynamic atmosphere switching with interactive track drawer showing active song highlights.
- 🇧🇩 **Bengali-First Interface**: Authentic Bengali typography, poem quotes, memory scribbles, and cultural aesthetics.
- 📱 **Cross-Platform Mobile Application**: Native React Native / Expo app replicating the desktop cassette deck experience.
- 📻 **Firebase Realtime Database Listener Presence**: Real-time broadcast system tracking online listeners across web and mobile.
- 📊 **Active & Peak Listener Statistics**: Live counts for active concurrent listeners, daily peak listeners, total daily plays, and top tracks.
- 🤝 **Mobile & Web Integration**: Web and mobile clients report presence to the same unified Firebase Realtime Database instance.

---

## 📱 Mobile App Overview

The mobile application is built using **React Native** and **Expo SDK 54**, located in the `/mobile` subdirectory of this repository.

### Mobile Project Structure

- `mobile/App.tsx`: Main React Native entry point, font loader, and navigation setup.
- `mobile/src/components/WalkmanCassetteMobile.tsx`: Mobile-optimized vintage cassette deck interface.
- `mobile/src/context/MobileYouTubeContext.tsx`: Mobile YouTube playback engine state manager.
- `mobile/src/services/mobileFirebasePresence.ts`: Realtime Database presence service using `EXPO_PUBLIC_FIREBASE_*` variables.
- `mobile/src/navigation/BottomTabNavigator.tsx`: Bottom navigation between Cassette Deck, Archives, and Memory Wall screens.

### How to Run Mobile Locally

```bash
cd mobile
npm install
npx expo start
```

Use `npx expo start --android` to open in an Android emulator or scan the Expo QR code using Expo Go.

---

## 🤖 Android APK (EAS Build)

The standalone Android APK was generated using **Expo Application Services (EAS Build)** under the preview profile.

- **EAS Profile**: `preview`
- **Build Type**: `apk` (`android.buildType: "apk"` in `mobile/eas.json`)
- **Use Case**: Direct APK distribution for Android device installation and offline/unrestricted testing.

---

## 🔴 Firebase Realtime Database

Firebase Realtime Database powers the live presence and listener metrics across web and mobile clients.

### Purpose

1. **Active Listener Tracking**: Tracks active listening sessions across web and mobile platforms in real time.
2. **Peak Concurrent Listeners**: Dynamically updates and persists the daily peak concurrent listener count.
3. **Daily Play Statistics**: Increments daily play counts and track-specific statistics.

### Database Paths Used in Codebase

- `/presence/${sessionId}`: Active listener session objects containing timestamp, track ID, track title, and platform (`mobile` or `web`). Managed automatically with `onDisconnect().remove()`.
- `/stats/${YYYY-MM-DD}`: Daily aggregate statistics storing `peakConcurrent` and `totalPlays`.
- `/trackStats/${YYYY-MM-DD}/${cleanTrackId}`: Per-track daily play counts and titles.
- `/.info/connected`: Connection state listener node.

---

## 🔑 Environment Variables

To connect web and mobile apps to Firebase, configure environment variables in private `.env` files.

### Web Environment Variables (`.env`)

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_DATABASE_URL=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

### Mobile Environment Variables (`mobile/.env`)

```env
EXPO_PUBLIC_FIREBASE_API_KEY=
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=
EXPO_PUBLIC_FIREBASE_DATABASE_URL=
EXPO_PUBLIC_FIREBASE_PROJECT_ID=
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
EXPO_PUBLIC_FIREBASE_APP_ID=
```

> ⚠️ **Security Policy**:
> - Real environment credentials must **NEVER** be committed to GitHub repository.
> - `mobile/.env` and `.env` are strictly ignored by `.gitignore`.
> - EAS Build uses cloud environment variables configured securely in the EAS project dashboard/CLI.

---

## 🔒 Firebase Security

- Realtime Database security rules restrict read/write access to valid presence nodes (`/presence`, `/stats`, `/trackStats`).
- No Firebase service-account private keys or secret credentials are stored in the git repository.

---

## 📁 Repository Structure

```
shesh-patar-gaan/
├── docs/
│   └── RELEASE.md                     # Release notes & APK download documentation
├── mobile/
│   ├── assets/                        # App icons, splash screens, and images
│   ├── src/
│   │   ├── components/                # React Native UI components (WalkmanCassetteMobile, etc.)
│   │   ├── context/                   # YouTube playback & listener context providers
│   │   ├── data/                      # Archive definitions & songs
│   │   ├── navigation/                # Bottom tab & stack navigators
│   │   └── services/                  # Mobile Firebase presence integration
│   ├── .env.example                   # Mobile environment variables template
│   ├── .gitignore                     # Mobile-specific ignore rules (ignores .env)
│   ├── app.json                       # Expo project configuration
│   ├── eas.json                       # EAS Build profile configuration (preview -> apk)
│   └── package.json                   # Mobile dependencies & scripts
├── public/                            # Web static assets
├── src/
│   ├── components/                    # Web UI components (WalkmanCassette, GlassMusicPlayer, etc.)
│   ├── config/                        # Web Firebase configuration reader
│   ├── context/                       # Web music & presence contexts
│   ├── data/                          # Shared archive definitions
│   ├── services/                      # Web Firebase presence service
│   ├── utils/                         # Mechanical cassette click synthesizer
│   ├── App.tsx                        # Main web layout
│   └── index.css                      # Retro styling & Bengali font declarations
├── .env.example                       # Web environment variables template
├── .gitignore                         # Root gitignore rules
├── package.json                       # Web dependencies & scripts
├── README.md                          # Main project documentation
└── vite.config.ts                     # Vite web build configuration
```

---

## 💻 Local Development

### Running the Web Application

```bash
# Install root dependencies
npm install

# Start Vite web dev server
npm run dev
```

The web app will run locally at `http://localhost:3000/`.

### Running the Mobile Application

```bash
# Navigate to mobile app directory
cd mobile

# Install mobile dependencies
npm install

# Start Expo development server
npx expo start
```

---

## 🚀 Deployment Overview

- **Web Application**: Deployed on Vercel at [https://shesh-patar-gaan.vercel.app/](https://shesh-patar-gaan.vercel.app/)
- **Mobile Android App**: Built via Expo EAS Build (`preview` profile) as a standalone installable Android APK.
- **Backend & Database**: Firebase Realtime Database providing real-time presence sync across web and mobile clients.

---

## 📲 How to Install the APK on Android

1. Open the **[EAS Build Page](https://expo.dev/accounts/armaan_11/projects/shesh-patar-gaan-mobile/builds/16e17e43-42cc-42a0-9464-b98d00efe55c)** on your Android phone browser or scan the QR code.
2. Tap **Install** or tap the **[Direct APK Download Link](https://expo.dev/artifacts/eas/LyekE8NLy-aOn9_n3yHpkaxHBNPe1TFbn8SXbDt_sLE.apk)**.
3. Once downloaded, open the `.apk` file from your browser downloads or File Manager.
4. If Android asks for permission, enable **Allow installation from unknown sources** for your browser/file manager.
5. Tap **Install** and open **শেষ পাতার গান**!

---

## 📋 Release Information

| Item | Details |
| :--- | :--- |
| **Project Title** | শেষ পাতার গান — Shesh Patar Gaan |
| **Target Platform** | Android |
| **Build System** | Expo EAS Build (Preview APK Profile) |
| **Expo Account** | `armaan_11` |
| **EAS Project** | `shesh-patar-gaan-mobile` |
| **EAS Build ID** | `16e17e43-42cc-42a0-9464-b98d00efe55c` |

---

## 🔗 Quick Links

- 🐙 **GitHub Repository**: [https://github.com/Armantech10/-shesh-patar-gaan.git](https://github.com/Armantech10/-shesh-patar-gaan.git)
- 📲 **EAS Build Page**: [Open Build Page](https://expo.dev/accounts/armaan_11/projects/shesh-patar-gaan-mobile/builds/16e17e43-42cc-42a0-9464-b98d00efe55c)
- 📥 **Direct APK Download**: [Download Android APK](https://expo.dev/artifacts/eas/LyekE8NLy-aOn9_n3yHpkaxHBNPe1TFbn8SXbDt_sLE.apk)
- 🌐 **Live Website**: [https://shesh-patar-gaan.vercel.app/](https://shesh-patar-gaan.vercel.app/)
