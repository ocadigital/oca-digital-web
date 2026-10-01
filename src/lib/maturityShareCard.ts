import { DIMENSIONS, LEVELS, type Level, type TestResult } from '@/data/maturityTest';

const W = 1080;
const H = 1920;
const INK = '#0A0A10';
const PAPER = '#F3F3F7';
const MUTED = '#9C9CB0';
const VIOLET = '#B58BFA';

const loadImage = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

const glow = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) => {
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, color);
  g.addColorStop(1, 'rgba(10,10,16,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
};

/** Imagem 1080x1920 para Stories com o nível e o radar, sem dados pessoais. */
export async function renderShareCard(result: TestResult): Promise<Blob> {
  const level = result.level as Level;
  const info = LEVELS[level];
  try {
    await Promise.all([document.fonts.load('800 120px Inter'), document.fonts.load('600 40px Inter')]);
  } catch {
    // segue com a fonte de reserva
  }
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const font = (weight: number, size: number) => `${weight} ${size}px Inter, system-ui, sans-serif`;

  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);
  glow(ctx, 900, 260, 760, 'rgba(155,90,246,0.38)');
  glow(ctx, 120, 1700, 700, 'rgba(80,137,251,0.24)');

  const logo = await loadImage('/oca-logo-white.webp');
  if (logo) {
    const lw = 220;
    ctx.drawImage(logo, 96, 150, lw, (lw * logo.height) / logo.width);
  }

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = VIOLET;
  ctx.font = font(700, 34);
  ctx.fillText('MINHA IMOBILIÁRIA ESTÁ NO', 96, 420);

  ctx.fillStyle = info.color;
  ctx.font = font(800, 190);
  const lvl = `Nível ${level}`;
  ctx.fillText(lvl, 90, 610);
  const lw = ctx.measureText(lvl).width;
  ctx.fillStyle = MUTED;
  ctx.font = font(600, 56);
  ctx.fillText('de 5', 90 + lw + 24, 610);

  ctx.fillStyle = PAPER;
  ctx.font = font(700, 60);
  ctx.fillText(info.name, 96, 700);

  // barras dos 5 níveis
  for (let i = 1; i <= 5; i++) {
    ctx.fillStyle = i <= level ? LEVELS[i as Level].color : '#262633';
    const x = 96 + (i - 1) * 182;
    ctx.beginPath();
    ctx.roundRect(x, 760, 164, 18, 9);
    ctx.fill();
  }

  // radar
  const cx = W / 2;
  const cy = 1195;
  const R = 215;
  const pt = (i: number, ratio: number) => {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / DIMENSIONS.length;
    return [cx + Math.cos(a) * R * ratio, cy + Math.sin(a) * R * ratio, Math.cos(a)] as const;
  };
  const path = (ratios: number[]) => {
    ctx.beginPath();
    ratios.forEach((r, i) => {
      const [x, y] = pt(i, r);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
  };
  ctx.strokeStyle = '#2E2E3D';
  ctx.lineWidth = 2;
  for (let n = 1; n <= 5; n++) {
    path(DIMENSIONS.map(() => n / 5));
    ctx.stroke();
  }
  DIMENSIONS.forEach((_, i) => {
    const [x, y] = pt(i, 1);
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(x, y);
    ctx.stroke();
  });
  path(result.dimensions.map((d) => d.score / 5));
  ctx.globalAlpha = 0.28;
  ctx.fillStyle = info.color;
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = info.color;
  ctx.lineWidth = 6;
  ctx.lineJoin = 'round';
  ctx.stroke();
  result.dimensions.forEach((d, i) => {
    const [x, y] = pt(i, d.score / 5);
    ctx.beginPath();
    ctx.arc(x, y, 11, 0, Math.PI * 2);
    ctx.fillStyle = info.color;
    ctx.fill();
  });
  DIMENSIONS.forEach((d, i) => {
    const [x, y, cos] = pt(i, 1.22);
    ctx.textAlign = Math.abs(cos) < 0.2 ? 'center' : cos > 0 ? 'left' : 'right';
    ctx.fillStyle = PAPER;
    ctx.font = font(700, 32);
    ctx.fillText(d.short, x, y + (i === 0 ? -14 : 8));
    ctx.fillStyle = MUTED;
    ctx.font = font(600, 30);
    ctx.fillText(result.dimensions[i].score.toFixed(1), x, y + (i === 0 ? 26 : 46));
  });
  ctx.textAlign = 'left';

  // chamada
  ctx.fillStyle = PAPER;
  ctx.font = font(800, 64);
  ctx.fillText('E a sua imobiliária?', 96, 1610);
  ctx.fillStyle = MUTED;
  ctx.font = font(500, 38);
  ctx.fillText('Teste de Maturidade grátis, 10 perguntas', 96, 1672);
  ctx.fillStyle = VIOLET;
  ctx.font = font(700, 42);
  ctx.fillText('ocadigital.com.br/teste-maturidade', 96, 1745);

  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('canvas vazio'))), 'image/png'),
  );
}
