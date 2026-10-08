import { getReading, type TarotCard } from './tarotData';

const FONT = '"PingFang SC", "Microsoft YaHei", -apple-system, sans-serif';
const SHARE_SCREEN = './assets/share/screen@3x.png';
const XUNLEI_BRAND = './assets/share/xunlei-browser.png';

async function loadImage(src: string) {
  const image = new Image();
  image.src = src;
  await image.decode();
  return image;
}

function drawCover(
  context: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
) {
  const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.naturalWidth - sourceWidth) / 2;
  // Keep faces and the central symbol in view while cropping away the card title.
  const sourceY = (image.naturalHeight - sourceHeight) * .4;
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

export async function createSharePoster(card: TarotCard, question: string): Promise<Blob> {
  const [image, template, brand] = await Promise.all([
    loadImage(card.image),
    loadImage(SHARE_SCREEN),
    loadImage(XUNLEI_BRAND),
  ]);
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = 840;
  canvas.height = 1482;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  const reading = getReading(card, question);

  // Start from the original 3x card frame so glow, border and curve stay exact.
  // This is the same crop used by the original single-card share implementation.
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, 840, 1482, 64);
  ctx.clip();
  ctx.drawImage(template, 164, 504, 840, 1482, 0, 0, 840, 1482);
  ctx.restore();

  // The tarot art is embedded in the original curved window. It is deliberately
  // cropped like the reference instead of showing the complete portrait card.
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(42, 44);
  ctx.lineTo(798, 44);
  ctx.lineTo(798, 646);
  ctx.quadraticCurveTo(420, 846, 42, 646);
  ctx.closePath();
  ctx.clip();
  drawCover(ctx, image, 42, 44, 756, 720);
  ctx.restore();

  // Rebuild the curved edge on top of the embedded art.
  ctx.strokeStyle = '#e3bd5d';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 650);
  ctx.quadraticCurveTo(420, 848, 840, 650);
  ctx.stroke();
  ctx.strokeStyle = '#f7da8b';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 676);
  ctx.quadraticCurveTo(420, 840, 840, 676);
  ctx.stroke();

  // Clear the old fixed text while keeping the original high-resolution footer
  // mark. The footer mark is part of the source frame and stays sharper than a
  // redrawn approximation.
  ctx.fillStyle = '#fffefd';
  ctx.fillRect(22, 805, 796, 485);
  ctx.fillRect(226, 1318, 520, 100);
  ctx.globalAlpha = .12;
  ctx.strokeStyle = '#bca8e6';
  ctx.lineWidth = 2;
  for (const radius of [180, 260, 340]) {
    ctx.beginPath();
    ctx.arc(420, 1110, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#895eff';
  ctx.font = `600 48px ${FONT}`;
  ctx.fillText(`✦ 今日抽卡 · ${card.name} ✦`, 420, 906);

  const divider = ctx.createLinearGradient(250, 0, 590, 0);
  divider.addColorStop(0, 'rgba(137,94,255,0)');
  divider.addColorStop(.45, 'rgba(137,94,255,.46)');
  divider.addColorStop(.55, 'rgba(137,94,255,.46)');
  divider.addColorStop(1, 'rgba(137,94,255,0)');
  ctx.fillStyle = divider;
  ctx.fillRect(248, 966, 344, 5);

  ctx.fillStyle = '#29242d';
  ctx.font = `400 38px ${FONT}`;
  reading.advice.forEach((line, index) => ctx.fillText(`-${line}`, 420, 1064 + index * 70));

  const footerX = 226;
  ctx.drawImage(brand, footerX, 1350, 188, 35);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#111';
  ctx.font = `600 36px ${FONT}`;
  ctx.fillText('· 今日灵感卡', footerX + 206, 1368);
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG export failed')), 'image/png'));
}
