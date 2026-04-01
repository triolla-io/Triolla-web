import { PrivacyPolicyClient } from "../../privacy-policy/PrivacyPolicyClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/privacy-policy",
  i18n: LANG_REDIRECT_PAGE_COPY["/privacy-policy"],
  Client: PrivacyPolicyClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
