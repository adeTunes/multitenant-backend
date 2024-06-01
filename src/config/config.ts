export default () => ({
  server: {
    port: process.env.PORT || 3000,
  },
  database: {
    connectionString: process.env.DB_CONNECTION_STRING,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY,
    vector: process.env.ENCRYPTION_VECTOR,
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
    appName: process.env.APP_NAME
  },
});
