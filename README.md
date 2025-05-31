# 🏋️‍♂️ Workout Timer

A customizable interval workout timer built with **React Native** and **Expo**.
This app allows you to define workout blocks with nested sub-blocks (e.g. warm-up, work, rest), set durations, and set counts.

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
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 16
- Expo CLI (`npm install -g expo-cli`)
- Android/iOS simulator or Expo Go on your device

### Installation

1. **Clone the Repository**

```bash
git clone https://github.com/eneko-osia/WorkoutTimer.git
cd WorkoutTimer
```

2. **Install Dependencies**

```bash
npm install
# or
yarn
```

3. **Start the Development Server**

```bash
expo start
```

4. **Run on Device or Emulator**

- Scan the QR code with Expo Go on your phone
- Or press i (iOS) / a (Android) in terminal

---

## 📂 Project Structure

```bash
.
├── components/        # Reusable UI components
├── screens/           # App screens (Home, Setup, Timer)
├── types/             # Shared TypeScript types
├── navigation/        # Navigation type definitions
├── theme/             # Theme and style definitions
├── utils/             # Utility functions (e.g., formatTime)
├── App.tsx            # Entry point (loads MainApp)
├── MainApp.tsx        # Navigation container
└── README.md
```
---

## 📄 License

MIT License

---

## 🙌 Contributing

Feel free to fork and submit PRs.
Feedback and contributions are welcome!
