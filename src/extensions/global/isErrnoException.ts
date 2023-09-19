const isErrnoException = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && "errno" in error && "code" in error;

export default isErrnoException;
