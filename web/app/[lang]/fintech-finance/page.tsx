import { FintechFinanceClient } from "../../fintech-finance/FintechFinanceClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/fintech-finance",
  i18n: LANG_REDIRECT_PAGE_COPY["/fintech-finance"],
  Client: FintechFinanceClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
