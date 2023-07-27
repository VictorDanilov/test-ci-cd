module.exports = {
  extends: ['react-app', 'react-app/jest', 'prettier'],
  rules: {},
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      rules: {
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
