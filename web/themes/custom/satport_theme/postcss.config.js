module.exports = {
  plugins: [
    require("postcss-import"),
    require("postcss-preset-env")({
      stage: 1,
      features: {
        "nesting-rules": true,
        "custom-media-queries": true,
      },
    }),
  ],
};
