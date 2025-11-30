# 🚀 Towards1 Frontend

A modern mobile application built with **Expo + React Native + TypeScript** for the Towards1 ecosystem.

---

## ✨ Features

🔐 **Authentication**
- Login & Signup with validation  
- Secure token-based session (AuthContext)

👤 **Profile Management**
- Update profile (Name, Bio, Social Links)
- Upload profile picture
- Social media URL validation (GitHub, LinkedIn, Instagram)
- Profile completion score + level system

🎨 **Modern UI Experience**
- Clean styling using NativeWind (Tailwind CSS)
- Fully responsive and minimal UI

---

## 🛠 Tech Stack

| Technology | Purpose |
|----------|---------|
| Expo + React Native | Cross-platform development |
| TypeScript | Type safety |
| NativeWind | Tailwind CSS for styling |
| Axios | API requests |
| React Navigation | App navigation |
| Context API | Authentication state |

---

## 📌 Requirements

- Node.js LTS
- npm or yarn
- Expo Go app *(for mobile testing)*
- Android Studio / Xcode *(optional — emulator testing)*

---

## 🧪 Installation

### 1️⃣ Clone Repository
```bash
git clone https://github.com/Aditya-1708/towards1frontend.git
cd towards1frontend
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Environment Variables
Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=http://192.168.0.9:8000
```

📌 API URL notes:
| Platform | URL |
|---------|-----|
| Android Emulator | `http://10.0.2.2:8000` |
| Physical Device | Use machine's local network IP |

---

## ▶️ Run the App

Start Expo:
```bash
npx expo start
```

Other commands:
```bash
npx expo run:android
npx expo run:ios
npx expo start --web
```

---

## 📂 Project Structure

```
src/
├── api/          # Axios config
├── components/   # UI components
├── context/      # Auth provider
├── screens/      # Screens (Login, Signup, Profile, Home)
└── types/        # TypeScript interfaces
```

---

## 🧩 Troubleshooting

| Issue | Solution |
|------|----------|
| Network Error | Check backend running + IP correct |
| Android HTTP Issue | Enable `usesCleartextTraffic` in AndroidManifest |
| API not connecting | Ensure phone + PC on same Wi-Fi |

---

## 📸 Screenshots & Demo

### 🎥 Demo Video
👉 https://youtube.com/shorts/D8FvQ4ZjtHE?feature=share

### 📱 App Screens

<p align="center">
  <img src="https://github.com/user-attachments/assets/89ffabbb-053d-41a8-bdd8-fd3e9cee5248" width="260" />
  <img src="https://github.com/user-attachments/assets/709207da-041b-42ee-a3c4-7860deaa7ee0" width="260" />
  <img src="https://github.com/user-attachments/assets/9a2d6702-8a5c-4fd5-b7ff-9354b1f298cb" width="260" />
</p>

---

## 📝 License

Licensed under the **MIT License**

---

## ⭐ Support

If this project helped you, don’t forget to leave a **star ⭐** on GitHub!

