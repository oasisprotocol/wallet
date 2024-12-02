# Mobile app development

## GitHub secrets

- generate keystore password with a password manager
(e.g. `pass generate rose-wallet/android-keystore-password`)
- generate keystore file (keep in mind that validity flag must be aligned with
[mobile app expected lifespan])

 <!-- markdownlint-disable MD013 -->

 ```
keytool -genkeypair -v -keystore rose-wallet-android.jks -keyalg RSA -keysize 4096 -validity 9125 -alias rose-wallet-android -storepass $(pass rose-wallet/android-keystore-password)
```
<!-- markdownlint-enable MD013 -->

When asked, enter something like below:

```
Enter the distinguished name. Provide a single dot (.) to leave a sub-component empty or 
press ENTER to use the default value in braces.
What is your first and last name?
  [Unknown]:  Oasis
What is the name of your organizational unit?
  [Unknown]:  Engineering
What is the name of your organization?
  [Unknown]:  Oasis Protocol Foundation
What is the name of your City or Locality?
  [Unknown]:  
What is the name of your State or Province?
  [Unknown]:  
What is the two-letter country code for this unit?
  [Unknown]:  
Is CN=Oasis, OU=Engineering, O=Oasis Protocol Foundation, L=Unknown, ST=Unknown, C=Unknown correct?
  [no]:  yes
```

- encode keystore file in base64 format so it can be added as GitHub secret

```
base64 rose-wallet-android.jks > rose-wallet-android.jks.base64
```

- provide all secrets in repo settings
<https://github.com/oasisprotocol/wallet/settings/secrets/actions> ->
New repository secret: `KEYSTORE_FILE` , `KEYSTORE_PASSWORD` and `KEY_ALIAS`.

## Convert Android App Bundle (AAB) to Android Package (APK)

Our GitHub workflows create signed AAB and APK files.
We use AAB to upload to Google Play Store and APK for testing.
In case of testing AAB locally follow steps below to convert bundle to APK:

- Download [bundletool] from the official GitHub repository
- Generate APK files

<!-- markdownlint-disable MD013 -->

```
java -jar bundletool-all-<VERSION>.jar build-apks --bundle=app-release-signed.aab --output=app-release-signed.apks --mode=universal
```

<!-- markdownlint-enable MD013 -->

- Extract the APK

```
  unzip app-release-signed.apks -d extracted-apks
```

- Install the APK on your device

```
adb -s <DEVICE_SERIAL_NUMBER> install extracted-apks/universal.apk
```

## Capacitor assets

- Create `assets` folder with source images

```
assets/
├── icon-only.png
├── icon-foreground.png
├── icon-background.png
├── splash.png
└── splash-dark.png
```

- Run a generator for a target platform:

```
npx @capacitor/assets generate --android
npx @capacitor/assets generate --ios
```

- Validate new assets in `resource` folder.
  Due to cropping and scaling issues update incorrect images manually
- Use image compression web app or CLI
- Additional information are available in [Capacitor Assets docs]

[Capacitor Assets docs]: https://github.com/ionic-team/capacitor-assets#usage---custom-mode
[bundletool]: https://github.com/google/bundletool/releases
[mobile app expected lifespan]: https://developer.android.com/studio/publish/app-signing#considerations
