import { EMOTIONS, getReading, type TarotCard } from './tarotData';

const FONT = '"PingFang SC", "Microsoft YaHei", -apple-system, sans-serif';

function wrapText(context: CanvasRenderingContext2D, text: string, width: number, limit: number): string[] {
  const lines: string[] = [];
  let line = '';
  for (const character of text.replace(/\s+/g, ' ')) {
    if (line && context.measureText(line + character).width > width) {
      lines.push(line);
      line = character;
    } else line += character;
  }
  if (line) lines.push(line);
  if (lines.length > limit) {
    lines.length = limit;
    let last = lines[limit - 1];
    while (context.measureText(last + '…').width > width) last = last.slice(0, -1);
    lines[limit - 1] = last + '…';
  }
  return lines;
}

export async function createSharePoster(card: TarotCard, question: string): Promise<Blob> {
  const image = new Image();
  image.src = card.image;
  await image.decode();
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = 840;
  canvas.height = 1650;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  // One composition supplies both the on-screen preview and 3x PNG export.
  ctx.scale(3, 3);
  const emotion = EMOTIONS[card.emotion];
  const reading = getReading(card, question);
  ctx.beginPath();
  ctx.roundRect(1, 1, 278, 548, 23);
  ctx.clip();
  const background = ctx.createLinearGradient(0, 0, 280, 550);
  background.addColorStop(0, emotion.background);
  background.addColorStop(.65, '#fffdf1');
  background.addColorStop(1, '#fff');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, 280, 550);

  ctx.strokeStyle = '#d9b452';
  ctx.lineWidth = .65;
  ctx.globalAlpha = .3;
  for (const r of [96, 116, 136, 156]) {
    ctx.beginPath(); ctx.arc(140, 158, r, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const artHeight = 305;
  const artWidth = artHeight * image.naturalWidth / image.naturalHeight;
  const artX = (280 - artWidth) / 2;
  ctx.save();
  ctx.shadowColor = '#604d3e30'; ctx.shadowBlur = 10; ctx.shadowOffsetY = 3;
  ctx.fillStyle = '#fff';
  ctx.beginPath(); ctx.roundRect(artX - 4, 10, artWidth + 8, artHeight + 8, 8); ctx.fill();
  ctx.restore();
  ctx.drawImage(image, artX, 14, artWidth, artHeight);

  ctx.fillStyle = '#ffffff';
  ctx.beginPath(); ctx.moveTo(0, 301); ctx.quadraticCurveTo(140, 366, 280, 301);
  ctx.lineTo(280, 550); ctx.lineTo(0, 550); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = '#dfb547'; ctx.lineWidth = 1.2;
  ctx.beginPath(); ctx.moveTo(0, 301); ctx.quadraticCurveTo(140, 366, 280, 301); ctx.stroke();

  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#895eff'; ctx.font = `600 15px ${FONT}`;
  ctx.fillText(`✦ 今日抽卡 · ${card.name} ✦`, 140, 355);
  ctx.fillStyle = emotion.background;
  ctx.beginPath(); ctx.roundRect(107, 375, 66, 22, 11); ctx.fill();
  ctx.fillStyle = emotion.color; ctx.font = `600 11px ${FONT}`;
  ctx.fillText(emotion.name, 140, 386);
  ctx.fillStyle = '#857d8f'; ctx.font = `10px ${FONT}`;
  ctx.fillText(card.keywords, 140, 412);
  ctx.fillStyle = '#3d3548'; ctx.font = `500 11px ${FONT}`;
  const questionLines = wrapText(ctx, `“${question}”`, 232, 2);
  questionLines.forEach((line, i) => ctx.fillText(line, 140, 436 + i * 15));
  ctx.fillStyle = '#706779'; ctx.font = `10px ${FONT}`;
  reading.advice.forEach((line, i) => ctx.fillText(`· ${line}`, 140, 471 + i * 17));
  ctx.fillStyle = '#3e3748'; ctx.font = `600 9px ${FONT}`;
  ctx.fillText('迅雷浏览器 · 今日灵感卡', 140, 524);
  ctx.fillStyle = '#99939f'; ctx.font = `7px ${FONT}`;
  ctx.fillText('仅用于娱乐与自我探索', 140, 540);

  const gold = ctx.createLinearGradient(0, 0, 280, 550);
  gold.addColorStop(0, '#fff6b1'); gold.addColorStop(.5, '#d4a946'); gold.addColorStop(1, '#fff0a1');
  ctx.strokeStyle = gold; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(2, 2, 276, 546, 22); ctx.stroke();
  return new Promise((resolve, reject) => canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('PNG export failed')), 'image/png'));
}
