import { CyberSecurityClient } from "../../cyber-security/CyberSecurityClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/cyber-security",
  i18n: LANG_REDIRECT_PAGE_COPY["/cyber-security"],
  Client: CyberSecurityClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
