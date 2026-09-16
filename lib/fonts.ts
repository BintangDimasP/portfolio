import { Source_Serif_4, Playfair_Display } from "next/font/google";

export const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
});

export const playfair = Playfair_Display({
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "600"],
  display: "swap",
  variable: "--font-playfair",
});
