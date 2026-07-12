export const simulateDelay = (ms = 400) =>
  new Promise((resolve) => setTimeout(resolve, ms));
