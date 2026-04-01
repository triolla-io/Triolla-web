import { DeviceIotClient } from "../../device-iot/DeviceIotClient";
import { defineRedirectLangPage } from "../../lib/defineRedirectLangPage";
import { LANG_REDIRECT_PAGE_COPY } from "../../lib/langRedirectPageCopy";

const pageDef = defineRedirectLangPage({
  canonicalPath: "/device-iot",
  i18n: LANG_REDIRECT_PAGE_COPY["/device-iot"],
  Client: DeviceIotClient,
});

export const generateMetadata = pageDef.generateMetadata;
export default pageDef.Page;
