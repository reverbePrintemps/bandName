export const getThemeFromLocalStorage = () => {
  const storedTheme = window.localStorage.getItem("theme");
  return storedTheme ?? "light";
};

export const updateLocalStorage = (key: string, value: string) => {
  window.localStorage.setItem(key, value);
};
