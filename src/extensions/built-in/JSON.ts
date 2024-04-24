import { mkdir, readFile, writeFile } from "fs/promises";

declare global {
  interface JSON {
    read: <T = unknown>(path: string) => Promise<T | undefined>;
    write: <T = unknown>(
      path: string,
      data: T,
      format?: boolean,
    ) => Promise<void>;
  }
}

const touch = async (path: string) => {
  const dir = path.replace(/\\/g, "/").replace(/\/[^/]*$/, "");
  await mkdir(dir, { recursive: true });
};

JSON.read = async <T = unknown>(path: string) => {
  await touch(path);

  try {
    const raw = await readFile(path, { encoding: "utf8" });
    return JSON.parse(raw) as T;
  } catch (error) {
    if (!isErrnoException(error)) {
      throw error;
    }
  }
};

JSON.write = async (path, data, format) => {
  await touch(path);

  const res = JSON.stringify(data, null, format ? 2 : undefined);
  await writeFile(path, res, { encoding: "utf8" });
};
