import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import '../common.css';

const defaultTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const theme = createTheme(defaultTheme, {
  palette: {
    twitch: defaultTheme.palette.augmentColor({
      color: {
        main: '#9146ff',
      },
      name: 'twitch',
    }),
    nico: defaultTheme.palette.augmentColor({
      color: {
        main: '#444444',
      },
      name: 'nico',
    }),
    youtube: defaultTheme.palette.augmentColor({
      color: {
        main: '#ff0000',
      },
      name: 'youtube',
    }),
    twitter: defaultTheme.palette.augmentColor({
      color: {
        main: '#1da1f2',
      },
      name: 'twitter',
    }),
  },
  components: {
    MuiIcon: {
      styleOverrides: {
        root: {
          // Match 24px = 3 * 2 + 1.125 * 16
          boxSizing: 'content-box',
          padding: 3,
          fontSize: '1.125rem',
        },
      },
    },
  },
});

export const DashboardThemeProvider = ({
  children,
}: { children: React.ReactNode }) => {
  return (
    <ThemeProvider theme={theme}>
      { children }
    </ThemeProvider>
  );
};

declare module '@mui/material/styles' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Palette {
    twitch: Palette['primary'];
    nico: Palette['primary'];
    youtube: Palette['primary'];
    twitter: Palette['primary'];
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface PaletteOptions {
    twitch?: PaletteOptions['primary'];
    nico?: PaletteOptions['primary'];
    youtube?: PaletteOptions['primary'];
    twitter?: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Chip' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ChipPropsColorOverrides {
    twitch: true;
    nico: true;
    youtube: true;
    twitter: true;
  }
}
