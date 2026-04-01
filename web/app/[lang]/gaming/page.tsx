import { GamingClient } from "../../gaming/GamingClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/gaming",
  i18n: LANG_REDIRECT_PAGE_COPY["/gaming"],
  Client: GamingClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
