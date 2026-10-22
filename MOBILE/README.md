# Welcome to your RTM App 👋

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

## Build Application

```bash
   eas build -p android --profile preview | production | development
```

## Expo project (EAS)

- **Current:** owner `rosielunas-team`, project ID `dd4ea334-bf66-442f-a795-082fb00c45eb` (since 19 October 2026).
- **Previous:** owner `splurridge`, project ID `c949487f-1968-4ff9-b36b-a7c4502a473c`. It holds the Android signing
  key and version counter used for the builds already on Google Play. We had no access to it, so it was replaced.

**Before the next Play Store release:** builds from the new project are signed with a new key. In Google Play
Console, go to *App integrity → App signing* and request an **upload key reset**, using the new upload
certificate shown by `eas credentials -p android`. Also set the version code above the last one on Google Play
with `eas build:version:set -p android` (app.json had versionCode 100006).

The project is not in its own git repository yet. Until it is, run this in the same PowerShell terminal before
any EAS command:

```bash
$env:EAS_NO_VCS="1"
```

## Local testing against your PC

Copy `.env.example` to `.env.development.local` and set `EXPO_PUBLIC_API_URL` to your PC's Wi-Fi IP
(`http://192.168.x.x:3000`). Release builds always use the production server.
