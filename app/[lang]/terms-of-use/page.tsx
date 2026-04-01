import { TermsOfUseClient } from "../../terms-of-use/TermsOfUseClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/terms-of-use",
  i18n: LANG_REDIRECT_PAGE_COPY["/terms-of-use"],
  Client: TermsOfUseClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
