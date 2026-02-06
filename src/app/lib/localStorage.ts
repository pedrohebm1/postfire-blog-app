export function saveStorage(key: string, value: any): void {
  if (!key) {
    throw new Error("Key is required");
  }
  localStorage.setItem(key, JSON.stringify(value));
}

export function getStorage(key: string): any {
  if (!key) {
    throw new Error("Key is required");
  }
  const item = localStorage.getItem(key);
  try {
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error parsing JSON from sessionStorage", error);
    return null;
  }
}
