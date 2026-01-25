const { NodeIO } = require('@gltf-transform/core');
const { KHRMeshQuantization, EXTTextureWebP } = require('@gltf-transform/extensions');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function convertGlbImages(inputPath, outputPath) {
  if (!fs.existsSync(inputPath)) {
    console.error('Input file not found:', inputPath);
    process.exit(2);
  }

  const io = new NodeIO();
  // Register extensions that may be required by the file (quantization, webp texture extension)
  io.registerExtensions([KHRMeshQuantization, EXTTextureWebP]);
  console.log('Reading', inputPath);
  const doc = await io.read(inputPath);

  const root = doc.getRoot();
  const textures = root.listTextures();
  console.log('Found', textures.length, 'textures');

  let converted = 0;
  for (const texture of textures) {
    const mime = texture.getMimeType && texture.getMimeType();
    if (!mime) continue;
    if (mime.toLowerCase() === 'image/webp') {
      // prefer embedded image, fallback to external URI if present
      let data = null;
      try {
        data = texture.getImage && texture.getImage();
      } catch (e) {
        data = null;
      }
      if (!data) {
        const uri = texture.getURI && texture.getURI();
        if (uri) {
          const candidate = path.isAbsolute(uri) ? uri : path.join(path.dirname(inputPath), uri);
          if (fs.existsSync(candidate)) {
            data = fs.readFileSync(candidate);
          }
        }
      }

      if (!data) {
        console.warn('Could not retrieve image data for texture with URI or embedded data. Skipping.');
        continue;
      }

      try {
        const png = await sharp(data).png().toBuffer();
        texture.setImage(png);
        texture.setMimeType('image/png');
        converted++;
        console.log('Converted one texture to PNG');
      } catch (err) {
        console.error('Failed to convert a texture:', err);
      }
    }
  }

  if (converted === 0) {
    console.log('No WebP images found; nothing converted.');
  } else {
    console.log(`Converted ${converted} images to PNG.`);
  }

  console.log('Writing', outputPath);
  io.write(outputPath, doc);
  console.log('Wrote', outputPath);
}

const inputArg = process.argv[2];
let outputArg = process.argv[3];
if (!inputArg) {
  console.error('Usage: node fix-glb-images.js <input.glb> [output.glb]');
  process.exit(1);
}
if (!outputArg) {
  outputArg = inputArg.replace(/\.glb$/i, '-fixed.glb');
}

convertGlbImages(inputArg, outputArg).catch(err => {
  console.error('Error processing GLB:', err);
  process.exit(1);
});