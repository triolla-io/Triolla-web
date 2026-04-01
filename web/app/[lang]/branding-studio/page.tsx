import { BrandingStudioClient } from "../../branding-studio/BrandingStudioClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/branding-studio",
  i18n: LANG_REDIRECT_PAGE_COPY["/branding-studio"],
  Client: BrandingStudioClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
