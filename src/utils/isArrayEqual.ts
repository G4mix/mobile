export const isArrayEqual = <T>(a: T[], b: T[]): boolean => {
  if (a.length !== b.length) {
    return false;
  }

  return a.every((element, index) => element === b[index]);
};
