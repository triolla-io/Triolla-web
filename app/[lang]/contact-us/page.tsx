import { ContactUsClient } from "../../contact-us/ContactUsClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/contact-us",
  i18n: LANG_REDIRECT_PAGE_COPY["/contact-us"],
  Client: ContactUsClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
