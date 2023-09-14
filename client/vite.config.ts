import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
  },
  // build: {
  //   rollupOptions: {
  //     output: {
  //       manualChunks: {
  //         vendor: ["react", "react-dom", "@chakra-ui/icons", "@chakra-ui/react", "@emotion/react", "@emotion/styled", "framer-motion", "react-router-dom", "react-icons"],
  //       },
  //     },
  //   },
  //   chunkSizeWarningLimit: 700, // Adjust this value based on your needs
  // },
});
