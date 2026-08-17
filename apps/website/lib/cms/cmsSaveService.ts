/**
 * Production-Grade CMS Save Service
 * Handles:
 * - Race Condition & Conflict Prevention (AbortController + sequence counter)
 * - Automatic Retries on Failure
 * - Real-time BroadcastChannel Sync (Cross-tab & Admin/Website sync)
 * - Bi-directional postMessage dispatch
 */

export interface CMSBlockSavePayload {
  key: string;
  content: string;
  category?: string;
  label?: string;
  type?: string;
  isPublished?: boolean;
  updatedBy?: string;
}

export interface SaveResult {
  success: boolean;
  block?: any;
  error?: string;
  sequence: number;
}

class CMSSaveService {
  private activeAbortControllers = new Map<string, AbortController>();
  private lastSavedContent = new Map<string, string>();
  private sequenceCounter = 0;
  private broadcastChannel: BroadcastChannel | null = null;

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        this.broadcastChannel = new BroadcastChannel("dragon_cms_live_sync");
      } catch (e) {
        console.warn("BroadcastChannel initialization warning:", e);
      }
    }
  }

  /**
   * Broadcast updated content to all listening tabs/frames in real-time
   */
  public broadcastUpdate(key: string, content: string, status: "typing" | "saved" | "saving") {
    if (typeof window === "undefined") return;

    const payload = {
      type: "DRAGON_CMS_REALTIME_SYNC",
      key,
      content,
      status,
      timestamp: Date.now(),
    };

    // 1. Cross-tab BroadcastChannel
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(payload);
      } catch (e) {
        // Ignore broadcast error
      }
    }

    // 2. Parent / Child Frame postMessage
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(payload, "*");
      }
    } catch (e) {
      // Ignore frame error
    }
  }

  /**
   * Save CMS block with AbortController, sequence check, and retries
   */
  public async saveBlock(payload: CMSBlockSavePayload, maxRetries = 3): Promise<SaveResult> {
    const { key, content } = payload;
    const currentSequence = ++this.sequenceCounter;

    // 1. Prevent duplicate saves if content hasn't changed from last saved
    if (this.lastSavedContent.get(key) === content) {
      return { success: true, sequence: currentSequence };
    }

    // 2. Abort previous pending save for this key (Conflict Prevention: Latest Edit Wins)
    if (this.activeAbortControllers.has(key)) {
      const controller = this.activeAbortControllers.get(key);
      controller?.abort();
      this.activeAbortControllers.delete(key);
    }

    const abortController = new AbortController();
    this.activeAbortControllers.set(key, abortController);

    let attempt = 0;
    let lastError = "Save failed";

    while (attempt < maxRetries) {
      attempt++;
      try {
        // Try website API or admin API fallback
        const primaryUrl = "/api/cms/blocks";
        const secondaryUrl = "/api/admin/content";

        let response = await fetch(primaryUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          signal: abortController.signal,
        }).catch(() => null);

        if (!response || !response.ok) {
          response = await fetch(secondaryUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "save", ...payload }),
            signal: abortController.signal,
          }).catch(() => null);
        }

        if (abortController.signal.aborted) {
          return { success: false, error: "Aborted by newer edit", sequence: currentSequence };
        }

        if (response && response.ok) {
          const data = await response.json();
          if (data.success) {
            this.lastSavedContent.set(key, content);
            this.activeAbortControllers.delete(key);

            // Broadcast success across monorepo
            this.broadcastUpdate(key, content, "saved");

            return {
              success: true,
              block: data.block,
              sequence: currentSequence,
            };
          } else {
            lastError = data.error || "Save rejected by server";
          }
        } else {
          lastError = `HTTP ${response?.status || "Network Error"}`;
        }
      } catch (err: any) {
        if (err.name === "AbortError") {
          return { success: false, error: "Aborted by newer edit", sequence: currentSequence };
        }
        lastError = err.message || "Network transmission failure";
      }

      // Retry delay (exponential backoff: 300ms, 600ms)
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 300));
      }
    }

    this.activeAbortControllers.delete(key);
    return { success: false, error: lastError, sequence: currentSequence };
  }

  public getBroadcastChannel() {
    return this.broadcastChannel;
  }
}

export const cmsSaveService = new CMSSaveService();
