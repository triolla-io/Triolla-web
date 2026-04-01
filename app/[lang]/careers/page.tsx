import { CareersClient } from "../../careers/CareersClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/careers",
  i18n: LANG_REDIRECT_PAGE_COPY["/careers"],
  Client: CareersClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
