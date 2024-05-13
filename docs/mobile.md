# Mobile app development

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
