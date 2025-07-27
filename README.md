# 💊 Drug Speak  

A React Native educational application for learning pharmaceutical drug pronunciation, featuring audio playback, pronunciation practice, user authentication, and comprehensive drug database with learning progress tracking.

## 🚀 How to Run This React Native App in VS Code with Android Studio

### ✅ Prerequisites  

Make sure the following are installed on your machine:

- [Node.js 18.x or higher](https://nodejs.org/)  
- [Android Studio](https://developer.android.com/studio)  
- [Visual Studio Code](https://code.visualstudio.com/)  
- [Git](https://git-scm.com/)

---

### 🛠️ Steps to Run the Project

1. **Open the Project in VS Code**  

2. **Install Node.js Dependencies**  
   Run the following command in the VS Code terminal:

   ```bash
   npm install
   ```

3. **Install React Native CLI Globally**  

   ```bash
   npm install -g @react-native-community/cli
   ```

4. **Set Up Android Development Environment**  

   **Android Studio Setup:**
   - Install Android Studio with default settings, adding it to your system PATH (check the relevant checkbox)
   - Open Android Studio → `Tools` → `SDK Manager`
   - Install Android SDK (API level 33 or higher)
   - Install Android SDK Build-Tools
   - Install Android Emulator``

5. **Create Android Virtual Device (AVD)**  
   - Open Android Studio
   - Go to `Tools` → `AVD Manager`
   - Click `Create Virtual Device`
   - Choose a device (recommended: Pixel 4)
   - Select system image (Android API 33+)
   - Click `Finish` and start the emulator

6. **Install the backend API server**  

   ```bash
   git clone https://github.com/LarryAtGU/drug-speak-server
   ```

7. **Go directly to that server**  

   ```bash
   cd drug-speak-server
   ```

8. **Install required Node.js Dependencies**

   ```bash
   git checkout -b legacy-sqlite3 origin/legacy-sqlite3
   ```

   ```bash
   npm install --legacy-peer-deps
   ```

9. **Start the backend API server**  

   ```bash
   npm run start
   ```

10. **Run the App on Android**  
    Open a new terminal in VS Code and run:

    ```bash
    npm run start
    ```

    and then click on `a`
