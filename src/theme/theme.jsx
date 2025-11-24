// src/theme/theme.jsx
export const theme = {
  colors: {
    background: '#1a1a2e', 
    card: '#16244bff',       
    text: '#f5f6fa',       
    muted: '#78879dff',      
    accent: '#db092cff',     
    danger: '#ff6b6b',
    buttonText: '#fff',
  },
  spacing: (factor) => factor * 8, 
  radius: {
    sm: 6,
    md: 12,
    lg: 20,
    round: 60, // для аватара
  },
  text: {
    title: { fontSize: 18, fontWeight: '700' },
    subtitle: { fontSize: 14 },
    button: { fontSize: 16, fontWeight: 'bold' },
  },
  globalStyles: {
    container: {
      flex: 1,
      backgroundColor: '#1a1a2e',
      padding: 16,
    },
    card: {
      backgroundColor: '#16244bff',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    button: {
      backgroundColor: '#db092cff',
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
      fontSize: 16,
    },
  },
};

