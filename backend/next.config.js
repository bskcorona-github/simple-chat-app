const path = require('path');

module.exports = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/:path*', // 全てのリクエストをキャッチ
        destination: '/index.html', // 静的ファイルの index.html を提供
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias['@public'] = path.join(__dirname, 'public');
    return config;
  },
};
