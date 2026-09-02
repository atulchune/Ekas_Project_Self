const fs = require('fs');
const path = require('path');

const parsed = JSON.parse(fs.readFileSync(path.join(__dirname, 'parsed-assets.json'), 'utf-8'));

const assets = {
  hero: {
    desktopImage: "",
    mobileImage: "",
    video: "",
    poster: ""
  },
  products: {},
  story: {},
  lifestyle: { images: [], videos: [] },
  footer: { image: "" }
};

parsed.forEach(item => {
  if (!item.Filename) return;
  const url = item['Public URL'];
  const folder = item['Folder'];
  
  if (!assets.products[folder]) {
    assets.products[folder] = { images: [], videos: [] };
  }
  
  if (url.endsWith('.mp4')) {
    assets.products[folder].videos.push(url);
  } else if (url.match(/\.(png|jpg|jpeg|webp)$/)) {
    assets.products[folder].images.push(url);
  }
});

// Create config directory if not exists
const configDir = path.join(__dirname, 'src', 'config');
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
}

fs.writeFileSync(path.join(configDir, 'assets.json'), JSON.stringify(assets, null, 2));
console.log('Processed assets to src/config/assets.json');
