import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import serve from "rollup-plugin-serve";

const extensions = [".ts"];

export default {
  input: "./src/index.ts",
  output: {
    file: "./dist/lovelace-sun-card.js",
    format: "cjs"
  },
  plugins: [
    resolve({ extensions }),
    commonjs(),
    json(),
    babel({ extensions, include: ["src/**/*"], babelHelpers: "bundled" }),
    serve({
      contentBase: ["dev/", "dist/"],
      host: "0.0.0.0",
      port: 5000,
      allowCrossOrigin: true,
      headers: {
        "Access-Control-Allow-Origin": "*"
      }
    })
  ]
};
