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

export function updateQueryParams(param, value) {
  const url = new URL(window.location.href);
  if (value) {
    url.searchParams.set(param, value);
  } else {
    url.searchParams.delete(param);
  }
  // This will modify the URL without reloading the page
  window.history.pushState({}, "", url);
}
