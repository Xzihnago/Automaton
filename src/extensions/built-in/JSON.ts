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
  await mkdir(path.replace(/\\/g, "/").replace(/\/[^/]*$/, ""), {
    recursive: true,
  });
};

JSON.read = async <T = unknown>(path: string) => {
  await touch(path);
  return readFile(path, { encoding: "utf8" })
    .then((raw) => JSON.parse(raw) as T)
    .catch((error: unknown) => {
      if (isErrnoException(error)) return undefined;
      throw error;
    });
};

JSON.write = async (path, data, format) => {
  await touch(path);
  await writeFile(path, JSON.stringify(data, null, format ? 2 : undefined), {
    encoding: "utf8",
  });
};
