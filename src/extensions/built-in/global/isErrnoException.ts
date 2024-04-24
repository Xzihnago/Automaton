const isErrnoException = (error: unknown): error is NodeJS.ErrnoException =>
  error instanceof Error && "errno" in error;

export default isErrnoException;
