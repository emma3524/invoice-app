import './InvoiceList.css'

const STATUS_FILTERS = ['All', 'Draft', 'Pending', 'Paid']

const StatusBadge = ({ status }) => {
  const colors = {
    Draft: '#5d6b8d',
    Pending: '#fbbf24',
    Paid: '#00d4aa'
  }
  return (
    <span className="status-badge" style={{ backgroundColor: colors[status] + '20', color: colors[status] }}>
      {status}
    </span>
  )
}

export default function InvoiceList({ invoices, onSelect, onCreate, filter, onFilterChange }) {
  return (
    <div className="invoice-list-container">
      <div className="invoice-list-header">
        <h2>Recent Invoices</h2>
        <button className="btn-primary" onClick={onCreate}>+ New Invoice</button>
      </div>

      <div className="filter-controls">
        {STATUS_FILTERS.map(status => (
          <button
            key={status}
            className={`filter-btn ${filter === status ? 'active' : ''}`}
            onClick={() => onFilterChange(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {invoices.length === 0 ? (
        <div className="empty-state">
          <p>No invoices found</p>
          <button className="btn-primary" onClick={onCreate}>Create your first invoice</button>
        </div>
      ) : (
        <div className="invoices-grid">
          {invoices.map(inv => (
            <div 
              key={inv.id}
              className="invoice-card"
              onClick={() => onSelect(inv.id)}
            >
              <div className="invoice-card-header">
                <span className="invoice-id">{inv.id}</span>
                <StatusBadge status={inv.status} />
              </div>
              <div className="invoice-card-body">
                <p className="client-name">{inv.clientName}</p>
                <p className="due-date">Due: {new Date(inv.dueDate).toLocaleDateString()}</p>
              </div>
              <div className="invoice-card-footer">
                <span className="amount">£{inv.total.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
