import { StartupsTechClient } from "../../startups-tech/StartupsTechClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/startups-tech",
  i18n: LANG_REDIRECT_PAGE_COPY["/startups-tech"],
  Client: StartupsTechClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
