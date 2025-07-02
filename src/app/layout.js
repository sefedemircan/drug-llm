import { Geist, Geist_Mono } from "next/font/google";
import { MantineProvider, createTheme } from '@mantine/core';
import "@mantine/core/styles.css";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { ChatProvider } from "../context/ChatContext";
import { ThemeProvider } from "../context/ThemeContext";
import { Montserrat, Open_Sans } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Yeni fontlar
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  display: "swap",
});

// İlaç chatbotu için tema renkleri - global.css değişkenleriyle uyumlu hale getirildi
const theme = createTheme({
  fontFamily: 'var(--font-geist-sans)',
  fontFamilyMonospace: 'var(--font-geist-mono)',
  defaultRadius: 'md',
  white: '#FFFFFF',
  primaryColor: 'primary',
  colors: {
    // Ana tema rengi - global.css'deki --primary: #1976D2 değeriyle uyumlu
    primary: [
      '#E3F2FD', // 0: En açık ton
      '#BBDEFB', // 1: Açık Mavi (global.css'deki --primary-light)
      '#90CAF9', // 2
      '#64B5F6', // 3
      '#42A5F5', // 4
      '#2196F3', // 5
      '#1E88E5', // 6
      '#1976D2', // 7: Koyu Mavi (global.css'deki --primary)
      '#1565C0', // 8: (global.css'deki --text-title)
      '#0D47A1', // 9: En koyu ton
    ],
    // İkincil renk - global.css'deki --secondary: #00C853 değeriyle uyumlu
    secondary: [
      '#E8F5E9', // 0: En açık ton
      '#C8E6C9', // 1
      '#A5D6A7', // 2
      '#81C784', // 3
      '#66BB6A', // 4
      '#4CAF50', // 5
      '#43A047', // 6
      '#388E3C', // 7
      '#2E7D32', // 8
      '#00C853', // 9: Yeşil (global.css'deki --secondary)
    ],
    // Vurgu rengi - global.css'deki --accent: #FF5722 değeriyle uyumlu
    accent: [
      '#FBE9E7', // 0: En açık ton
      '#FFCCBC', // 1
      '#FFAB91', // 2
      '#FF8A65', // 3
      '#FF7043', // 4
      '#FF5722', // 5: Turuncu (global.css'deki --accent)
      '#F4511E', // 6
      '#E64A19', // 7
      '#D84315', // 8
      '#BF360C', // 9: En koyu ton
    ],
    // Nötr gri tonları
    neutral: [
      '#FFFFFF', // 0: Beyaz (global.css'deki --background-white)
      '#F2F2F2', // 1: Açık Gri
      '#E5E5E5', // 2
      '#D9D9D9', // 3
      '#BFBFBF', // 4
      '#A6A6A6', // 5
      '#808080', // 6
      '#707070', // 7: (global.css'deki --text-muted)
      '#4A4A4A', // 8
      '#333333', // 9: En koyu ton (global.css'deki --text-body ve --foreground-dark)
    ],
  }
});

export const metadata = {
  title: "DrugLLM",
  description: "DrugLLM, yapay zeka destekli bir ilaç bilgi sistemidir.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${openSans.variable}`}>
        <ThemeProvider>
          <MantineProvider theme={theme} defaultColorScheme="light">
            <AuthProvider>
              <ChatProvider>
                {children}
              </ChatProvider>
            </AuthProvider>
          </MantineProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
