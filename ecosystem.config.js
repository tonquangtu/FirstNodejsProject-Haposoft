module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [
    {
      name      : 'premium',
      script    : 'pm2 start bin/www',
      env: {
        COMMON_VARIABLE: 'true'
      },
      env_development : {
        NODE_ENV: 'development'
      }
    }
  ],

  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  deploy : {
    production : {
      user : 'hapo',
      host : '160.16.216.144',
      ref  : 'origin/develop',
      repo : 'git@github.com:chungth/premium-pilot.git',
      path : '/home/hapo/premium',
      'post-deploy' : 'npm install && npm run build && pm2 reload ecosystem.config.js --env production && pm2 restart all'
    },
    development : {
      user : 'hapo',
      host : '160.16.216.144',
      ref  : 'origin/develop',
      repo : 'git@github.com:chungth/premium-pilot.git',
      path : '/home/hapo/premium',
      'post-deploy' : 'npm install && npm run build && pm2 reload ecosystem.config.js --env development && pm2 restart all',
      env  : {
        NODE_ENV: 'development'
      }
    }
  }
};
