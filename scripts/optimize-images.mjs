// One-off / reusable helper to re-encode heavy source images (case covers,
// logos, client marquee logos) into resized WebP files for production use.
// Run manually after adding new large images: node scripts/optimize-images.mjs
import sharp from 'sharp';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../public');

async function toWebp(relIn, relOut, opts = {}) {
  const input = path.join(ROOT, relIn);
  const output = path.join(ROOT, relOut);
  let pipeline = sharp(input);
  if (opts.width) pipeline = pipeline.resize({ width: opts.width });
  pipeline = pipeline.webp({ quality: opts.quality ?? 80 });
  const info = await pipeline.toFile(output);
  console.log(`${relIn} -> ${relOut}: ${info.width}x${info.height}, ${(info.size / 1024).toFixed(1)} KiB`);
}

const caseImages = [
  'brognoli',
  'santa-ilha-sunclub',
  'aldo-imoveis',
  'maria-do-mar-hotel',
  'pousada-dos-sonhos',
  'vokkan-vivapark',
];

const clientLogos = ['brognoli', 'buzz', 'captei', 'jessica-mendonca', 'vokkan', 'yes-empreendimentos'];

async function main() {
  for (const name of caseImages) {
    await toWebp(`images/cases/${name}.jpeg`, `images/cases/${name}.webp`, { width: 1200, quality: 78 });
  }

  await toWebp('oca-logo-white.png', 'oca-logo-white.webp', { width: 333, quality: 90 });

  await toWebp(
    'lovable-uploads/2bc2982a-cd57-40a2-900d-a5859cf5face.png',
    'lovable-uploads/equipe-oca-digital.webp',
    { width: 192, quality: 85 }
  );

  await toWebp(
    'lovable-uploads/e79f7b11-3826-4bd5-ab00-59394cfadb26.png',
    'lovable-uploads/oca-one-icon.webp',
    { width: 192, quality: 85 }
  );

  for (const name of clientLogos) {
    await toWebp(`clients/${name}.png`, `clients/${name}.webp`, { quality: 90 });
  }
}

main();
