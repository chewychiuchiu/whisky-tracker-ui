import { apiFetch } from "./client";
import type { PriceSnapshot } from "../types"

export const getSnapshots = (listingId: number) =>
    apiFetch<PriceSnapshot[]>(`/snpashots/listing/${listingId}`)

export const createSnapshot = (data: {listingId: number; price: number}) =>
    apiFetch<PriceSnapshot>('/snapshots', {
        method: 'POST',
        body: JSON.stringify(data),
    })

