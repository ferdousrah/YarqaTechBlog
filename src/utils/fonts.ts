// src/utils/fonts.ts - Google Fonts loader
import {
  Inter,
  Roboto,
  Open_Sans,
  Poppins,
  Lato,
  Montserrat,
  Nunito,
  Source_Sans_3,
  Work_Sans,
  Raleway,
  Playfair_Display,
  Merriweather,
  Space_Grotesk,
  DM_Sans
} from 'next/font/google'

// Define all available fonts
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-roboto',
  display: 'swap'
})

export const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap'
})

export const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap'
})

export const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-lato',
  display: 'swap'
})

export const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap'
})

export const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap'
})

export const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  variable: '--font-source-sans',
  display: 'swap'
})

export const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  display: 'swap'
})

export const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap'
})

export const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap'
})

export const merriweather = Merriweather({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-merriweather',
  display: 'swap'
})

export const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap'
})

export const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap'
})

// Combine all font variables
export const fontVariables = [
  inter.variable,
  roboto.variable,
  openSans.variable,
  poppins.variable,
  lato.variable,
  montserrat.variable,
  nunito.variable,
  sourceSans.variable,
  workSans.variable,
  raleway.variable,
  playfair.variable,
  merriweather.variable,
  spaceGrotesk.variable,
  dmSans.variable,
].join(' ')
