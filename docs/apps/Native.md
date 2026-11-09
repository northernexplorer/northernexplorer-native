# Native

## Opening website links in the app

The native app claims HTTPS links on `northernexplorer.org`. Android uses a verified app link and iOS uses a universal link; the Expo Router routes keep the existing email paths, including `/user/activate?token=…` and `/user/reset-password?token=…`.

The website's association files are generated after the web export. Set these public release identifiers in the environment used for the export:

- `ANDROID_SHA256_CERT_FINGERPRINT`: the SHA-256 fingerprint of the Android **Play App Signing** certificate (not the upload certificate). Colons may be included.
- `IOS_APP_ID_PREFIX`: the 10-character App ID Prefix for the iOS app. The generated app ID combines this prefix with the bundle ID in `apps/native/app.json`.

Then run `yarn workspace northernexplorer-native build:web` and publish the export, including `dist/.well-known/assetlinks.json` and `dist/.well-known/apple-app-site-association`. If an identifier is not set, generation warns and skips only that platform's file; malformed identifiers fail the export instead of publishing an invalid association. Configure each value before exporting for that platform. The files are public and must contain the signing identities used by the app distributed to users.

The native app must also be rebuilt and released after changing `app.json`. Verify both files on the deployed production host: `https://northernexplorer.org/.well-known/assetlinks.json` and `https://northernexplorer.org/.well-known/apple-app-site-association` should return `200` with a JSON content type, without redirecting. On Android, open a real email link (or use `adb shell am start -a android.intent.action.VIEW -d 'https://northernexplorer.org/user/activate?token=TEST'`) and confirm the installed app handles it; on iOS, tap the email link on a device with the rebuilt app installed. Use real, unexpired tokens for end-to-end account activation or password reset.