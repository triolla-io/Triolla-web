import { B2cClient } from "../../b2c/B2cClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/b2c",
  i18n: LANG_REDIRECT_PAGE_COPY["/b2c"],
  Client: B2cClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
