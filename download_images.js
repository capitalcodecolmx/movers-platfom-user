import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = [
  {
    url: 'https://static.wixstatic.com/media/0ca6e2_5b672ec398924f9ba1c75048fdfc10e3~mv2.png/v1/fill/w_216,h_61,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/logo-c-f%20(1).png',
    path: 'src/assets/images/branding/logo.png'
  },
  {
    url: 'https://static.wixstatic.com/media/0ca6e2_5b0875a4abd34d6da215fd8f8b795b8b~mv2.png/v1/fill/w_144,h_251,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/garrafon-policarbonato-low.png',
    path: 'src/assets/images/products/garrafon.png'
  },
  {
    url: 'https://static.wixstatic.com/media/0ca6e2_384d4090584e4657ba8dbe912fa2b7aa~mv2.png/v1/fill/w_154,h_221,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0ca6e2_384d4090584e4657ba8dbe912fa2b7aa~mv2.png',
    path: 'src/assets/images/products/botella-5l.png'
  },
  {
    url: 'https://static.wixstatic.com/media/0ca6e2_10d8818490074efb884b4bc8ff8bf9eb~mv2.png/v1/fill/w_143,h_210,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0ca6e2_10d8818490074efb884b4bc8ff8bf9eb~mv2.png',
    path: 'src/assets/images/products/galon.png'
  },
  {
    url: 'https://static.wixstatic.com/media/0ca6e2_ffeace8d924d45f2a089ae61f3f26482~mv2.png/v1/fill/w_124,h_202,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0ca6e2_ffeace8d924d45f2a089ae61f3f26482~mv2.png',
    path: 'src/assets/images/products/medio-galon.png'
  },
  {
    url: 'https://static.wixstatic.com/media/0ca6e2_a43a5fa72dcf4b04813e4369b2035a89~mv2.png/v1/fill/w_176,h_210,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0ca6e2_a43a5fa72dcf4b04813e4369b2035a89~mv2.png',
    path: 'src/assets/images/products/galon-baby.png'
  },
  {
    url: 'https://static.wixstatic.com/media/0ca6e2_ac6d01f6eb7c451e86c2bce46987eed3~mv2.png/v1/fill/w_115,h_209,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0ca6e2_ac6d01f6eb7c451e86c2bce46987eed3~mv2.png',
    path: 'src/assets/images/products/botella-1-5l.png'
  },
  {
    url: 'https://static.wixstatic.com/media/0ca6e2_7355c60ed1214e048ddbf99d7484ac5e~mv2.png/v1/fill/w_88,h_191,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0ca6e2_7355c60ed1214e048ddbf99d7484ac5e~mv2.png',
    path: 'src/assets/images/products/botella-1l.png'
  },
  {
    url: 'https://static.wixstatic.com/media/0ca6e2_1677cddd3d48496188050e988bbb5757~mv2.png/v1/fill/w_86,h_200,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0ca6e2_1677cddd3d48496188050e988bbb5757~mv2.png',
    path: 'src/assets/images/products/botella-600ml.png'
  },
  {
    url: 'https://static.wixstatic.com/media/0ca6e2_37d88b39c9b14e75b59111b1f060886c~mv2.png/v1/fill/w_70,h_151,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/0ca6e2_37d88b39c9b14e75b59111b1f060886c~mv2.png',
    path: 'src/assets/images/products/botella-350ml.png'
  }
];

const downloadImage = (url, filepath) => {
  const fullPath = path.resolve(process.cwd(), filepath);
  const dir = path.dirname(fullPath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const file = fs.createWriteStream(fullPath);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded: ${filepath}`);
          resolve();
        });
      } else {
        reject(`Failed to download ${url}: Status Code ${res.statusCode}`);
      }
    }).on('error', (err) => {
      reject(`Error downloading ${url}: ${err.message}`);
    });
  });
};

const main = async () => {
  for (const img of images) {
    try {
      await downloadImage(img.url, img.path);
    } catch (error) {
      console.error(error);
    }
  }
};

main();
