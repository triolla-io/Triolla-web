import { SaasPlatformsClient } from "../../saas-platforms/SaasPlatformsClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/saas-platforms",
  i18n: LANG_REDIRECT_PAGE_COPY["/saas-platforms"],
  Client: SaasPlatformsClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
