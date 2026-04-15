const themeConfig = require('../constants/tailwind.theme'); // 파일 경로를 확인하세요

function generateV4Css(config) {
  let css = `@import "tailwindcss";\n\n`;

  // 1. @theme 블록 생성 (Colors, Radius, Spacing, Font Families)
  css += `@theme {\n`;

  // Colors 변환
  if (config.theme.colors) {
    Object.entries(config.theme.colors).forEach(([colorName, shades]) => {
      Object.entries(shades).forEach(([shade, value]) => {
        css += `  --color-${colorName}-${shade}: ${value};\n`;
      });
    });
  }

  // BorderRadius 변환
  if (config.theme.borderRadius) {
    Object.entries(config.theme.borderRadius).forEach(([key, value]) => {
      css += `  --radius-${key}: ${value};\n`;
    });
  }

  // Spacing 변환
  if (config.theme.spacing) {
    Object.entries(config.theme.spacing).forEach(([key, value]) => {
      css += `  --spacing-${key}: ${value};\n`;
    });
  }

  // Typography에서 사용된 폰트 패밀리 추출 및 테마 등록
  const fontFamilies = new Set();
  Object.values(config.typography).forEach(style => fontFamilies.add(style.fontFamily));
  fontFamilies.forEach(font => {
    css += `  --font-${font.toLowerCase()}: "${font}";\n`;
  });

  css += `}\n\n`;

  // 2. @utility 블록 생성 (Typography 스타일)
  Object.entries(config.typography).forEach(([className, styles]) => {
    // '.' 제거 (text-head1-b 형태로 만들기 위함)
    const cleanClassName = className.replace('.', '');
    css += `@utility ${cleanClassName} {\n`;
    css += `  font-family: var(--font-${styles.fontFamily.toLowerCase()});\n`;
    css += `  font-size: ${styles.fontSize};\n`;
    css += `  line-height: ${styles.lineHeight};\n`;
    css += `  letter-spacing: ${styles.letterSpacing};\n`;
    css += `}\n\n`;
  });

  return css;
}

console.log(generateV4Css(themeConfig));