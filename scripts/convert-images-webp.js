/**
 * Script pour convertir toutes les images existantes dans Strapi uploads en WebP.
 * Exécuter depuis la racine du projet :
 *   node scripts/convert-images-webp.js
 *
 * Prérequis : npm install sharp (déjà installé dans backend)
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = path.join(__dirname, '..', 'backend', 'public', 'uploads');
const SUPPORTED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.tiff', '.bmp'];

async function convertToWebP(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!SUPPORTED_EXTENSIONS.includes(ext)) return null;

  const webpPath = filePath.replace(/\.[^.]+$/, '.webp');

  // Ne pas re-convertir si le WebP existe déjà
  if (fs.existsSync(webpPath)) {
    return null;
  }

  try {
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(webpPath);

    const originalSize = fs.statSync(filePath).size;
    const webpSize = fs.statSync(webpPath).size;
    const savings = ((1 - webpSize / originalSize) * 100).toFixed(1);

    console.log(`✅ ${path.basename(filePath)} → .webp (${savings}% plus petit)`);
    return { original: filePath, webp: webpPath, savings };
  } catch (err) {
    console.error(`❌ Erreur pour ${path.basename(filePath)}: ${err.message}`);
    return null;
  }
}

async function main() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    console.error(`❌ Dossier uploads introuvable : ${UPLOADS_DIR}`);
    console.log('   Ce script doit être exécuté après avoir synchronisé les uploads du serveur.');
    process.exit(1);
  }

  const files = fs.readdirSync(UPLOADS_DIR);
  const imageFiles = files.filter(f => SUPPORTED_EXTENSIONS.includes(path.extname(f).toLowerCase()));

  console.log(`\n🖼  ${imageFiles.length} images trouvées dans ${UPLOADS_DIR}\n`);

  let converted = 0;
  let totalSavings = 0;

  for (const file of imageFiles) {
    const result = await convertToWebP(path.join(UPLOADS_DIR, file));
    if (result) {
      converted++;
      totalSavings += fs.statSync(result.original).size - fs.statSync(result.webp).size;
    }
  }

  console.log(`\n🎉 ${converted} images converties en WebP`);
  console.log(`💾 ${(totalSavings / 1024 / 1024).toFixed(2)} MB économisés au total\n`);
}

main();
