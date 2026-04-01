import { ServicesClient } from "../../services/ServicesClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/services",
  i18n: LANG_REDIRECT_PAGE_COPY["/services"],
  Client: ServicesClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
