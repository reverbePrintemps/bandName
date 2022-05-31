export const updateTheme = (body: HTMLElement, theme: "light" | "dark") => {
  switch (theme) {
    case "light":
      body.style.setProperty("--app-bg", "#ddd");
      body.style.setProperty("--card-bg", "#eef0f1");
      body.style.setProperty("--ui-fixed", "#ccc");
      body.style.setProperty("--ui", "#181818");
      body.style.setProperty("--main-text", "#181818");
      body.style.setProperty("--secondary-text", "#0000008a");
      body.style.setProperty("--warning-bg", "#df3b3b");
      body.style.setProperty("--warning-bg-hover", "#b01b1b");
      body.style.setProperty("--warning-text", "#eef0f1");
      body.style.setProperty("--button-bg", "#181818");
      body.style.setProperty("--button-text", "#ccc");
      break;
    case "dark":
      body.style.setProperty("--app-bg", "#222");
      body.style.setProperty("--card-bg", "#181818");
      body.style.setProperty("--ui", "#999");
      body.style.setProperty("--main-text", "#ccc");
      body.style.setProperty("--secondary-text", "#999");
      body.style.setProperty("--warning-bg", "#df3b3b");
      body.style.setProperty("--warning-bg-hover", "#b01b1b");
      body.style.setProperty("--button-bg", "#666");
      break;
  }
};
