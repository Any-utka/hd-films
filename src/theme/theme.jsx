// src/theme/theme.js
export const theme = {
  colors: {
    background: '#1a1a2e', // глубокий фон
    card: '#16244bff',       // тёмные карточки
    text: '#f5f6fa',       // мягкий белый
    muted: '#78879dff',      // серо-голубой для второстепенного текста
    accent: '#db092cff',     // стильный неон (фиолетово-розовый)
  },
  spacing: (factor) => factor * 8, // например spacing(2) = 16
  radius: {
    sm: 6,
    md: 12,
    lg: 20,
  },
};
