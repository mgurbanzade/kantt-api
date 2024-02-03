export const generateCookie = (
  name: 'Refresh' | 'Authentication',
  token: string,
  expSec: string,
) => {
  const domain =
    process.env.NODE_ENV === 'development' ? 'localhost' : 'kantt.io';

  return `${name}=${token}; Domain=${domain}; HttpOnly; Path=/; SameSite=Strict; Secure; Max-Age=${expSec}`;
};
