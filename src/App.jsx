import React, { useState } from 'react'
import './App.css'

function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [invoices, setInvoices] = useState([
    { id: '#RT3080', dueDate: '19 Aug 2021', client: 'Emma Thompson', amount: 1800.90, status: 'paid' },
    { id: '#XM9141', dueDate: '20 Sep 2021', client: 'Michael Chen', amount: 556.00, status: 'pending' },
    { id: '#RG0314', dueDate: '01 Oct 2021', client: 'Sarah Williams', amount: 14002.33, status: 'paid' },
    { id: '#RT2080', dueDate: '12 Oct 2021', client: 'David Okafor', amount: 102.04, status: 'pending' },
    { id: '#AA1449', dueDate: '14 Oct 2021', client: 'Priya Kapoor', amount: 4032.33, status: 'pending' },
    { id: '#TY9141', dueDate: '31 Oct 2021', client: 'James Wilson', amount: 6155.91, status: 'pending' },
    { id: '#V2353', dueDate: '12 Nov 2021', client: 'Amara Eze', amount: 3102.04, status: 'draft' },
  ])

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

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <div className="container">
        {/* Header with Logo and User */}
        <div className="header">
          <div className="logo">
            <div className="logo-icon">📄</div>
          </div>
          <div className="header-right">
            <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? '☀️' : '🌙'}
            </button>
            <div className="user-avatar">
              <img 
                src="https://i.pravatar.cc/150?img=7" 
                alt="User avatar"
                className="avatar-img"
              />
              <div className="avatar-status online"></div>
            </div>
          </div>
        </div>

        {/* Title Section */}
        <div className="title-section">
          <h1>Invoices</h1>
          <p className="invoice-count">There are {filteredInvoices.length} total invoices</p>
        </div>

        {/* Filter Bar */}
        <div className="filter-bar">
          <div className="filter-dropdown">
            <label>Filter by status</label>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="status-select"
            >
              <option value="all">All</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          <button className="new-invoice-btn">+ New Invoice</button>
        </div>

        {/* Invoice Table */}
        <div className="invoice-table">
          <div className="table-header">
            <div className="col-id">Invoice ID</div>
            <div className="col-due">Due Date</div>
            <div className="col-client">Client Name</div>
            <div className="col-amount">Amount</div>
            <div className="col-status">Status</div>
          </div>

          <div className="table-body">
            {filteredInvoices.map((invoice) => (
              <div className="invoice-row" key={invoice.id}>
                <div className="col-id">{invoice.id}</div>
                <div className="col-due">Due {invoice.dueDate}</div>
                <div className="col-client">{invoice.client}</div>
                <div className="col-amount">£{invoice.amount.toLocaleString()}</div>
                <div className="col-status">
                  <span className={`status-badge ${getStatusClass(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App