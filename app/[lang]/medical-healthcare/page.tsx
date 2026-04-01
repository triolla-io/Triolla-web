import { MedicalHealthcareClient } from "../../medical-healthcare/MedicalHealthcareClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/medical-healthcare",
  i18n: LANG_REDIRECT_PAGE_COPY["/medical-healthcare"],
  Client: MedicalHealthcareClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
