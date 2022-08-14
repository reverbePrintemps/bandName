import { updateLocalStorage } from "./storage";

export const updateTheme = (body: HTMLElement, theme: string) => {
  updateLocalStorage("theme", theme);
  switch (theme) {
    case "light":
    default:
      body.style.setProperty("--app-bg", "#ddd");
      body.style.setProperty("--card-bg", "#eef0f1");
      body.style.setProperty("--ui", "#181818");
      body.style.setProperty("--main-text", "#181818");
      body.style.setProperty("--secondary-text", "#888");
      body.style.setProperty("--warning-bg", "#df3b3b");
      body.style.setProperty("--warning-bg-hover", "#b01b1b");
      body.style.setProperty("--button-bg", "#181818");
      body.style.setProperty("--button-bg-hover", "#888");
      body.style.setProperty("--button-text", "#eef0f1");
      body.style.setProperty("--cardbutton-bg", "#ddd");
      break;
    case "dark":
      body.style.setProperty("--app-bg", "#222");
      body.style.setProperty("--card-bg", "#181818");
      body.style.setProperty("--ui", "#999");
      body.style.setProperty("--main-text", "#ccc");
      body.style.setProperty("--secondary-text", "#999");
      body.style.setProperty("--warning-bg", "#df3b3b");
      body.style.setProperty("--warning-bg-hover", "#b01b1b");
      body.style.setProperty("--button-bg", "#ddd");
      body.style.setProperty("--button-bg-hover", "#888");
      body.style.setProperty("--button-text", "#000");
      body.style.setProperty("--cardbutton-bg", "#222");
      break;
  }
};
