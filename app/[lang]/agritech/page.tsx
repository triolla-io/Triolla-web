import { AgritechClient } from "../../agritech/AgritechClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/agritech",
  i18n: LANG_REDIRECT_PAGE_COPY["/agritech"],
  Client: AgritechClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
