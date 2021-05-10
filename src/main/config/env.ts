export default {
  mongoUrl: process.env.MONGO_URL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 5050,
  jwt: process.env.JWT_SECRET || 'any_secret_jwt',
};
