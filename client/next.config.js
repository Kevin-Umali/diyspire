/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["images.unsplash.com", "via.placeholder.com"],
  },
  redirects: async () => {
    return process.env.NEXT_PUBLIC_SHOW_MAINTENANCE === "true"
      ? [
          {
            source: "/((?!maintenance|status).*)",
            destination: "/maintenance",
            permanent: false,
          },
        ]
      : [
          {
            source: "/maintenance",
            destination: "/",
            permanent: false,
          },
        ];
  },
};

module.exports = nextConfig;
