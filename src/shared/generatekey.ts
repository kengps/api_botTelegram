import crypto from 'crypto';

export const generateKey = async () => {
  const SECRET = process.env.SECRET_KEY;
  const key = crypto.randomBytes(32).toString('hex');
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(key)
    .digest('hex');
  const fullKey = `${key}.${signature}`;

  return fullKey;
};
