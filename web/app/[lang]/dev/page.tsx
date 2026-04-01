import { DevClient } from "../../dev/DevClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/dev",
  i18n: LANG_REDIRECT_PAGE_COPY["/dev"],
  Client: DevClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
