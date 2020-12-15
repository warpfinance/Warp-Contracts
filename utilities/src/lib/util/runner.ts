export const runMethodSafe = async (func: Function) => {
  try {
    await func();
  } catch (e) {
    console.error('encountered an error');
    console.error(e);
  }
};
