export type {};
declare global {
  interface Promise<T> {
    timeout: (ms?: number) => Promise<T>;
  }
}

Promise.prototype.timeout = async function (ms) {
  let pid: NodeJS.Timeout | undefined;

  const timeout = new Promise((_, reject) => {
    pid = setTimeout(() => {
      reject(new Error(`Promise exceeded maximum execution time: ${ms} ms`));
    }, ms);
  });

  return Promise.race([this, timeout]).finally(() => {
    clearTimeout(pid);
  });
};
