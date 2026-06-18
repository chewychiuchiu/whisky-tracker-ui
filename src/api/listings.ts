import {apiFetch} from './client'
import type { ProductListing } from '../types'

export const getListings = () =>
    apiFetch<ProductListing[]>('/listings')

export const getListing = (id: number) =>
    apiFetch<ProductListing>('/listings/${id}')

export const createListing = (data: Omit<ProductListing, 'id' | 'lastChecked'>) => 
    apiFetch<ProductListing>('/listings', {
        method: 'POST',
        body: JSON.stringify(data)
    })

export const deleteListing = (id: number) =>
    apiFetch<{ message: string}>(` /listings/${id}`, {
        method: 'DELETE',
    })