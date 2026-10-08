"""Fetch the 78 public-domain Commons images and retain per-file attribution.

Input: JSON manifest from app/tarotData.ts on stdin. Images are unchanged
960px Wikimedia thumbnails; the deployed site does not hotlink third parties.
"""
import concurrent.futures
import hashlib
import json
from pathlib import Path
import struct
import sys
import time
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'public/assets/tarot'
DEST.mkdir(parents=True, exist_ok=True)
CARDS = json.load(sys.stdin)
HEADERS = {'User-Agent': 'XunleiTarot/1.0 (https://github.com/zhangkeshi65-coder/xunlei-home-motion; static asset import)'}


def fetch(url):
    for attempt in range(4):
        try:
            with urllib.request.urlopen(urllib.request.Request(url, headers=HEADERS), timeout=45) as response:
                return response.read()
        except Exception:
            if attempt == 3:
                raise
            time.sleep(3 * (attempt + 1))


infos = {}
for start in range(0, len(CARDS), 39):
    titles = ['File:' + c['sourceTitle'] + ' (Rider-Waite Smith tarot deck).png' for c in CARDS[start:start + 39]]
    params = {'action': 'query', 'prop': 'imageinfo', 'titles': '|'.join(titles), 'iiprop': 'url|size|extmetadata', 'iiurlwidth': 960, 'format': 'json'}
    data = json.loads(fetch('https://commons.wikimedia.org/w/api.php?' + urllib.parse.urlencode(params)))
    for page in data['query']['pages'].values():
        info = page['imageinfo'][0]
        assert info['extmetadata']['LicenseShortName']['value'] == 'Public domain', page['title']
        infos[page['title']] = info


def download(card):
    title = 'File:' + card['sourceTitle'] + ' (Rider-Waite Smith tarot deck).png'
    info = infos[title]
    dest = DEST / (card['id'] + '.png')
    content = dest.read_bytes() if dest.exists() else fetch(info['thumburl'])
    assert content[:8] == b'\x89PNG\r\n\x1a\n', title
    width, height = struct.unpack('>II', content[16:24])
    assert width == 960 and height >= 1600, (title, width, height)
    dest.write_bytes(content)
    return {'id': card['id'], 'name': card['name'], 'file': dest.name, 'source': info['descriptionurl'], 'download': info['thumburl'], 'artist': info['extmetadata']['Artist']['value'], 'license': 'Public domain', 'width': width, 'height': height, 'sha256': hashlib.sha256(content).hexdigest(), 'bytes': len(content)}


results = []
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
    for index, result in enumerate(pool.map(download, CARDS), 1):
        results.append(result)
        if index % 10 == 0 or index == 78:
            print(f'Downloaded {index}/78', flush=True)

(DEST / 'sources.json').write_text(json.dumps(results, ensure_ascii=False, indent=2) + '\n')
print(f'Complete: {len(results)} images, {sum(r["bytes"] for r in results) / 1024 / 1024:.1f} MiB', flush=True)
