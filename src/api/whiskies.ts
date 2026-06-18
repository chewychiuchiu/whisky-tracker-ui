import {apiFetch} from './client'
import type {Whisky} from '../types'
import type { WhiskyPriceData } from '../types'

export const getWhiskies = () =>
    apiFetch<Whisky[]>('/whiskies')

export const getWhisky = (id: number) =>
    apiFetch<Whisky>(`/whiskies/${id}`)

export const createWhisky = (data: Omit<Whisky, 'id' | 'createdAt'>) =>
    apiFetch<Whisky>('/whiskies', {
        method: 'POST',
        body: JSON.stringify(data),
    })

export const updateWhisky = (id: number, data: Partial<Whisky>) =>
    apiFetch<Whisky>(`/whiskies/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })

export const deleteWhisky = (id: number) =>
    apiFetch<{ message: string }>(`/whiskies/${id}`, {
        method: 'DELETE',
    })

export const getWhiskyPrices = (id: number) =>
  apiFetch<WhiskyPriceData>(`/whiskies/${id}/prices`)

export const scrapeWhiskyPrices = (id: number) =>
  apiFetch<{ message: string }>(`/scraper/scrape/${id}`, {
    method: 'POST',
  })

export const lookupBarcode = (upc: string) =>
  apiFetch<{ name: string; brand: string; description: string; imageUrl: string | null; upc: string }>(`/barcode/${upc}`)
  
