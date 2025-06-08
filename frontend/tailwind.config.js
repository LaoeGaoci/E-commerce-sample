const { useFormState } = require("react-dom");

// tailwind.config.js
module.exports = {
  content: [
      './src/**/*.{js,jsx,ts,tsx}',          // 扫描整个 src 文件夹（可选）
      './src/app/**/*.{js,jsx,ts,tsx}',
      './src/components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
      extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ],
};

