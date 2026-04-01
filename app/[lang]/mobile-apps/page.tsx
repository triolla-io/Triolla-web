import { MobileAppsClient } from "../../mobile-apps/MobileAppsClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/mobile-apps",
  i18n: LANG_REDIRECT_PAGE_COPY["/mobile-apps"],
  Client: MobileAppsClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
