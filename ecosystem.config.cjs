module.exports = {
  apps: [
    {
      name: 'auralang-ide',
      script: 'npx',
      args: 'wrangler pages dev dist --ip 0.0.0.0 --port 3000',
      cwd: '/home/user/webapp',
      env: {
        NODE_ENV: 'development',
        PORT: 3000
      },
      watch: false,
      instances: 1,
      exec_mode: 'fork',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/auralang-error.log',
      out_file: './logs/auralang-out.log',
      log_file: './logs/auralang-combined.log',
      merge_logs: true,
      max_memory_restart: '500M',
      restart_delay: 4000
    }
  ]
}