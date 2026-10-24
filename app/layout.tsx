import { Noto_Sans_JP } from "next/font/google";
import "../styles/layout.css";

const notoSansJP = Noto_Sans_JP({ preload: false });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <title>六目並べ</title>
        <meta charSet="utf-8" />
      </head>
      <body>{children}</body>
    </html>
  );
}
