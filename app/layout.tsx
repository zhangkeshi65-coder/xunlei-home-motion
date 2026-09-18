import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://xunlei-home-motion.frosty-frog-4700.chatgpt.site'),
  title: '迅雷首页动效',
  description: '迅雷浏览器移动端首页动效还原',
  openGraph: {
    title: '迅雷首页动效',
    description: '移动端首页 · 1:1 动效还原',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: '迅雷首页动效',
    description: '移动端首页 · 1:1 动效还原',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
