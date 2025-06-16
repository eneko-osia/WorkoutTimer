# 🏋️‍♂️ Workout Timer

A customizable interval workout timer built with **React Native**.
This app allows you to define workout blocks with nested sub-blocks (e.g. warm-up, work, rest), set durations, and set counts.

[![Android](https://github.com/eneko-osia/WorkoutTimer/actions/workflows/android-ci.yml/badge.svg?branch=develop)](https://github.com/eneko-osia/WorkoutTimer/actions/workflows/android-ci.yml?query=branch:develop)

---

## 📱 Features

- 📦 Define nested workout blocks (blocks and sub-blocks)
- ⏱️ Set custom durations and labels
- 🔁 Repeat blocks for multiple sets
- 🎨 Light and dark theme support
- 📐 Responsive design with font scaling

---

## 🛠 Tech Stack

- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- Java Development Kit (JDK 17+)
- Android Studio (Android SDK, virtual devices)
- React Native CLI (https://reactnative.dev/docs/environment-setup)

### Installation

1. **Clone the Repository**

```bash
git clone https://github.com/eneko-osia/WorkoutTimer.git
cd WorkoutTimer
```

2. **Install Dependencies**

```bash
npm install
```

3. **Start the Development Server**

```bash
npm start
```

4. **Run on Android or iOS**

```bash
npm run android
# or
npm run ios
```
---

## 📂 Project Structure

```bash
.
├── android/            # Android native app
├── ios/                # iOS native app
├── src/
│ ├── components/       # Reusable UI components
│ ├── screens/          # App screens
│ ├── types/            # Shared TypeScript types
│ ├── navigation/       # Navigation type definitions
│ ├── theme/            # Theme and style definitions
│ ├── utils/            # Utility functions
├── App.tsx             # Entry point
├── MainApp.tsx         # Navigation container
└── README.md
```
---

## 📄 License

MIT License

---

## 🙌 Contributing

Feel free to fork and submit PRs.
Feedback and contributions are welcome!
