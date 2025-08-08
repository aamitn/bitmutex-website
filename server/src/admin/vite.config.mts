import { mergeConfig } from "vite";

export default (config) => {
  // Important: always return the modified config
  return mergeConfig(config, {
    server: {
      allowedHosts: ["strapiadmin.bitmutex.com"],
     // allowedHosts: true //[to allow all]
  },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  });
};