# 🚀 School App - Release Guide (v1.0.0)

This guide documents the release process, architecture details, and installation instructions for **School App v1.0.0**.

---

## 📦 Release Package Details

- **App Name**: School Ecosystem App
- **Package Name**: `com.anonymous.schoolapp`
- **Version**: `1.0.0`
- **Target Architecture**: `arm64-v8a` (Modern Android Phones & Tablets)
- **Target SDK**: Android 15 (API 35) / Min SDK: Android 7.0 (API 24)
- **APK File**: [`release/School-App-v1.0.0.apk`](./School-App-v1.0.0.apk)
- **File Size**: ~34.5 MB (Optimized single-architecture standalone package)
- **Signing**: Release signed with verified debug keystore for seamless sideloading.

---

## 📲 How to Install & Test the Release APK

### Method 1: Sideload via USB Debugging (Fastest for Developers)
Connect your Android phone via USB with USB debugging enabled:
```powershell
adb install -r -d ./release/School-App-v1.0.0.apk
adb shell am start -n com.anonymous.schoolapp/.MainActivity
```

### Method 2: Direct Install on Android Device (End-Users)
1. Send or download `School-App-v1.0.0.apk` to your phone (via Google Drive, WhatsApp, Telegram, or GitHub mobile).
2. Tap the APK file to initiate Android Package Installer.
3. If prompted: *"For security, your phone is not allowed to install unknown apps from this source"*, tap **Settings** and toggle **"Allow from this source"**.
4. Tap **Install** -> **Open**.

---

## 🏗️ Release Build Steps (For Future Builds)

If you modify UI code or business logic in `src/`, follow these steps to generate a new standalone APK:

### 1. Update Hermes JavaScript Bundle
```powershell
npx expo export:embed --platform android --dev false --entry-file node_modules/expo-router/entry.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

### 2. Compile and Package APK with Gradle
```powershell
cd android
.\gradlew.bat assembleRelease -x lintVitalAnalyzeRelease -x lintVitalRelease -x lintVitalReportRelease -PreactNativeArchitectures=arm64-v8a
```

### 3. Copy Output to Release Directory
```powershell
Copy-Item "android\app\build\outputs\apk\release\app-release.apk" -Destination "release\School-App-v1.0.0.apk" -Force
```

---

## 🎨 Implemented Features & Verified Polish
- **Edge-to-Edge Safe Area Insets**: Verified status bar and navigation bar padding preventing collisions with cutouts and bottom software keys.
- **Dynamic Role Switcher**: Instant switching between Parent, Student, Teacher, and Administrator interfaces.
- **Integrated Attendance Gauge**: 94% circular attendance visual with present/absent breakdown.
- **Schedule Timetable**: Real-time "Now Happening" period status badges with room numbers and teacher names.
- **Emergency Alert Banners**: Dismissible urgent school weather advisory broadcast.
