import tsconfigPaths from "vite-tsconfig-paths"
import { defineConfig } from "vite"
import fs from "fs"
import { VitePluginNode } from "vite-plugin-node"

const bufferLoader = {
  name: "buffer",
  transform(code: string, id: string) {
    const [path, query] = id.split("?")

    if (query != "buffer") {
      return null
    }

    const data = fs.readFileSync(path)
    const base64 = data.toString("base64")

    return `export default Buffer.from('${base64}', 'base64');`
  },
}

export default defineConfig({
  server: {
    port: process.env.APP_LISTEN ? Number(process.env.APP_LISTEN) : 8000,
    host: "0.0.0.0",
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:3000",
    //     changeOrigin: true,
    //   },
    // },
    
  },
  root: "./",
  build: {
    rollupOptions: {
      external: [/^@shopify\/shopify-api\/.*$/],
    },
  },
  plugins: [
    // support for paths from tsconfig.json
    tsconfigPaths(),
    ...VitePluginNode({
      // Nodejs native Request adapter
      // currently this plugin support 'express', 'nest', 'koa' and 'fastify' out of box,
      adapter: "express",
      // tell the plugin where is your project entry
      appPath: "./src/index.ts",
      // the name of named export of you app from the appPath file
      exportName: "app",
      tsCompiler: "esbuild",
      swcOptions: {},
    }),
    bufferLoader,
  ],

  optimizeDeps: {
    disabled: true,
  },
})
