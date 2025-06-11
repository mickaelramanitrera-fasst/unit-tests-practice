import tsLint from "typescript-eslint"

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,jsx,tsx}"]
  },
  ...tsLint.configs.recommended,
];
