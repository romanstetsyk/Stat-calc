import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Put this in tsconfig.json -> path, and if using eslint-plugin-import in
      // .eslintrc.cjs -> rules -> import/order -> pathGroups -> pattern
      "~": "/src",
    },
  },
});
