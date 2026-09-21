/**
 * Decides when the Virtual Try-On mirror should start and abort its automatic
 * capture countdown, from a stream of per-frame "is framing ready" readings.
 *
 * Pure and time-injected (no React, no timers) so it can be tested against
 * exact frame sequences. The face detector is noisy: a single dropped frame
 * (motion blur, a GPU hiccup, a face right at a threshold) reads as "not
 * ready", and if every dropout restarted the hold timer, someone standing
 * perfectly still could wait indefinitely -- the "sometimes captures,
 * sometimes doesn't" behaviour.
 */

/** Framing must stay good this long before the countdown starts. */
export const READY_HOLD_MS = 800;
/** Detector dropouts shorter than this do not reset the hold. */
export const READY_GRACE_MS = 400;
/** Framing lost for this long during the countdown cancels it. */
export const COUNTDOWN_ABORT_MS = 1200;

export type AutoCaptureAction = "start" | "abort" | null;

export interface AutoCaptureTracker {
  update(ready: boolean, now: number, countingDown: boolean): AutoCaptureAction;
  reset(): void;
}

export function createAutoCaptureTracker(): AutoCaptureTracker {
  let readySince: number | null = null;
  let lastReadyAt = -Infinity;

  return {
    update(ready, now, countingDown) {
      if (ready) {
        lastReadyAt = now;
        if (readySince === null) readySince = now;
      }
      const notReadyFor = now - lastReadyAt;

      if (countingDown) {
        if (notReadyFor > COUNTDOWN_ABORT_MS) {
          readySince = null;
          return "abort";
        }
        return null;
      }

      if (!ready && notReadyFor > READY_GRACE_MS) readySince = null;

      // Only on a frame where framing is good right now -- the grace period
      // keeps the hold alive through a dropout, it must not fire during one.
      if (ready && readySince !== null && now - readySince >= READY_HOLD_MS) {
        readySince = null;
        return "start";
      }
      return null;
    },
    reset() {
      readySince = null;
      lastReadyAt = -Infinity;
    },
  };
}
