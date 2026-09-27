import type { NextConfig } from "next";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;

const nextConfig: NextConfig = {
  images: {
    // Las imágenes vienen del CDN de Sanity y las optimiza Vercel.
    // Plan Hobby: 5.000 transformaciones/mes. Cada combinación de
    // imagen × ancho × formato × calidad cuenta como una, así que se limitan
    // los anchos, se usa un solo formato y una sola calidad.
    remotePatterns: [new URL(`https://cdn.sanity.io/images/${projectId}/**`)],
    formats: ["image/webp"],
    qualities: [75],
    deviceSizes: [640, 1080, 1920, 2560],
    imageSizes: [384],
    // Las URLs de Sanity cambian si cambia la imagen, así que se puede
    // cachear mucho tiempo sin riesgo de servir una versión vieja.
    minimumCacheTTL: 2678400, // 31 días
  },
};

export default nextConfig;
