# CHANGE360 — Complete Native Android Application

**Tagline:** Learn. Act. Track. Inspire.  
**Platform:** Native Android (Kotlin + Jetpack Compose + Material 3)  
**Package:** `com.change360.app`

---

## 📱 Project Overview

CHANGE360 is a full-featured, native Android social awareness and positive-action platform. It turns awareness into meaningful daily action across 20 distinct social causes:

1. Environment and sustainability
2. Waste management and recycling
3. Climate awareness and conservation
4. Education and literacy
5. Equality and inclusion
6. Digital literacy and online safety
7. Cyberbullying awareness
8. Road safety
9. Community service and volunteering
10. Physical health and healthy habits
11. Mental well-being and stress management
12. Women's safety and health
13. Child safety and protection
14. Civic responsibility
15. Animal welfare
16. Disaster preparedness
17. Responsible technology use
18. Public health awareness
19. Financial awareness and responsible consumption
20. School and community improvement

---

## 🏗️ Architecture & Technology Stack

- **Language:** Kotlin 2.0+
- **UI Toolkit:** Jetpack Compose with Material 3 Design
- **Architecture:** MVVM (Model-View-ViewModel) with Unidirectional Data Flow (UDF)
- **Database:** Room Persistence Library with TypeConverters and Flow streams
- **Asynchronous Execution:** Kotlin Coroutines & StateFlow
- **Navigation:** Navigation Compose (`NavHost`, `rememberNavController`)
- **Image Generation:** Native Android `Canvas` & `Bitmap` renderer with `MediaStore` saving and `Intent.ACTION_SEND` sharing
- **Preferences:** DataStore / SharedPreferences
- **AI Integration:** Secure Gemini 3.8 Flash backend proxy architecture with built-in intelligent local demonstration fallback engine.

---

## 🚀 How to Open in Android Studio

1. **Prerequisites:**
   - Android Studio Koala Feature Drop (2024.1.2) or Ladybug (2024.2.1+)
   - JDK 17 or JDK 21 (bundled with modern Android Studio)
   - Android SDK 35 (Android 15) installed via SDK Manager

2. **Open the Project:**
   - Launch Android Studio.
   - Click **File > Open...**
   - Navigate to this directory and select the `android` folder (containing `settings.gradle.kts` and `app`).
   - Android Studio will automatically sync the Gradle build files using the Gradle Version Catalog (`libs.versions.toml`).

3. **Running on an Emulator or Physical Phone:**
   - To run on an emulator: Open **Tools > Device Manager**, create a virtual device (e.g. Pixel 8 with API 34 or 35), and click **Run 'app'** (`Shift + F10`).
   - To run on a physical phone: Enable **Developer Options** and **USB Debugging** on your Android phone, connect it via USB or Wi-Fi pairing, select your device from the target selector, and click **Run**.

---

## 📦 Building an Installable APK

To generate a debug APK directly from your terminal:
```bash
./gradlew assembleDebug
```
The installable APK will be generated at:
`app/build/outputs/apk/debug/app-debug.apk`

To generate a signed Release APK:
```bash
./gradlew assembleRelease
```
The APK will be generated at:
`app/build/outputs/apk/release/app-release.apk`

---

## 🚀 Building an Android App Bundle (AAB) for Google Play

Google Play requires the Android App Bundle format (`.aab`):
```bash
./gradlew bundleRelease
```
The generated App Bundle will be located at:
`app/build/outputs/bundle/release/app-release.aab`

Upload this file to your **Google Play Console** under **Internal Testing**, **Closed Testing**, or **Production**.

---

## 🛡️ Proof of Impact Framework

CHANGE360 enforces strict transparency:
1. **Learning Completed:** Educational module and quiz completion.
2. **Self-Reported Action:** Honest user-reported habit (clearly marked as self-reported).
3. **Verified Activity:** Validated by an institutional supervisor, teacher, or timestamp.
4. **Measured Outcome:** Tangible, quantifiable community impact.

No statistics or impact claims are fabricated.
