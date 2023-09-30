export const generateCookie = (
  name: 'Refresh' | 'Authentication',
  token: string,
  expSec: string,
) => {
  const domain =
    process.env.NODE_ENV === 'development' ? 'localhost' : 'wdyw.io';

  return `${name}=${token}; Domain=${domain}; HttpOnly; Path=/; SameSite=None; Secure; Max-Age=${expSec}`;
};
