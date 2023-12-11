/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname:
          "elliott-janked-form-builder-s-publicbucket5c3dbab0-ack0zj6uubwi.s3.ap-southeast-1.amazonaws.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname:
          "prod-janked-form-builder-site-publicbucket5c3dbab0-34uuleu6rnzd.s3.ap-southeast-1.amazonaws.com",
        pathname: "**",
      },
    ],
  },

  /**
   * If you are using `appDir` then you must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;
