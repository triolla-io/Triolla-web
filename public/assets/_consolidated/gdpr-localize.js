/* WordPress wp_localize_script stub for Moove GDPR Cookie Compliance plugin.
 * Normally injected as an inline <script> in the WP HTML before the plugin JS.
 * Provides a safe no-op config so the plugin initializes without errors. */
window.moove_frontend_gdpr_scripts =
  window.moove_frontend_gdpr_scripts ||
  (function () {
    var scriptsEmpty = JSON.stringify({
      cache: true,
      header: "",
      body: "",
      footer: "",
      thirdparty: { header: "", body: "", footer: "" },
      strict: { header: "", body: "", footer: "" },
      advanced: { header: "", body: "", footer: "" },
    });
    return {
      ajaxurl: "",
      post_id: "0",
      plugin_dir: "",
      show_icons: "all",
      is_page: "1",
      ajax_cookie_removal: "false",
      strict_init: "2",
      enabled_default: { strict: 1, third_party: 0, advanced: 0, performance: 0, preference: 0 },
      geo_location: "false",
      force_reload: "false",
      is_single: "",
      hide_save_btn: "false",
      current_user: "0",
      cookie_expiration: "365",
      script_delay: "2000",
      close_btn_action: "1",
      close_btn_rdr: "",
      scripts_defined: scriptsEmpty,
      gdpr_scor: "true",
      wp_lang: "_en",
      wp_consent_api: "false",
      gdpr_nonce: "",
    };
  })();
