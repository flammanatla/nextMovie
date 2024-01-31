export function keyLowering(initialObject) {
  const mappedObject = Object.entries(initialObject).reduce(
    (finalObject, [key, value]) => {
      const mappedKey = key.slice(0, 1).toLowerCase() + key.slice(1);
      finalObject[mappedKey] = value;
      return finalObject;
    },
    {}
  );
  return mappedObject;
}
