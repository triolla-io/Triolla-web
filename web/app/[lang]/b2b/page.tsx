import { B2bClient } from "../../b2b/B2bClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/b2b",
  i18n: LANG_REDIRECT_PAGE_COPY["/b2b"],
  Client: B2bClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
