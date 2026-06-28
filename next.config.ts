import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import Icons from "unplugin-icons/webpack";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  webpack(config) {
    config.plugins.push(
      Icons({
        compiler: "jsx",
        autoInstall: true,
      })
    );
    return config;
  },
};

export default withNextIntl(nextConfig);
