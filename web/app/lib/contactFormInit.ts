/**
 * Reinitialize Gravity Forms after the contact template is injected
 * This is needed because the form is loaded via fetch + innerHTML
 */
export function reinitializeGravityForm() {
  // If Gravity Forms scripts are loaded, trigger re-initialization
  if (typeof window !== 'undefined' && (window as any).gform) {
    // Trigger Gravity Forms to reinit
    try {
      (window as any).gform.utils.trigger_event(
        (window as any).jQuery(document),
        'gform_post_render',
        [1, 1] // form_id and current_page
      );
    } catch (err) {
      console.warn('Gravity Forms not fully initialized yet');
    }
  }
}

/**
 * Initialize contact form validation and interactions
 */
export function initContactFormValidation() {
  // Add any custom validation or interaction handlers here
  if (typeof window !== 'undefined') {
    const form = document.getElementById('gform_1');
    if (form) {
      // Form is now available in the DOM
      // Gravity Forms will handle its own validation
      // Additional custom handlers can be added here if needed
    }
  }
}

/**
 * Update form's hidden page URL field dynamically
 * This should be called with the current page URL
 */
export function updateFormPageUrl(pageUrl: string) {
  if (typeof document !== 'undefined') {
    const pageUrlField = document.getElementById('input_1_5') as HTMLInputElement;
    if (pageUrlField) {
      pageUrlField.value = pageUrl;
    }
  }
}
