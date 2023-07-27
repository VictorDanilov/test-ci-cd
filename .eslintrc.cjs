module.exports = {
  extends: ['react-app', 'react-app/jest', 'prettier'],
  rules: {},
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        'react/jsx-no-useless-fragment': 'error',
        'react/self-closing-comp': [
          'error',
          {
            component: true,
            html: true,
          },
        ],
      },
    },
  ],
};
