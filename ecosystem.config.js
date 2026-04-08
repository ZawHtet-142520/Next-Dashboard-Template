module.exports = {
  apps: [
    {
      name: "contact-us-mail",
      script: "npm",
      args: "run start",
      env_development: {
        NODE_ENV: "development",
        NEXT_PUBLIC_API_BASE_URL: "https://contact-us-mail-b.cbs.com.mm",
        PORT: 3014,
      },
      env_production: {
        NODE_ENV: "production",
        NEXT_PUBLIC_API_BASE_URL: "",
        PORT: 3002,
      },
      watch: false,
      max_memory_restart: "300M",
    },
  ],
};