import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      collections: {
        ep: () => import('@iconify-json/ep/icons.json').then((i) => i.default),
      },
    }),
  ],
  transformers: [
    transformerDirectives(),   // 支持 @apply
    transformerVariantGroup(), // 支持 hover:(bg-red text-white)
  ],
  shortcuts: {
    // 常用 admin 快捷组合
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'card-base': 'rounded-2xl bg-white/80 backdrop-blur shadow-sm',
    'glass-panel': 'bg-white/70 backdrop-blur-md rounded-2xl shadow-lg',
  },
  theme: {
    colors: {
      // 与 SCSS 变量保持一致
      primary: {
        DEFAULT: '#3b82f6',
        50:  '#eff6ff',
        100: '#dbeafe',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      },
      surface: {
        DEFAULT: '#ffffff',
        muted: '#f8fafc',
      },
      sidebar: {
        DEFAULT: '#0f172a',
        hover:   '#1e293b',
      },
    },
  },
});
