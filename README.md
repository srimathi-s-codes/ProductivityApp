# FocusForge

FocusForge is a premium, mobile-first productivity app built with React, TypeScript, Tailwind CSS, Framer Motion, and Vite. It showcases a polished dashboard for tasks, habits, focus sessions, notes, and planning.

## Features
- Modern dashboard with stats, motivational card, and quick actions
- Task management experience with priorities, due dates, and reminders
- Habit pulse with streak-style progress indicators
- Pomodoro, notes, and planner sections
- PWA support for installable offline-friendly use

## Development
```bash
npm install
npm run dev
```

## Production build
```bash
npm run build
npm run preview
```

## PWA and APK notes
- The app is configured for PWA support via Vite PWA.
- To prepare a mobile build later, use Capacitor or Tauri and package the app for Android.
- For Firebase integration, add your own configuration in a Firebase setup file and wire authentication/firestore/storage services.
