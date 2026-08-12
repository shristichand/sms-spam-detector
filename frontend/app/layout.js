import "./globals.css";

export const metadata = {
  title: "Spam Detector",
  description: "Detect whether a message is spam using machine learning.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
