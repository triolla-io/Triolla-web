import { ServiceDetailClient } from "../../service-detail/ServiceDetailClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/service-detail",
  i18n: LANG_REDIRECT_PAGE_COPY["/service-detail"],
  Client: ServiceDetailClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
