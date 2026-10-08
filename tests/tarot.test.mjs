import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { TAROT_CARDS, drawTarotCard, getReading } from '../app/tarotData.ts';

const expected = {
  joy: '愚人 皇后 恋人 太阳 世界 权杖王牌 权杖三 权杖四 权杖六 权杖八 权杖侍从 圣杯王牌 圣杯二 圣杯三 圣杯九 圣杯十 星币王牌 星币三 星币九 星币十',
  reflection: '魔术师 女祭司 皇帝 教皇 正义 审判 权杖二 权杖国王 圣杯七 圣杯国王 星币二 星币七 星币八 星币侍从 星币骑士 星币国王 宝剑王牌 宝剑二 宝剑王后 宝剑国王',
  healing: '力量 隐士 倒吊人 节制 星星 权杖九 权杖王后 圣杯四 圣杯五 圣杯六 圣杯侍从 圣杯骑士 圣杯王后 星币六 星币王后 宝剑三 宝剑四 宝剑六 宝剑十',
  stress: '战车 命运之轮 死神 恶魔 高塔 月亮 权杖五 权杖七 权杖十 权杖骑士 圣杯八 星币四 星币五 宝剑五 宝剑七 宝剑八 宝剑九 宝剑侍从 宝剑骑士',
};

test('exactly 78 unique cards, with the supplied emotion assignments', () => {
  assert.equal(TAROT_CARDS.length, 78);
  for (const key of ['id', 'name', 'image', 'sourceTitle']) assert.equal(new Set(TAROT_CARDS.map(card => card[key])).size, 78);
  for (const [emotion, names] of Object.entries(expected)) {
    assert.deepEqual(TAROT_CARDS.filter(card => card.emotion === emotion).map(card => card.name).sort(), names.split(' ').sort());
  }
  assert.equal(TAROT_CARDS.filter(card => card.id.startsWith('major-')).length, 22);
  for (const suit of ['wands', 'cups', 'pentacles', 'swords']) {
    for (let rank = 1; rank <= 14; rank++) assert.ok(TAROT_CARDS.some(card => card.id === `${suit}-${String(rank).padStart(2, '0')}`));
  }
});

test('all 78 outcomes are reachable, rejection is unbiased, and repeats are allowed', () => {
  assert.equal(new Set(Array.from({ length: 78 }, (_, index) => drawTarotCard(() => index).id)).size, 78);
  let draws = 0;
  assert.equal(drawTarotCard(() => draws++ === 0 ? 0xffffffff : 77).id, TAROT_CARDS[77].id);
  assert.equal(draws, 2);
  assert.equal(drawTarotCard(() => 5).id, drawTarotCard(() => 5).id);
});

test('readings follow the drawn card and selected question context', () => {
  const first = TAROT_CARDS[0];
  assert.equal(getReading(first, '学习').meaning, first.meaning);
  assert.notEqual(getReading(first, '学习').context, getReading(first, '情感沟通').context);
  for (const card of TAROT_CARDS) {
    const reading = getReading(card, '我今天可以做些什么？');
    assert.equal(reading.advice.length, 3);
    assert.equal(reading.advice[0], card.practice);
    assert.ok(card.meaning.length > 20);
  }
});

test('every card has its own verified high-resolution local image and attribution', () => {
  const manifest = JSON.parse(readFileSync(new URL('../public/assets/tarot/sources.json', import.meta.url)));
  assert.equal(manifest.length, 78);
  const hashes = new Set();
  for (const card of TAROT_CARDS) {
    const source = manifest.find(item => item.id === card.id);
    assert.equal(source.name, card.name);
    assert.equal(source.license, 'Public domain');
    assert.equal(decodeURIComponent(source.source).replaceAll('_', ' '), `https://commons.wikimedia.org/wiki/File:${card.sourceTitle} (Rider-Waite Smith tarot deck).png`);
    const image = readFileSync(new URL(`../public/assets/tarot/${card.id}.png`, import.meta.url));
    assert.equal(image.readUInt32BE(16), 960);
    assert.ok(image.readUInt32BE(20) >= 1600);
    const hash = createHash('sha256').update(image).digest('hex');
    assert.equal(hash, source.sha256);
    hashes.add(hash);
  }
  assert.equal(hashes.size, 78);
});
