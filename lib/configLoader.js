const path = require('path');
const fs = require('fs');

const { merge } = require('lodash');

const defaults = {
  meta: {
    appName: 'AASAAM Software Group', // Your application's name. `string`
    appShortName: 'AASAAM', // Your application's short_name. `string`. Optional. If not set, appName will be used
    appDescription: 'AASAAM Software Group - Dadeh Pardazan Ati Prozheh', // Your application's description. `string`
    developerName: 'AASAAM Software Group - Development', // Your (or your developer's) name. `string`
    developerURL: 'https://github.com/AASAAM', // Your (or your developer's) URL. `string`
  },
  humans: {
    team: [
      {
        'Original developer': 'AASAAM Development Group',
        Location: 'Tehran, Iran',
      },
    ],
    thanks: ['Node', 'GNU/Linux'],
    site: {
      Standards: 'HTML5, CSS3, JavaScript',
      Components: 'Vue.js, Normalize.css',
      Softwares: 'VSCode, Atom, GNU nano',
    },
    note: 'Built with love by AASAAM Software Group',
  },
  path: {
    logo: 'logo.svg',
    public: 'public',
    iconsPath: 'img/icons',
  },
  favicons: {
    density: 900, // for scale svg
    path: '/img/icons', // Path for overriding default icons path. `string`
    dir: 'ltr',
    lang: 'en-US', // Primary language for name and short_name
    background: '#ffffff', // Background colour for flattened icons. `string`
    theme_color: '#ffffff', // Theme color user for example in Android's task switcher. `string`
    appleStatusBarStyle: 'black-translucent', // Style for Apple status bar: "black-translucent", "default", "black". `string`
    display: 'standalone', // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
    orientation: 'any', // Default orientation: "any", "natural", "portrait" or "landscape". `string`
    scope: '/', // set of URLs that the browser considers within your app
    start_url: '/?home-screen=1', // Start URL when launching the application from a device. `string`
    version: '0.0.1', // Your application's version string. `string`
    logging: false, // Print logs to console? `boolean`
    pixel_art: false,
    loadManifestWithCredentials: false,
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: true,
      coast: true,
      favicons: true,
      firefox: true,
      windows: true,
      yandex: true,
    },
  },
};

module.exports = async () => {
  const aasaamFile = await new Promise((res) => {
    const p = path.join(process.cwd(), '.aasaam');
    fs.stat(p, (e) => {
      if (e) {
        res(false);
      } else {
        res(p);
      }
    });
  });
  if (aasaamFile) {
    const aasaam = await new Promise((res) => {
      fs.readFile(
        aasaamFile,
        {
          encoding: 'utf8',
        },
        (e, raw) => {
          res(JSON.parse(raw));
        },
      );
    });
    const result = merge(defaults, aasaam);
    result.favicons.appName = result.meta.appName;
    result.favicons.appShortName = result.meta.appShortName;
    result.favicons.appDescription = result.meta.appDescription;
    result.favicons.developerName = result.meta.developerName;
    result.favicons.developerURL = result.meta.developerURL;
    return result;
  }
  return defaults;
};
