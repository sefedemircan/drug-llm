import { Geist, Geist_Mono } from "next/font/google";
import { MantineProvider, createTheme } from '@mantine/core';
import "@mantine/core/styles.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// İlaç chatbotu için tema renkleri
const theme = createTheme({
  fontFamily: 'var(--font-geist-sans)',
  fontFamilyMonospace: 'var(--font-geist-mono)',
  defaultRadius: 'md',
  white: '#FFFFFF',
  primaryColor: 'primary',
  colors: {
    // Ana tema rengi - Koyu Mavi
    primary: [
      '#E6EFF5', // 0: En açık ton
      '#CDDEE3', // 1: Açık Mavi
      '#A3C4D3', // 2
      '#7BAAC3', // 3
      '#5390B3', // 4
      '#2A76A3', // 5
      '#1F6894', // 6
      '#145A85', // 7
      '#0B4F6C', // 8: Koyu Mavi (Ana renk)
      '#063D59', // 9: En koyu ton
    ],
    // İkincil renk - Turkuaz/Çam Yeşili
    secondary: [
      '#EDF7F2', // 0: En açık ton
      '#D1ECE1', // 1
      '#B5E0D1', // 2
      '#99D4C1', // 3
      '#7DC9B1', // 4
      '#61BDA1', // 5
      '#50A68B', // 6
      '#40916C', // 7: Turkuaz/Çam Yeşili (İkincil renk)
      '#307956', // 8
      '#216240', // 9: En koyu ton
    ],
    // Vurgu rengi - Mercan/Turuncu
    accent: [
      '#FFF2EE', // 0: En açık ton
      '#FFE6DD', // 1
      '#FFD9CC', // 2
      '#FFCCBB', // 3
      '#FFBFAA', // 4
      '#FFA989', // 5
      '#FF9876', // 6
      '#FF8C61', // 7: Mercan/Turuncu (Vurgu rengi)
      '#FF704D', // 8
      '#FF5538', // 9: En koyu ton
    ],
    // Nötr gri tonları
    neutral: [
      '#FFFFFF', // 0: Beyaz
      '#F2F2F2', // 1: Açık Gri
      '#E5E5E5', // 2
      '#D9D9D9', // 3
      '#BFBFBF', // 4
      '#A6A6A6', // 5
      '#808080', // 6
      '#666666', // 7
      '#4A4A4A', // 8: Koyu Gri (Metin)
      '#333333', // 9: En koyu ton
    ],
  }
});

export const metadata = {
  title: "İlaç Bilgi Chatbotu",
  description: "İlaçlar hakkında bilgi veren yapay zeka destekli chatbot",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <MantineProvider theme={theme} defaultColorScheme="light">
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
