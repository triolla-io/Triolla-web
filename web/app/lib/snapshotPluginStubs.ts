/**
 * WordPress plugin bundles (GDPR Cookie Compliance, Gravity Forms theme) expect
 * inline globals from the original <head>. Those scripts are not in the body
 * fragment, so define safe placeholders before loading external plugin JS.
 */
const GDPR_SCRIPTS_DEFINED =
  '{"cache":true,"header":"","body":"","footer":"","thirdparty":{"header":"","body":"","footer":""},"strict":{"header":"","body":"","footer":""},"advanced":{"header":"","body":"","footer":""}}';

const MOOVE_FRONTEND_GDPR_DEFAULTS: Record<string, unknown> = {
  ajaxurl: "/",
  post_id: "",
  plugin_dir: "/",
  show_icons: "all",
  is_page: "1",
  ajax_cookie_removal: "false",
  strict_init: "2",
  enabled_default: {
    strict: 1,
    third_party: 0,
    advanced: 0,
    performance: 0,
    preference: 0,
  },
  geo_location: "false",
  force_reload: "false",
  is_single: "",
  hide_save_btn: "false",
  current_user: "0",
  cookie_expiration: "365",
  script_delay: "2000",
  close_btn_action: "1",
  close_btn_rdr: "",
  scripts_defined: GDPR_SCRIPTS_DEFINED,
  gdpr_scor: "true",
  wp_lang: "_en",
  wp_consent_api: "false",
  gdpr_nonce: "",
};

export function installSnapshotPluginStubs(): void {
  const w = window as unknown as Record<string, unknown>;

  /** Bodhi SVG inline plugin (theme); snapshot omits head inline vars. */
  if (typeof w.ForceInlineSVGActive === "undefined") {
    w.ForceInlineSVGActive = "false";
  }
  if (typeof w.svgSettings === "undefined") {
    w.svgSettings = { skipNested: true };
  }
  if (typeof w.cssTarget === "undefined") {
    w.cssTarget = { ForceInlineSVG: "force-inline-svg", Bodhi: "style-svg" };
  }
  if (typeof w.frontSanitizationEnabled === "undefined") {
    w.frontSanitizationEnabled = "off";
  }

  /**
   * GDPR main.js does `d.thirdparty.header` without guarding `d.thirdparty`.
   * A parsed `scripts_defined` of `{}` crashes; always merge defaults and force shape.
   */
  const prevRaw = w.moove_frontend_gdpr_scripts;
  const prev =
    typeof prevRaw === "object" && prevRaw !== null && !Array.isArray(prevRaw)
      ? (prevRaw as Record<string, unknown>)
      : {};
  w.moove_frontend_gdpr_scripts = {
    ...MOOVE_FRONTEND_GDPR_DEFAULTS,
    ...prev,
    scripts_defined: GDPR_SCRIPTS_DEFINED,
  };

  if (typeof w.gform_theme_config === "undefined") {
    w.gform_theme_config = {
      common: {
        form: {
          honeypot: { version_hash: "" },
          ajax: {
            ajaxurl: "/",
            ajax_submission_nonce: "",
            i18n: {
              step_announcement: "Step %1$s of %2$s, %3$s",
              unknown_error: "There was an unknown error processing your request. Please try again.",
            },
          },
        },
      },
      hmr_dev: "",
      public_path: "/",
      config_nonce: "",
    };
  }
}
