export const getAbsoluteURL = (path: string): string => {
  const baseURL = process.env.NEXT_PUBLIC_URL
    ? `https://${process.env.NEXT_PUBLIC_URL}`
    : 'http://localhost:3000';

  return baseURL + path;
};
