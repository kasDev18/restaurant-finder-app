export const envConfig = <T extends NodeJS.ProcessEnv>() => {
  require("dotenv").config();

  const env: T = process.env as T;
  return env;
};
