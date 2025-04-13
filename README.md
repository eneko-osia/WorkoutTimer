
# WorkoutTimer 🕒

A customizable workout timer built with React Native and TypeScript.

## Features

- ⏱️ Work and Rest intervals
- 🔁 Set multiple sets
- 🧭 Intuitive UI with customizable timing
- 🟦 Built using React Native (TypeScript)

---

## 📦 Installation

### Prerequisites

- Node.js ≥ 16.x
- npm or yarn
- Android Studio (for Android builds)
- Xcode (for iOS builds, macOS only)

### 1. Clone the Repository

```bash
git clone https://github.com/eneko-osia/WorkoutTimer.git
cd WorkoutTimer
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

---

## 🚀 Running the App

### Android

```bash
npx react-native run-android
```

### iOS (macOS only)

```bash
npx react-native run-ios
```

### Start Metro Bundler manually (optional)

```bash
npx react-native start
```

---

## 🛠️ Development

- **Languages:** TypeScript
- **UI:** React Native Components
- **State Management:** React Hooks

Project structure:
```
WorkoutTimer/
├── src/
│   ├── components/
│   │   ├── TimerBlock.tsx
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── SetupScreen.tsx
│   │   ├── Timer.tsx
│   └── App.tsx
├── ios/
├── android/
├── package.json
└── tsconfig.json
```

---

## 🧪 Testing

Testing setup not included yet. Suggestions:
- Jest for unit tests
- Detox for end-to-end testing

---

## 📄 License

MIT License

---

## 🙌 Contributing

Feel free to fork and submit PRs. Feedback and contributions are welcome!
