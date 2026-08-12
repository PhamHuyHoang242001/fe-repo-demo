// antd v5 theme for the asset-hub module — maps antd's design tokens onto the canonical
// ah-* palette (tailwind.config.js / colors.ts) so antd controls (Select, Input, DatePicker,
// Modal, Button…) match the module's green/gold identity without per-instance styling.
// Wrap the module once in <ConfigProvider theme={AH_ANTD_THEME}> (see AssetHubApp).

import type { ThemeConfig } from 'antd';
import { AH_COLORS } from './colors';

export const AH_ANTD_THEME: ThemeConfig = {
  token: {
    // Brand
    colorPrimary: AH_COLORS.green,
    colorInfo: AH_COLORS.green,
    colorSuccess: AH_COLORS.green,
    colorError: AH_COLORS.red,
    colorWarning: AH_COLORS.amber,
    colorLink: AH_COLORS.green,

    // Text / surface
    colorText: AH_COLORS.ink,
    colorTextSecondary: AH_COLORS.muted,
    colorTextPlaceholder: AH_COLORS.muted,
    colorBorder: AH_COLORS.line,
    colorBgContainer: AH_COLORS.card,
    colorBgElevated: AH_COLORS.card,

    // Shape — full, generous rounding to match the module cards (rounded-xl ≈ 12px)
    borderRadius: 12,
    borderRadiusLG: 14,
    borderRadiusSM: 8,
    controlHeight: 40,
    controlHeightLG: 46,

    // Type — inherit the app font stack
    fontFamily: 'inherit',
    fontSize: 14,

    // Motion — a touch springy, matches the framer-motion feel
    motionDurationMid: '0.22s',
    motionEaseInOut: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
  components: {
    Select: {
      optionSelectedBg: AH_COLORS['green-l'],
      optionActiveBg: AH_COLORS.pale,
      controlItemBgActive: AH_COLORS['green-l'],
    },
    Input: {
      activeShadow: '0 0 0 3px rgba(0,105,62,0.16)',
      paddingBlock: 9,
    },
    InputNumber: {
      activeShadow: '0 0 0 3px rgba(0,105,62,0.16)',
    },
    DatePicker: {
      activeShadow: '0 0 0 3px rgba(0,105,62,0.16)',
    },
    Modal: {
      borderRadiusLG: 16,
    },
    Button: {
      controlHeight: 40,
      primaryShadow: '0 6px 16px -6px rgba(0,105,62,0.5)',
      fontWeight: 600,
    },
    Segmented: {
      itemSelectedBg: AH_COLORS.green,
      itemSelectedColor: '#ffffff',
      trackBg: AH_COLORS.pale,
      borderRadius: 12,
    },
  },
};
