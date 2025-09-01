# Spin the Wheel - Sobeys Mobile App

A production-quality React Native mobile application with Firebase backend that implements a server-authoritative spin wheel game with cooldown mechanics, history tracking, and smooth animations.

## 🎯 Overview

This app features an 8-segment wheel that users can spin to win prizes. The backend ensures fairness through server-authoritative spin results, enforces cooldown periods, and maintains a complete history of all spins.

### Key Features

- **8-Segment Wheel**: Configurable wheel segments loaded from Firestore
- **Server-Authoritative Spins**: All spin results determined by Firebase Cloud Functions
- **Cooldown System**: Enforces time-based restrictions between spins
- **Spin History**: Complete record of all user spins with timestamps
- **Smooth Animations**: Wheel animates to server-determined results
- **Cross-Platform**: Works on both iOS and Android
- **Real-time Updates**: Live cooldown timer and history updates

## 🏗️ Architecture

### Frontend (React Native + TypeScript)

**Technology Stack:**

- React Native with Expo
- TypeScript for type safety
- Zustand for state management
- React Navigation for routing
- NativeWind for styling
- React Native Reanimated for smooth animations

**State Management Choice: Zustand**

We chose **Zustand** over React Query, Redux Toolkit, or other alternatives for the following reasons:

1. **Simplicity**: Zustand has minimal boilerplate compared to Redux Toolkit, making it easier to maintain and understand
2. **Bundle Size**: At ~2KB gzipped, Zustand is significantly smaller than Redux Toolkit (~15KB) or React Query (~13KB)
3. **TypeScript Support**: Excellent TypeScript integration with automatic type inference
4. **Performance**: Efficient re-renders with built-in selector optimization
5. **Persistence**: Built-in persistence middleware for offline support
6. **DevTools**: Excellent debugging experience with Redux DevTools integration

**Why not React Query?**

- React Query is primarily for server state management and caching, but our app has significant client-side state (wheel animations, UI state, user preferences)
- We need real-time updates and complex state interactions that are better handled by a general state management solution

**Why not Redux Toolkit?**

- Overkill for our use case - we don't need the complex action/reducer patterns
- Larger bundle size and more boilerplate code
- Zustand provides the same benefits with less complexity

**Networking Strategy:**

- Direct Firebase SDK calls for real-time data
- Cloud Functions for server-authoritative game logic
- No additional networking layer needed due to Firebase's robust SDK

**Key Components:**

- `SpinWheel`: Main wheel component with animation logic
- `CooldownTimer`: Real-time countdown display
- `SpinHistory`: List of past spins
- `PrizeDisplay`: Congratulations popup with reward details

### Backend (Firebase)

**Firestore Collections:**

- `wheelConfig`: Wheel segment configuration (8 segments, weights, colors)
- `spins`: User spin history with timestamps and results
- `users`: (Optional) User profile data

**Cloud Functions:**

- `spinWheel`: Server-authoritative spin with cooldown enforcement
- `getHistory`: Fetch user's spin history

**Security Rules:**

- Authenticated users can only access their own data
- Wheel config is read-only for authenticated users
- Spins can only be created through Cloud Functions

## 🚀 Setup Instructions

### Prerequisites

- Node.js 20+
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- Firebase CLI (`npm install -g firebase-tools`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/akshatbiztech/spint-the-wheel-sobeys.git
cd spin-the-wheel-sobeys

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../firebase
npm install
```

### 2. Firebase Setup

```bash
cd firebase

# Login to Firebase
firebase login

# Initialize Firebase project (if not already done)
firebase init

# Start Firebase emulators
npm run serve
```

### 3. Configure Environment Variables

Create `.env` file in the `frontend` directory:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Seed the Database

```bash
cd firebase
npm run seed
```

This creates the initial wheel configuration with 8 segments.

### 5. Run the Application

```bash
# Terminal 1: Start Firebase emulators
cd firebase
npm run serve

# Terminal 2: Start React Native app
cd frontend
npm start
```

### 6. Build for Production

```bash
# iOS
cd frontend
npm run build:ios

# Android
cd frontend
npm run build:android
```

## 🧪 Testing

### Backend Tests

```bash
cd firebase
npm test
```

Tests cover:

- Weighted random selection algorithm
- Cooldown enforcement
- Idempotency handling
- Error cases

### Frontend Tests

```bash
cd frontend
npm run type-check
npm run lint
```

## 📱 App Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── SpinWheel/      # Main wheel component
│   │   └── shared/         # Common components
│   ├── pages/              # Screen components
│   │   ├── app/           # Main app screens
│   │   └── auth/          # Authentication screens
│   ├── hooks/             # Custom React hooks
│   ├── services/          # API and Firebase services
│   ├── store/             # Zustand state management
│   └── types/             # TypeScript type definitions

firebase/
├── src/
│   └── index.ts           # Cloud Functions
├── seed/
│   └── seed.ts            # Database seeding
└── tests/                 # Unit tests
```

## 🔒 Security & Fairness

### Server-Authoritative Design

- All spin results determined by Cloud Functions
- Client cannot manipulate outcomes
- Idempotency prevents duplicate spins

### Cooldown Enforcement

- Server-side cooldown validation
- ClientRequestId prevents race conditions
- Graceful error handling for cooldown violations

### Data Integrity

- Firestore security rules enforce data access
- Timestamp-based validation
- User isolation (users can only access their own data)

## 🎨 UX/UI Features

### Smooth Animations

- React Native Reanimated for 60fps animations
- Wheel spins to exact server-determined position
- Haptic feedback on spin completion

### Accessibility

- VoiceOver/TalkBack support
- High contrast mode compatibility
- Screen reader friendly labels

### Error Handling

- Network error recovery
- Graceful degradation
- User-friendly error messages

## 🔧 Configuration

### Wheel Configuration

The wheel supports 8 segments with configurable:

- Labels (prize names)
- Weights (probability distribution)
- Colors (visual customization)
- Cooldown duration

### Environment-Specific Settings

- Development: Firebase emulators
- Production: Live Firebase project
- Staging: Separate Firebase project

## 📊 Performance Considerations

### Frontend Optimization

- Lazy loading of components
- Memoization of expensive calculations
- Efficient re-renders with Zustand

### Backend Optimization

- Firestore indexing for queries
- Cloud Function cold start optimization
- Efficient data structures

## 🚀 Deployment

### Firebase Functions

```bash
cd firebase
firebase deploy --only functions
```

### React Native App

- iOS: Submit to App Store via Expo
- Android: Submit to Google Play Store via Expo


## 🆘 Troubleshooting

### Common Issues

**Firebase Emulator Connection**

- Ensure emulators are running before starting the app
- Check that environment variables point to emulator URLs

**Build Errors**

- Clear Metro cache: `npx expo start --clear`
- Reset iOS simulator: `xcrun simctl erase all`

**Authentication Issues**

- Verify Firebase project configuration
- Check security rules in Firestore

