export const API_ENDPOINT =
  import.meta.env.VITE_APP_SCRIPT_URL ||
  'https://script.google.com/macros/s/AKfycbwQ68p78OrkbVzLWX9sfZN7k7bZ6Isjps3EI8HvFMwKrT9kjXs-s6Dk74SyOWNvU9CN/exec';

export const AUTO_REFRESH_MS = Number(import.meta.env.VITE_AUTO_REFRESH_MS || 15000);
