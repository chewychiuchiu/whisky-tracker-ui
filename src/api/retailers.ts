import {apiFetch} from './client'
import type { Retailer } from '../types'

export const getRetailers = () =>
    apiFetch<Retailer[]>('/retailers')

export const getRetailer = (id: number) =>
    apiFetch<Retailer>(`/retailers/${id}`)

export const createRetailer = (data: Omit<Retailer, 'id'>) =>
    apiFetch<Retailer>('/retailers', {
        method: 'POST',
        body: JSON.stringify(data),
    })

export const updateRetailer = (id: number, data: Partial<Retailer>) =>
    apiFetch<Retailer>(`/retailers/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    })

export const deleteRetailer = (id: number) =>
    apiFetch<{ message: string }>(`/reatilers/${id}`, {
        method: 'DELETE',
    })

