import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  /*
   * Нэг сүлжээнд байгаа өөр төхөөрөмжөөс (утас г.м) хандах.
   *
   * `host: true` — зөвхөн localhost биш, LAN IP дээр ч сонсоно
   * (`npm run dev` хаягаа «Network:» гэж хэвлэнэ).
   *
   * `/api`-г backend руу дамжуулна. Тиймээс `.env` дотор API-ийн хаягийг
   * харьцангуй (`/api/...`) өгнө: `localhost:3000` гэж бичвэл утсан дээр
   * тэр нь УТАС ӨӨРӨӨ болж хүрэхгүй. Мөн ижил origin тул backend-ийн
   * `CORS_ORIGINS`-д IP нэмэх шаардлагагүй.
   */
  server: {
    host: true,
    proxy: { "/api": "http://localhost:3000" },
  },
  preview: {
    host: true,
    proxy: { "/api": "http://localhost:3000" },
  },
});
