import "./globals.css";

export const metadata = {
  title: "Trivents — We Capture. We Create. We Connect.",
  description:
    "Trivents is the social media and event creative club of Trinity Institute — building stories, moments, and digital experiences with culture, creativity, and community at the center.",
  keywords: [
    "Trivents",
    "Trinity Institute",
    "social media club",
    "event creative",
    "community",
  ],
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
