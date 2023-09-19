type DeepFreeze<T> = {
  readonly [P in keyof T]: undefined extends T[P] ? DeepFreeze<T[P]> | undefined : DeepFreeze<T[P]>;
};

const deepFreeze = <T>(obj: T): DeepFreeze<T> => {
  Object.getOwnPropertyNames(obj).forEach((name) => {
    const prop = (obj as never)[name];

    if (typeof prop === "object") {
      deepFreeze(prop);
    }
  });

  return Object.freeze(obj);
};

export default deepFreeze;
