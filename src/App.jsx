import React, { useState } from 'react'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [expandedRow, setExpandedRow] = useState(null)
  const [invoices, setInvoices] = useState([
    { id: '#RT3080', dueDate: '19 Aug 2021', client: 'Emma Thompson', amount: 1800.90, status: 'paid' },
    { id: '#XM9141', dueDate: '20 Sep 2021', client: 'Michael Chen', amount: 556.00, status: 'pending' },
    { id: '#RG0314', dueDate: '01 Oct 2021', client: 'Sarah Williams', amount: 14002.33, status: 'paid' },
    { id: '#RT2080', dueDate: '12 Oct 2021', client: 'David Okafor', amount: 102.04, status: 'pending' },
    { id: '#AA1449', dueDate: '14 Oct 2021', client: 'Priya Kapoor', amount: 4032.33, status: 'pending' },
    { id: '#TY9141', dueDate: '31 Oct 2021', client: 'James Wilson', amount: 6155.91, status: 'pending' },
    { id: '#V2353', dueDate: '12 Nov 2021', client: 'Amara Eze', amount: 3102.04, status: 'draft' },
  ])

  const [formData, setFormData] = useState({
    client: '',
    amount: '',
    dueDate: '',
    status: 'pending'
  })

  const filteredInvoices = statusFilter === 'all' 
    ? invoices 
    : invoices.filter(inv => inv.status === statusFilter)

  const getStatusClass = (status) => {
    switch(status) {
      case 'paid': return 'status-paid'
      case 'pending': return 'status-pending'
      case 'draft': return 'status-draft'
      default: return ''
    }
  }

  const generateNewId = () => {
    const lastId = invoices[invoices.length - 1]?.id || '#INV-000'
    const num = parseInt(lastId.replace('#INV-', '')) || parseInt(lastId.replace('#', '')) || 0
    const newNum = num + 1
    return `#INV-${String(newNum).padStart(3, '0')}`
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.client || !formData.amount || !formData.dueDate) {
      alert('Please fill all fields')
      return
    }

    if (editingInvoice) {
      setInvoices(invoices.map(inv => 
        inv.id === editingInvoice.id 
          ? { 
              ...inv, 
              client: formData.client, 
              amount: parseFloat(formData.amount), 
              dueDate: formData.dueDate,
              status: formData.status
            }
          : inv
      ))
    } else {
      const newInvoice = {
        id: generateNewId(),
        client: formData.client,
        amount: parseFloat(formData.amount),
        dueDate: formData.dueDate,
        status: formData.status
      }
      setInvoices([...invoices, newInvoice])
    }
    
    resetModal()
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(inv => inv.id !== id))
      setExpandedRow(null)
    }
  }

  const handleEdit = (invoice) => {
    setEditingInvoice(invoice)
    setFormData({
      client: invoice.client,
      amount: invoice.amount,
      dueDate: invoice.dueDate,
      status: invoice.status
    })
    setShowModal(true)
    setExpandedRow(null)
  }

  const handleStatusChange = (id, newStatus) => {
    setInvoices(invoices.map(inv => 
      inv.id === id ? { ...inv, status: newStatus } : inv
    ))
  }

  const resetModal = () => {
    setShowModal(false)
    setEditingInvoice(null)
    setFormData({ client: '', amount: '', dueDate: '', status: 'pending' })
  }

  const toggleExpand = (id) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          <div className="logo-circle">
            <div className="logo-icon">📄</div>
          </div>
        </div>

        <div className="sidebar-spacer"></div>

        <div className="sidebar-footer">
          <button className="dark-mode-toggle-sidebar" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <div className="user-info">
            <img 
              src="https://i.pravatar.cc/150?img=7" 
              alt="User avatar"
              className="sidebar-avatar"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          {/* Header */}
          <div className="content-header">
            <h1>Invoices</h1>
            <p className="invoice-count">There are {filteredInvoices.length} total invoices</p>
          </div>

          {/* Filter and New Invoice */}
          <div className="filter-actions">
            <div></div>
            <div className="right-actions">
              <div className="filter-group">
                <label>Filter by status</label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="status-filter-select"
                >
                  <option value="all">All</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <button className="new-invoice-btn" onClick={() => setShowModal(true)}>
                + New Invoice
              </button>
            </div>
          </div>

          {/* Invoice List - No Headers */}
          <div className="invoice-list">
            {filteredInvoices.map((invoice) => (
              <div key={invoice.id} className="invoice-item">
                <div className="invoice-row-compact" onClick={() => toggleExpand(invoice.id)}>
                  <div className="invoice-info">
                    <div className="invoice-id-status">
                      <span className="invoice-id">{invoice.id}</span>
                      <span className={`status-badge-small ${getStatusClass(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </div>
                    <div className="invoice-details">
                      <span className="invoice-client">{invoice.client}</span>
                      <span className="invoice-amount">£{invoice.amount.toLocaleString()}</span>
                    </div>
                    <div className="invoice-date">
                      Due {invoice.dueDate}
                    </div>
                  </div>
                  <div className="invoice-expand-icon">
                    <span className={`expand-arrow ${expandedRow === invoice.id ? 'expanded' : ''}`}>
                      &gt;
                    </span>
                  </div>
                </div>
                
                {/* Expandable Actions Panel */}
                {expandedRow === invoice.id && (
                  <div className="invoice-actions-panel">
                    <div className="action-buttons">
                      <button className="action-edit" onClick={() => handleEdit(invoice)}>
                        ✏️ Edit
                      </button>
                      <button className="action-delete" onClick={() => handleDelete(invoice.id)}>
                        🗑️ Delete
                      </button>
                      <div className="status-update">
                        <label>Status:</label>
                        <select
                          value={invoice.status}
                          onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                        >
                          <option value="paid">Paid</option>
                          <option value="pending">Pending</option>
                          <option value="draft">Draft</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal - Add/Edit Invoice */}
      {showModal && (
        <div className="modal-overlay" onClick={resetModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Client Name</label>
                <input
                  type="text"
                  placeholder="Enter client name"
                  value={formData.client}
                  onChange={(e) => setFormData({...formData, client: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Amount (£)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="Enter amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Due Date</label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="modal-buttons">
                <button type="button" className="btn-secondary" onClick={resetModal}>Cancel</button>
                <button type="submit" className="btn-primary">
                  {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default App