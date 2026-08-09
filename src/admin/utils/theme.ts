import { theme, type ThemeConfig } from 'antd';
import { THEME_TOKENS } from '@/constants';
import type { ThemeMode } from '@/store/theme.store';

export const getAntdTheme = (mode: ThemeMode): ThemeConfig => ({
  algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
  token: {
    colorPrimary: THEME_TOKENS.colorPrimary,
    colorInfo: THEME_TOKENS.colorPrimary,
    colorLink: THEME_TOKENS.colorPrimary,
    borderRadius: THEME_TOKENS.borderRadius,
    fontFamily: THEME_TOKENS.fontFamily,
    colorBgLayout: mode === 'dark' ? '#12141a' : THEME_TOKENS.colorBgLayout,
    colorBgContainer: mode === 'dark' ? '#1a1d24' : THEME_TOKENS.colorBgContainer,
    colorText: mode === 'dark' ? '#f5f6f8' : THEME_TOKENS.colorText,
    colorTextSecondary: THEME_TOKENS.colorTextSecondary,
    controlHeight: 42,
  },
  components: {
    Layout: {
      siderBg: '#16181f',
      headerBg: 'transparent',
      bodyBg: 'transparent',
    },
    Menu: {
      darkItemBg: 'transparent',
      darkSubMenuItemBg: 'transparent',
      darkItemSelectedBg: THEME_TOKENS.colorPrimary,
      darkItemHoverBg: 'rgba(255, 80, 0, 0.15)',
      itemBorderRadius: 12,
    },
    Button: {
      primaryShadow: '0 10px 24px rgba(255, 80, 0, 0.28)',
      borderRadius: 12,
      fontWeight: 600,
    },
    Card: {
      borderRadiusLG: 18,
      paddingLG: 20,
    },
    Table: {
      headerBorderRadius: 12,
    },
    Input: {
      borderRadius: 12,
    },
    Select: {
      borderRadius: 12,
    },
  },
});
