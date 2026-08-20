/**
 * DragonOS CMS Editor Safety Utilities
 * Provides safe iframe detection without triggering cross-origin SecurityErrors.
 */

export function isEditorEnvironment(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.location.search && window.location.search.includes("editor=true")) {
      return true;
    }
    return window.self !== window.top;
  } catch {
    // If accessing window.top threw SecurityError, it is 100% inside a cross-origin iframe
    return true;
  }
}
