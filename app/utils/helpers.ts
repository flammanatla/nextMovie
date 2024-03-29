import { lowercaseKeyObjectType } from "./types";

export function lowercaseKey<T extends object>(initialObject: T): T {
  const mappedObject = Object.entries(
    initialObject
  ).reduce<lowercaseKeyObjectType>((finalObject, [key, value]) => {
    const mappedKey = key.slice(0, 1).toLowerCase() + key.slice(1);
    finalObject[mappedKey] = value;
    return finalObject;
  }, {});
  return mappedObject as T;
}

export function updateQueryParams(param: string, value: string): void {
  const url = new URL(window.location.href);

  if (value) {
    url.searchParams.set(param, value);
  } else {
    url.searchParams.delete(param);
  }
  // This will modify the URL without reloading the page
  window.history.pushState({}, "", url);
}

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return { name: error.name, message: error.message };
  }
  if (typeof error === "object") {
    return JSON.stringify(error);
  }
  return String(error);
}
