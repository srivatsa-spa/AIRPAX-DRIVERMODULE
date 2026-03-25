# AIRPAX Driver Application

AIRPAX is a premium ride-hailing application. This repository contains the mobile application for AIRPAX Drivers, built with React Native.

## Tech Stack
- **Framework:** React Native (`0.76.6` / latest stable architecture)
- **Language:** TypeScript
- **Navigation:** React Navigation (`@react-navigation/native`, `@react-navigation/native-stack`)
- **Maps:** `react-native-maps` for embedded Google Maps experience
- **State Management:** Zustand
- **Networking:** Axios, Socket.IO
- **UI Components:** Custom built (Glassmorphism, Elevated Cards, Premium Dark Theme)

## Recent Updates (Phase 1 UI Implementation)

The app interface has been completely overhauled to align with the new **AIRPAX Premium Design System**.

### Design System Insights
- **Color Palette:** Shifted to a sophisticated dark theme.
  - Primary Background: Dark Navy (`#0A1128`)
  - Surface/Card: Elevated (`#1A2238`), Glassmorphism.
  - Accents: Gold (`#D4AF37`) & Amber (`#FFC107`).
- **Typography:** Modern, legible font stack with standardized variants (`h1`, `h2`, `body`, `caption`, `label`).
- **Components:** Created/upgraded standard components: `Button`, `Card`, `Input`, `Typography`, `Badge`, `BottomSheet`, `MapMarker`, `TimerRing`, `RideCard`.

### Redesigned Screens
- **Authentication:** Sleek `LoginScreen` and `OTPScreen` with loading states.
- **Core Dashboard:** Map-centric layout with an `isOnline` toggle and dynamic bottom drawer (`DashboardScreen`).
- **Ride Flow:** Complete end-to-end premium ride flow:
  - `RideAssignmentScreen` (Accept/Decline with BottomSheet details)
  - `NavigateToPickupScreen` (Routing to rider)
  - `RideStartScreen` (OTP verification to start trip)
  - `RideProgressScreen` (Real-time live trip stats and SOS)
  - `RideCompletedScreen` (Success badge, fare details, and explicit Payment modes)
- **Management:** 
  - `ShiftManagementScreen` (Duty toggles, stats, preferences)
  - `EarningsScreen` (Financial overview, trip history)
  - `ProfileScreen` (Driver rating, vehicle details, document verification status)

## Setup & Running

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Metro Bundler**
   ```bash
   npm start
   ```

3. **Run the App**
   ```bash
   # Android
   npm run android
   
   # iOS (ensure pods are installed)
   cd ios && pod install && cd ..
   npm run ios
   ```

*(Note: Appropriate Google Maps API keys are required in `AndroidManifest.xml` and AppDelegate for full map functionality.)*

