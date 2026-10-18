# 🏫 School Ecosystem App (React Native & Expo 58)

A comprehensive, production-ready Multi-Role Educational Management Platform built with React Native (Expo SDK 58), React 19, TypeScript, Reanimated 4, and Expo Router.

---

## 📱 App Highlights

- **4 Integrated Portals in One App**:
  - 👨‍👩‍👧 **Parent Portal**: Attendance analytics (94% presence gauge), daily timetable with real-time class status, leave application system, bus tracking, school fee payments, exam report cards, and notices.
  - 🎒 **Student Portal**: Daily class schedule, homework assignments with submission tracker, test scores, digital student ID card, and extracurricular activities.
  - 👩‍🏫 **Teacher Portal**: Instant class roll-call attendance, gradebook entries, timetable view, and broadcast announcements.
  - 🏛️ **School Admin Portal**: Institution-wide metrics, fee collection summaries, teacher performance, and announcement dispatch.
- **Flawless Edge-to-Edge Mobile UI**:
  - Dynamically calculates status bar height (`insets.top`) and gesture/navigation bar height (`insets.bottom`) using `react-native-safe-area-context`.
  - Zero collision with camera cutouts or Android hardware/software navigation keys.
- **Offline Standalone Native APK**:
  - Pre-bundled Hermes JS engine + offline assets.
  - Native C++ bindings for Reanimated 4, Gesture Handler, and Screens compiled with Android NDK 27.

---

## 📥 Direct APK Download & Installation

The compiled standalone release APK is located directly in this repository:

👉 **[Download APK: `release/School-App-v1.0.0.apk`](./release/School-App-v1.0.0.apk)** *(~34.5 MB)*

### How to Install on Android:
1. **Via Phone Browser**:
   - Download `School-App-v1.0.0.apk` directly onto your Android device.
   - Tap the downloaded file in your Notification Center or Downloads folder.
   - If prompted, allow *"Install unknown apps"* for your browser/file manager.
   - Tap **Install** and open the app.
2. **Via ADB (USB Debugging)**:
   ```bash
   adb install -r -d release/School-App-v1.0.0.apk
   adb shell am start -n com.anonymous.schoolapp/.MainActivity
   ```

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Expo SDK 58](https://expo.dev) + [React Native 0.88](https://reactnative.dev)
- **UI & Gestures**: `react-native-reanimated`, `react-native-gesture-handler`, `react-native-screens`, `react-native-safe-area-context`
- **Routing**: `expo-router` (File-based routing)
- **Icons & Styling**: `@expo/vector-icons` (Ionicons), custom design token system
- **State Management**: React Context (`AppContext`) with multi-role state simulation

---

## 🚀 Development & Building from Source

### Prerequisites
- Node.js 18+ & npm
- (Optional for native Android builds) Android SDK (API 35, Build-Tools 35.0.0, NDK 27.0.12077973)

### Installation
```bash
# Clone the repository
git clone https://github.com/MDAwaiz438/School-App.git
cd School-App

# Install dependencies
npm install
```

### Running Locally

#### 1. Interactive Development Mode (Web / Expo Go)
```bash
npx expo start
```
- Press `w` to open in browser.
- Press `a` to run on a connected Android phone or emulator.

#### 2. Building Standalone Android Release APK
```bash
cd android
./gradlew assembleRelease -PreactNativeArchitectures=arm64-v8a
```
The output APK will be generated at:
`android/app/build/outputs/apk/release/app-release.apk`

---

## 📄 License
MIT License. Built with ❤️ for educational excellence.
