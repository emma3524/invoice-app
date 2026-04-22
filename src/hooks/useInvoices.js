import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'invoices_v1'

export const useInvoices = () => {
  const [invoices, setInvoices] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        setInvoices(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load invoices:', e)
      }
    }
  }, [])

  const save = useCallback((data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [])

  const addInvoice = useCallback((invoice) => {
    const newInvoice = {
      ...invoice,
      id: 'INV-' + Date.now(),
      createdAt: new Date().toISOString(),
      status: 'Draft'
    }
    const updated = [newInvoice, ...invoices]
    setInvoices(updated)
    save(updated)
    return newInvoice
  }, [invoices, save])

  const updateInvoice = useCallback((id, updates) => {
    const updated = invoices.map(inv => inv.id === id ? { ...inv, ...updates } : inv)
    setInvoices(updated)
    save(updated)
  }, [invoices, save])

  const deleteInvoice = useCallback((id) => {
    const updated = invoices.filter(inv => inv.id !== id)
    setInvoices(updated)
    save(updated)
  }, [invoices, save])

  const updateStatus = useCallback((id, status) => {
    updateInvoice(id, { status })
  }, [updateInvoice])

  return { invoices, addInvoice, updateInvoice, deleteInvoice, updateStatus }
}
