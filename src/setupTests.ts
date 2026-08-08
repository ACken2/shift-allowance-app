import '@testing-library/jest-dom/vitest';

// HolidayAPI alerts on network failure during tests; stub to keep jsdom quiet.
window.alert = () => undefined;
