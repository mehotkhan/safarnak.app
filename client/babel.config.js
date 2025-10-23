module.exports = function(api) {
  api.cache(true);
  const prod = process.env.NODE_ENV === 'production';
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ['inline-import', { extensions: ['.sql'] }],
      prod && ['transform-remove-console', { exclude: ['error', 'warn'] }],
    ].filter(Boolean),
  };
};
