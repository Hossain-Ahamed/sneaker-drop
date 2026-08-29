// reservation constant
export const RESRVEATION_CONSTANTS ={
    RESERVATION_TTL_MS :60_000,
    /** how often the expiry sweep runs */
    EXPIRY_SWEEP_INTERVAL_MS :5_000,
    /** most reservations expired in a single sweep */
    EXPIRY_SWEEP_BATCH_SIZE :100,
}