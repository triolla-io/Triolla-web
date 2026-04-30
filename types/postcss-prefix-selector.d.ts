declare module "postcss-prefix-selector" {
  import type { PluginCreator } from "postcss";

  interface Options {
    prefix: string;
    exclude?: Array<string | RegExp>;
    transform?: (
      prefix: string,
      selector: string,
      prefixedSelector: string,
      filePath: string,
      rule: unknown
    ) => string;
    ignoreFiles?: Array<string | RegExp>;
    includeFiles?: Array<string | RegExp>;
  }

  const plugin: PluginCreator<Options>;
  export default plugin;
}
