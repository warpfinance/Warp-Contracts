export const runMethodSafe = async (func: () => void) => {
  try {
    await func();
  } catch (e) {
    console.error('encountered an error');
    console.error(e);
  }
};
