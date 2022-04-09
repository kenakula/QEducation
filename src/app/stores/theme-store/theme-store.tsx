import { ThemeProvider } from '@emotion/react';
import { createTheme, CssBaseline } from '@mui/material';
import { Theme } from '@mui/system';
import React, { useContext, useMemo, useState } from 'react';

// eslint-disable-next-line no-shadow
export enum ColorMode {
  Light = 'light',
  Dark = 'dark',
}

type ContextProps = {
  mode: ColorMode;
  toggleColorMode: () => void;
  theme: Theme;
};

interface Props {
  children: JSX.Element;
}

export const ThemeStoreContext = React.createContext<Partial<ContextProps>>({});

export function useThemeStore(): Partial<ContextProps> {
  return useContext(ThemeStoreContext);
}

export function ThemeStoreProvider(props: Props): JSX.Element {
  const { children } = props;

  const [mode, setMode] = useState<ColorMode>(ColorMode.Light);

  const theme = useMemo(
    () =>
      createTheme({
        typography: {
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          fontSize: 16,
          fontWeightLight: 300,
          fontWeightRegular: 400,
          fontWeightMedium: 500,
        },
        palette: {
          mode,
          background: {
            default: mode === ColorMode.Dark ? '#222222' : '#fffdfc',
          },
        },
      }),
    [mode],
  );

  const toggleColorMode = (): void => {
    setMode((prev: ColorMode) =>
      prev === ColorMode.Light ? ColorMode.Dark : ColorMode.Light,
    );
  };

  const value = useMemo(
    () => ({
      mode,
      toggleColorMode,
      theme,
    }),
    [mode, theme],
  );

  return (
    <ThemeStoreContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeStoreContext.Provider>
  );
}
