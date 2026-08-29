import { reservationService } from "./reservation.service";
import { RESRVEATION_CONSTANTS } from "./reservation.constant";

let timer: NodeJS.Timeout | null = null;
let running = false;

/**
 * Runs one sweep, guarded so a slow sweep never overlaps the next tick
 */
async function runSweep(): Promise<void> {
  if (running) return;
  running = true;

  try {
    const expired = await reservationService.expireDueReservations();
    if (expired > 0) {
      console.log(`Expired ${expired} reservation(s), stock returned`);
    }
  } catch (err) {
    console.error(`Reservation expiry sweep failed: ${err}`);
  } finally {
    running = false;
  }
}

/**
 * Starts the sweep which are expired
 */
export function initiateReservationExpiredSweep(): void {
  if (timer) return;

  timer = setInterval(runSweep, RESRVEATION_CONSTANTS.EXPIRY_SWEEP_INTERVAL_MS);
  timer.unref();
}

/**
 * Stops the periodic sweep
 */
export function terminateReservationExpirySweep(): void {
  if (!timer) return;

  clearInterval(timer);
  timer = null;
}
