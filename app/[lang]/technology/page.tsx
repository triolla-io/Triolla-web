import { TechnologyClient } from "../../technology/TechnologyClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/technology",
  i18n: LANG_REDIRECT_PAGE_COPY["/technology"],
  Client: TechnologyClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
