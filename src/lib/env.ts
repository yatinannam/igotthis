const requiredEnv = (name: string) => {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
};

export const sessionCookieName = "igotthis-session";

export const env = {
  authSecret: requiredEnv("AUTH_SECRET"),
};