const specialCompare = <T>(source: T, target: T): T | undefined => {
  if (source instanceof Object && target instanceof Object) {
    return (Object.keys(source) as (keyof typeof source)[])
        .every((key) => source[key] === target[key]) ?
        undefined : target;
  }
  return source === target ? undefined : target;
};

export default specialCompare;
