# AASAAM PWA Tool

[![Build Status](https://img.shields.io/travis/com/AASAAM/pwa-tools.svg)](https://travis-ci.com/AASAAM/pwa-tools)
[![Coverage Status](https://img.shields.io/coveralls/github/AASAAM/pwa-tools.svg)](https://coveralls.io/github/AASAAM/pwa-tools)
[![Up to date](https://img.shields.io/david/AASAAM/pwa-tools.svg)](https://david-dm.org/AASAAM/pwa-tools)
[![Up to date](https://img.shields.io/david/dev/AASAAM/pwa-tools.svg)](https://david-dm.org/AASAAM/pwa-tools)
[![Vulnerabilities](https://img.shields.io/snyk/vulnerabilities/github/AASAAM/pwa-tools.svg)](https://snyk.io/test/github/AASAAM/pwa-tools)

Generic tools for generate optimized icons and manifest for your PWA.

## Requirements

GNU/Linux (prefer Ubuntu) via installed following packages:

```bash
sudo apt install potrace librsvg2-bin imagemagick netpbm
```

## Installation

```bash
sudo npm install -g @aasaam/pwa-tools --unsafe-perm
```

## Usage

Initialize AASAAM config

```bash
pwa-tools init
```

After init the aasaam configuration default generated and you can modify to generate items.

```js
// .aasaam
{
  "meta": {
    "appName": "AASAAM Software Group",
    "appShortName": "AASAAM",
    "appDescription": "AASAAM Software Group - Dadeh Pardazan Ati Prozheh",
    "developerName": "AASAAM Software Group - Development",
    "developerURL": "https://github.com/AASAAM"
  },
  "humans": { // humans.txt
    "team": [
      {
        "Original developer": "AASAAM Development Group",
        "Location": "Tehran, Iran"
      }
    ],
    "thanks": [
      "Node",
      "GNU/Linux"
    ],
    "site": {
      "Standards": "HTML5, CSS3, JavaScript",
      "Components": "Vue.js, Normalize.css",
      "Softwares": "VSCode, Atom, GNU nano"
    },
    "note": "Built with love by AASAAM Software Group"
  },
  "path": { // relative path on cwd on pwa-tools command
    "logo": "logo.svg",
    "public": "public",
    "iconsPath": "img/icons"
  },
  "favicons": { // https://github.com/itgalaxy/favicons
    "density": 900, // svg density for scale
    "path": "/img/icons",
    "dir": "ltr",
    "lang": "en-US",
    "background": "#ffffff",
    "theme_color": "#ffffff",
    "appleStatusBarStyle": "black-translucent",
    "display": "standalone",
    "orientation": "any",
    "scope": "/",
    "start_url": "/?home-screen=1",
    "version": "0.0.1",
    "logging": false,
    "pixel_art": false,
    "loadManifestWithCredentials": false,
    "icons": {
      "android": true,
      "appleIcon": true,
      "appleStartup": true,
      "coast": true,
      "favicons": true,
      "firefox": true,
      "windows": true,
      "yandex": true
    }
  }
}
```

Show modified config:

```bash
pwa-tools show-config
```

Generate icons ans stuff

```bash
pwa-tools generate-icons
```
