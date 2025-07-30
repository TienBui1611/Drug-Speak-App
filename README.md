# 💊 Drug Speak

A comprehensive React Native educational application designed for learning pharmaceutical drug pronunciation. The app features interactive audio playback, pronunciation practice exercises, user authentication, and a comprehensive drug database with personalized learning progress tracking.

## ✨ Features

- 🎯 **Interactive Drug Learning**: Browse drugs by categories with detailed information
- 🔊 **Audio Pronunciation**: High-quality audio recordings from both male and female voices
- 📚 **Learning Modules**: Structured learning sessions with progress tracking
- 👥 **User Authentication**: Secure sign-in/sign-up functionality
- 📊 **Progress Tracking**: Monitor your learning journey and achievements
- 🏆 **Study Records**: Sync and track study sessions across devices
- 🌐 **Community Features**: Connect with other learners

## 🏗️ Project Structure

```
Drug-Speak-App/
├── 📱 App.js                    # Main application entry point
├── 📋 app.json                  # Expo/React Native configuration
├── 📦 package.json              # Dependencies and scripts
├── 🗂️ assets/                   # Static app assets (icons, splash)
└── 📁 src/
    ├── 🎵 assets/audio/         # Drug pronunciation audio files
    ├── 🧩 components/           # Reusable UI components
    │   └── PronunciationLabel.js
    ├── ⚙️ constants/            # App-wide constants
    ├── 💊 data/                 # Static data and drug information
    │   └── drugData.js
    ├── 🧭 navigation/           # Navigation configuration
    │   └── AppNavigator.js
    ├── 📱 screens/              # Application screens
    │   ├── auth/               # Authentication screens
    │   ├── drugs/              # Drug-related screens
    │   ├── learning/           # Learning module screens
    │   ├── CommunityScreen.js
    │   └── ProfileScreen.js
    ├── 🌐 services/            # API and external services
    │   └── api.js
    ├── 🗄️ store/               # Redux state management
    │   ├── authSlice.js
    │   ├── drugSlice.js
    │   ├── learningSlice.js
    │   ├── studyRecordsSlice.js
    │   └── store.js
    └── 🛠️ utils/               # Utility functions
        └── studyRecordSync.js
```

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **[Node.js 18.x or higher](https://nodejs.org/)** - JavaScript runtime
- **[Android Studio](https://developer.android.com/studio)** - Android development environment
- **[Visual Studio Code](https://code.visualstudio.com/)** - Code editor (recommended)
- **[Git](https://git-scm.com/)** - Version control

### Installation & Setup

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd Drug-Speak-App
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Install React Native CLI** *(if not already installed)*

   ```bash
   npm install -g @react-native-community/cli
   ```

4. **Android Development Setup**
   - Install Android Studio with default settings
   - Add Android Studio to your system PATH
   - Open Android Studio → **Tools** → **SDK Manager**
   - Install:
     - Android SDK (API level 33 or higher)
     - Android SDK Build-Tools
     - Android Emulator

5. **Create Android Virtual Device (AVD)**
   - Open Android Studio
   - Navigate to **Tools** → **AVD Manager**
   - Click **Create Virtual Device**
   - Select device (recommended: Pixel 4)
   - Choose system image (Android API 33+)
   - Complete setup and start the emulator

6. **Backend Server Setup**

   ```bash
   # Clone the backend repository
   git clone https://github.com/LarryAtGU/drug-speak-server
   cd drug-speak-server
   
   # Switch to the legacy branch
   git checkout -b legacy-sqlite3 origin/legacy-sqlite3
   
   # Install backend dependencies
   npm install
   
   # Start the backend server
   npm run start
   ```

7. **Run the Mobile App**

   Open a new terminal in the Drug-Speak-App directory:

   ```bash
   npm run start
   ```

   When Metro bundler starts, press **`a`** to run on Android emulator.

## 🛠️ Tech Stack

- **Frontend**: React Native, Redux Toolkit
- **Navigation**: React Navigation
- **Audio**: React Native Sound/Audio libraries
- **Backend**: Node.js (separate repository)
- **Database**: SQLite (backend)
- **Development**: Metro bundler, Android Studio
