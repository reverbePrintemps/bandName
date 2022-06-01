export const getFromLocalStorage = (theme: string): "light" | "dark" => {
  const storedTheme = window.localStorage.getItem(theme);
  return storedTheme === "light"
    ? "light"
    : storedTheme === "dark"
    ? "dark"
    : "light";
};

export const updateLocalStorage = (key: string, value: string) => {
  window.localStorage.setItem(key, value);
};
