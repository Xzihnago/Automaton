import { mkdir, readFile, writeFile } from "fs/promises";

declare global {
  interface JSON {
    open: <T = unknown>(path: string) => Promise<T | undefined>;
    save: <T = unknown>(path: string, data: T, format?: boolean) => Promise<void>;
  }
}

const touchDir = async (path: string) => {
  const dir = path.replace(/\\/g, "/").replace(/\/.*\..*$/, "");
  await mkdir(dir, { recursive: true });
};

JSON.open = async <T = unknown>(path: string) => {
  await touchDir(path);

  try {
    const raw = await readFile(path, { encoding: "utf8" });
    return JSON.parse(raw) as T;
  } catch (error) {
    if (!isErrnoException(error)) {
      throw error;
    }
  }
};

JSON.save = async (path, data, format) => {
  await touchDir(path);

  const res = format ? JSON.stringify(data, null, 2) : JSON.stringify(data);
  await writeFile(path, res, { encoding: "utf8" });
};
