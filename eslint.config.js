import tseslint from "typescript-eslint";

export default tseslint.config(...tseslint.configs.strictTypeChecked, ...tseslint.configs.stylisticTypeChecked, {
  rules: {
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      {
        allowNumber: true,
      },
    ],
  },
  languageOptions: {
    parserOptions: {
      project: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
