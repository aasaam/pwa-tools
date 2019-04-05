const fs = require('fs');
const os = require('os');
const path = require('path');
const util = require('util');
const { exec } = require('child_process');

const { to } = require('await-to-js');
const async = require('async');
const _ = require('lodash');
const mkdirp = require('mkdirp');
const SVGO = require('svgo');
const sharp = require('sharp');
const favicons = require('favicons');
const xmlFormatter = require('xml-formatter');
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const humans = require('humans-generator');
const escape = require('escape-html');
const pretty = require('pretty');

const mkdtemp = util.promisify(fs.mkdtemp);
const writeFile = util.promisify(fs.writeFile);
const readFile = util.promisify(fs.readFile);
const stat = util.promisify(fs.stat);
const asyncMkdirp = util.promisify(mkdirp);
const asyncExec = util.promisify(exec);

const optimizeSvg = async (source, destination) => {
  const svgString = await readFile(source);
  const optSvg = new SVGO();
  const optimizedSvg = await optSvg.optimize(svgString);
  await writeFile(destination, optimizedSvg.data);
};

module.exports = async (config) => {
  const tmpDir = await mkdtemp(path.join(os.tmpdir(), `aasaam-${Date.now()}`));

  const pathList = {
    originalSvg: path.join(process.cwd(), config.path.logo),
    icons: path.join(tmpDir, 'icons'),
    public: path.join(tmpDir, 'public'),
    publicIcons: path.join(tmpDir, 'public', config.path.iconsPath),
    tmp: path.join(tmpDir, 'tmp'),
    tmpIcons: path.join(tmpDir, 'tmp', 'icons'),
    blackLogo: path.join(tmpDir, 'tmp', 'blacked.png'),
    blackLogoPnm: path.join(tmpDir, 'tmp', 'blacked.pnm'),
    blackLogoSvg: path.join(tmpDir, 'tmp', 'blacked.svg'),
    blackLogoResizedSvg: path.join(tmpDir, 'tmp', 'blacked-resized.svg'),
    safariPinnedTab: path.join(tmpDir, 'public', config.path.iconsPath, 'safari-pinned-tab.svg'),
    optimizedSvg: path.join(tmpDir, 'public', config.path.iconsPath, 'logo.svg'),
    logoPng: path.join(tmpDir, 'tmp', 'icons', 'logo.png'),
  };

  const [eOriginalSvg] = await to(stat(pathList.originalSvg));
  if (eOriginalSvg) {
    return [1, `Source logo ${pathList.originalSvg} not found.`];
  }

  await asyncMkdirp(pathList.publicIcons);
  await asyncMkdirp(pathList.tmpIcons);

  await optimizeSvg(pathList.originalSvg, pathList.optimizedSvg);

  await sharp(pathList.optimizedSvg, {
    density: config.favicons.density,
  })
    .resize(2048, 2048)
    .png()
    .toFile(pathList.logoPng);

  await asyncExec(
    `convert ${
      pathList.logoPng
    } -background white -alpha background -channel a -negate +channel ${
      pathList.blackLogo
    }`,
  );
  await asyncExec(
    `convert ${
      pathList.blackLogo
    } -channel RGB -fuzz 100% -fill black -opaque black ${pathList.blackLogo}`,
  );
  await asyncExec(
    `pngtopnm -alpha ${pathList.blackLogo} > ${pathList.blackLogoPnm}`,
  );
  await asyncExec(
    `potrace -W 16 -H 16 -b svg --flat -o ${pathList.blackLogoSvg} ${
      pathList.blackLogoPnm
    }`,
  );
  await asyncExec(
    `rsvg-convert -w 16 -h 16 -f svg -o ${pathList.blackLogoResizedSvg} ${
      pathList.blackLogoSvg
    }`,
  );

  await optimizeSvg(pathList.blackLogoResizedSvg, pathList.safariPinnedTab);

  await new Promise((res) => {
    const funcs = [];
    favicons(pathList.logoPng, config.favicons, (e, data) => {
      data.images.forEach(({ name, contents }) => {
        funcs.push((cb) => {
          const p = path.join(pathList.tmpIcons, name);
          fs.writeFile(p, contents, () => {
            cb(null);
          });
        });
      });
      data.files.forEach(({ name, contents }) => {
        funcs.push((cb) => {
          const p = path.join(pathList.public, name);
          let cnt;
          if (name.match(/xml$/)) {
            cnt = xmlFormatter(contents, {
              stripComments: true,
              indentation: '',
              collapseContent: true,
            }).replace(/[\n]{2,}/g, '\n').replace(/[\n]{2,}/g, '\n').replace(/\s\s\s\s/g, ' ');
          } else {
            cnt = JSON.stringify(JSON.parse(contents), null, 2);
          }
          fs.writeFile(p, cnt, () => {
            cb(null);
          });
        });
      });


      funcs.push((cb) => {
        let html = _.concat([
          '<!doctype html>',
          `<html dir="${config.favicons.dir}" lang="${config.favicons.lang}"><head>`,
          '<meta charset="utf-8">',
          '<meta name="viewport" content="width=device-width,initial-scale=1.0">',
          `<title>${escape(config.meta.appName)}</title>`,
          '<link rel="author" href="/humans.txt" />',
          `<link rel="mask-icon" href="${config.favicons.path}/safari-pinned-tab.svg" color="${config.favicons.theme_color}">`,
        ], data.html);
        html = html.map((line) => {
          let l = line;
          if (
            line.match(/xml/)
            || line.match(/favicon\.ico/)
            || line.match(/json/)) {
            l = line.replace(config.favicons.path, '');
          }
          return l
            .replace(/\.png"/g, '.png?v=<%= htmlWebpackPlugin.options.version %>"')
            .replace(/\.svg"/g, '.svg?v=<%= htmlWebpackPlugin.options.version %>"')
            .replace(/\.json"/g, '.json?v=<%= htmlWebpackPlugin.options.version %>"')
            .replace(/\.txt"/g, '.txt?v=<%= htmlWebpackPlugin.options.version %>"')
            .replace(/\.ico"/g, '.ico?v=<%= htmlWebpackPlugin.options.version %>"')
            .replace(/\.xml"/g, '.xml?v=<%= htmlWebpackPlugin.options.version %>"');
        });

        html.push('</head><body><div id="app"></div></body></html>');

        const resultHtml = pretty(html.join('\n')).replace(/[\n]{2,}/g, '\n').replace(/[\n]{2,}/g, '\n');
        fs.writeFile(path.join(pathList.public, 'index.aasaam.html'), resultHtml, () => {
          cb(null);
        });
      });

      funcs.push((cb) => {
        humans(config.humans, (eh, h) => {
          fs.writeFile(path.join(pathList.public, 'humans.txt'), h.join('\n'), () => {
            cb(null);
          });
        });
      });

      async.waterfall(funcs, () => {
        res();
      });
    });
  });

  await imagemin([`${pathList.tmpIcons}/*.png`], pathList.publicIcons, {
    plugins: [
      imageminPngquant({
        speed: 1,
        quality: [0.3, 0.5],
        strip: true,
      }),
    ],
  });

  const publicPath = path.join(process.cwd(), config.path.public);

  await asyncMkdirp(publicPath);

  await asyncExec(`mv ${pathList.tmpIcons}/favicon.ico ${pathList.public}/favicon.ico`);
  await asyncExec(`cp -rf ${pathList.public}/* ${publicPath}/`);

  return [null, 'Done'];
};
