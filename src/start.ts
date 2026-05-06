import { createStart } from "@tanstack/react-start";

export const startInstance = createStart(() => ({
  // Netlify static hosting: render entirely on the client.
  defaultSsr: false,
}));
