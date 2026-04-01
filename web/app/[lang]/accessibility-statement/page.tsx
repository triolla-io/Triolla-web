import { AccessibilityStatementClient } from "../../accessibility-statement/AccessibilityStatementClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/accessibility-statement",
  i18n: LANG_REDIRECT_PAGE_COPY["/accessibility-statement"],
  Client: AccessibilityStatementClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
