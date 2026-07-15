import "../styles/globals.css";

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
