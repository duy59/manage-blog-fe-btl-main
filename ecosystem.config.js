module.exports = {
    apps: [
      {
        name: 'manager-blog-fe',
        script: 'node_modules/next/dist/bin/next',
        args: 'start -p 2007',
        env: {
          NODE_ENV: 'production',
        },
      },
    ],
  };