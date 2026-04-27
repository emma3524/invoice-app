import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

 const [invoices, setInvoices] = useState(() => {
  const saved = localStorage.getItem('invoices')
  return saved ? JSON.parse(saved) : [
    { id: '#INV-001', dueDate: '15 May 2026', client: 'Emma Thompson', amount: 2500.00, status: 'paid' },
    { id: '#INV-002', dueDate: '22 Jun 2026', client: 'Michael Chen', amount: 8750.50, status: 'pending' },
    { id: '#INV-003', dueDate: '03 Jul 2026', client: 'Sarah Williams', amount: 320.75, status: 'draft' },
    { id: '#INV-004', dueDate: '18 Aug 2026', client: 'David Okafor', amount: 12450.00, status: 'paid' },
    { id: '#INV-005', dueDate: '05 Sep 2026', client: 'Priya Kapoor', amount: 680.25, status: 'pending' },
    { id: '#INV-006', dueDate: '12 Oct 2026', client: 'James Wilson', amount: 5200.00, status: 'draft' },
    { id: '#INV-007', dueDate: '25 Nov 2026', client: 'Amara Eze', amount: 18990.99, status: 'paid' },
    { id: '#INV-008', dueDate: '08 Dec 2026', client: 'Lucas Martin', amount: 445.50, status: 'pending' },
    { id: '#INV-009', dueDate: '14 Jan 2027', client: 'Isabella Rosa', amount: 6700.00, status: 'paid' },
    { id: '#INV-010', dueDate: '20 Feb 2027', client: 'Oluwaseun Adebayo', amount: 1230.75, status: 'draft' },
  ]
})
  const [showForm, setShowForm] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [newInvoice, setNewInvoice] = useState({
    client: '',
    amount: '',
    dueDate: ''
  })

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('invoices', JSON.stringify(invoices))
  }, [invoices])

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode)
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  const getStatusColor = (status) => {
    switch(status) {
      case 'paid': return 'status-paid'
      case 'pending': return 'status-pending'
      case 'draft': return 'status-draft'
      default: return ''
    }
  }

  const handleAddInvoice = () => {
    if (!newInvoice.client || !newInvoice.amount || !newInvoice.dueDate) {
      alert('Please fill all fields')
      return
    }
    
    const newId = `#INV_${Date.now()}`
    setInvoices([
      ...invoices,
      {
        id: newId,
        client: newInvoice.client,
        amount: parseFloat(newInvoice.amount),
        dueDate: newInvoice.dueDate,
        status: 'pending'
      }
    ])
    setNewInvoice({ client: '', amount: '', dueDate: '' })
    setShowForm(false)
  }

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice)
    setNewInvoice({
      client: invoice.client,
      amount: invoice.amount,
      dueDate: invoice.dueDate
    })
    setShowForm(true)
  }

  const handleUpdateInvoice = () => {
    if (!newInvoice.client || !newInvoice.amount || !newInvoice.dueDate) {
      alert('Please fill all fields')
      return
    }
    
    setInvoices(invoices.map(inv => 
      inv.id === editingInvoice.id 
        ? { ...inv, client: newInvoice.client, amount: parseFloat(newInvoice.amount), dueDate: newInvoice.dueDate }
        : inv
    ))
    setNewInvoice({ client: '', amount: '', dueDate: '' })
    setEditingInvoice(null)
    setShowForm(false)
  }

  const handleDeleteInvoice = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(inv => inv.id !== id))
    }
  }

  const handleStatusChange = (id, newStatus) => {
    setInvoices(invoices.map(inv => 
      inv.id === id ? { ...inv, status: newStatus } : inv
    ))
  }

  const filteredInvoices = invoices
    .filter(inv => filterStatus === 'all' || inv.status === filterStatus)
    .filter(inv => inv.client.toLowerCase().includes(searchTerm.toLowerCase()) || inv.id.toLowerCase().includes(searchTerm.toLowerCase()))

  const stats = {
    total: filteredInvoices.length,
    totalAmount: filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0),
    pending: filteredInvoices.filter(i => i.status === 'pending').length,
    paid: filteredInvoices.filter(i => i.status === 'paid').length
  }

  return (
    <div className={`app-container ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon">📄</div>
          <h2>InvoiceApp</h2>
        </div>
        
        <nav className="nav-menu">
          <a href="#" className="nav-item active">📊 Dashboard</a>
          <a href="#" className="nav-item">📋 Invoices</a>
          <a href="#" className="nav-item">👥 Clients</a>
          <a href="#" className="nav-item">⚙️ Settings</a>
        </nav>

        <div className="sidebar-footer">
          <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div>
            <h1>Invoices</h1>
            <p className="subtitle">There are {stats.total} total invoices</p>
          </div>
          <button className="btn-primary" onClick={() => {
            setEditingInvoice(null)
            setNewInvoice({ client: '', amount: '', dueDate: '' })
            setShowForm(true)
          }}>
            + New Invoice
          </button>
        </div>

        {/* Filters */}
        <div className="filters-bar">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search by client or invoice ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="status-filters">
            <button className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`} onClick={() => setFilterStatus('all')}>
              All ({invoices.length})
            </button>
            <button className={`filter-btn ${filterStatus === 'paid' ? 'active' : ''}`} onClick={() => setFilterStatus('paid')}>
              Paid ({invoices.filter(i => i.status === 'paid').length})
            </button>
            <button className={`filter-btn ${filterStatus === 'pending' ? 'active' : ''}`} onClick={() => setFilterStatus('pending')}>
              Pending ({invoices.filter(i => i.status === 'pending').length})
            </button>
            <button className={`filter-btn ${filterStatus === 'draft' ? 'active' : ''}`} onClick={() => setFilterStatus('draft')}>
              Draft ({invoices.filter(i => i.status === 'draft').length})
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Invoices</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              £{stats.totalAmount.toLocaleString()}
            </div>
            <div className="stat-label">Total Amount</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{stats.paid}</div>
            <div className="stat-label">Paid</div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="invoice-table-container">
          <div className="table-header">
            <div className="col-id">Invoice ID</div>
            <div className="col-due">Due Date</div>
            <div className="col-client">Client Name</div>
            <div className="col-amount">Amount</div>
            <div className="col-status">Status</div>
            <div className="col-actions">Actions</div>
          </div>
          
          <div className="table-body">
            {filteredInvoices.length === 0 ? (
              <div className="empty-state">
                <p>No invoices found</p>
              </div>
            ) : (
              filteredInvoices.map((invoice) => (
                <div className="invoice-row" key={invoice.id}>
                  <div className="col-id">{invoice.id}</div>
                  <div className="col-due">Due {invoice.dueDate}</div>
                  <div className="col-client">{invoice.client}</div>
                  <div className="col-amount">£{invoice.amount.toLocaleString()}</div>
                  <div className="col-status">
                    <select 
                      className={`status-select ${getStatusColor(invoice.status)}`}
                      value={invoice.status}
                      onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                    >
                      <option value="paid">Paid</option>
                      <option value="pending">Pending</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                  <div className="col-actions">
                    <button className="action-btn edit" onClick={() => handleEditInvoice(invoice)}>✏️</button>
                    <button className="action-btn delete" onClick={() => handleDeleteInvoice(invoice.id)}>🗑️</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Invoice Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => {
          setShowForm(false)
          setEditingInvoice(null)
          setNewInvoice({ client: '', amount: '', dueDate: '' })
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}</h2>
            <div className="form-group">
              <label>Client Name</label>
              <input
                type="text"
                placeholder="Enter client name"
                value={newInvoice.client}
                onChange={(e) => setNewInvoice({...newInvoice, client: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Amount (£)</label>
              <input
                type="number"
                placeholder="Enter amount"
                value={newInvoice.amount}
                onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
              />
            </div>
            <div className="form-group">
              <label>Due Date</label>
              <input
                type="date"
                value={newInvoice.dueDate}
                onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
              />
            </div>
            <div className="modal-buttons">
              <button className="btn-secondary" onClick={() => {
                setShowForm(false)
                setEditingInvoice(null)
                setNewInvoice({ client: '', amount: '', dueDate: '' })
              }}>Cancel</button>
              <button className="btn-primary" onClick={editingInvoice ? handleUpdateInvoice : handleAddInvoice}>
                {editingInvoice ? 'Update Invoice' : 'Create Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App