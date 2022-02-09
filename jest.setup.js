import '@testing-library/jest-dom/extend-expect';

// https://github.com/vercel/next.js/issues/26749#issuecomment-885431747
jest.mock('next/image', () => ({
  __esModule: true,
  default: () => {
    return 'Next image stub'; // whatever
  },
}));
