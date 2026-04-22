import { useState } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { useInvoices } from './hooks/useInvoices'
import Header from './components/Header'
import InvoiceList from './components/InvoiceList'
import InvoiceForm from './components/InvoiceForm'
import InvoiceDetail from './components/InvoiceDetail'
import './App.css'

function AppContent() {
  const { invoices, addInvoice, updateInvoice, deleteInvoice, updateStatus } = useInvoices()
  const [view, setView] = useState('list')
  const [selectedId, setSelectedId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState('All')

  const handleCreate = (formData) => {
    addInvoice(formData)
    setView('list')
  }

  const handleEdit = (id, formData) => {
    updateInvoice(id, formData)
    setEditingId(null)
    setView('detail')
  }

  const handleDelete = (id) => {
    if (confirm('Are you sure? This action cannot be undone.')) {
      deleteInvoice(id)
      setView('list')
    }
  }

  const filtered = filter === 'All' 
    ? invoices 
    : invoices.filter(inv => inv.status === filter)

  const selected = invoices.find(inv => inv.id === selectedId)

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        {view === 'list' && (
          <InvoiceList 
            invoices={filtered}
            onSelect={(id) => {
              setSelectedId(id)
              setView('detail')
            }}
            onCreate={() => {
              setEditingId(null)
              setView('create')
            }}
            filter={filter}
            onFilterChange={setFilter}
          />
        )}
        {view === 'detail' && selected && (
          <InvoiceDetail
            invoice={selected}
            onEdit={() => setEditingId(selected.id)}
            onDelete={() => handleDelete(selected.id)}
            onStatusChange={(status) => updateStatus(selected.id, status)}
            onBack={() => setView('list')}
          />
        )}
        {view === 'create' && (
          <InvoiceForm
            onSubmit={handleCreate}
            onCancel={() => setView('list')}
          />
        )}
        {view === 'edit' && editingId && selected && (
          <InvoiceForm
            initialData={selected}
            onSubmit={(data) => handleEdit(selected.id, data)}
            onCancel={() => {
              setEditingId(null)
              setView('detail')
            }}
            isEditing
          />
        )}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
