import { defineConfig, presetIcons, presetWebFonts } from "unocss";
export default defineConfig({
  presets: [
    presetIcons({}),
    presetWebFonts({
      provider: "google",
      fonts: {
        sans: "DM Sans",
      },
    }),
  ],
});
