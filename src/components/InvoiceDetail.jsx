import './InvoiceDetail.css'

export default function InvoiceDetail({ invoice, onEdit, onDelete, onStatusChange, onBack }) {
  const canTransition = {
    Draft: ['Pending'],
    Pending: ['Paid', 'Draft'],
    Paid: []
  }

  const canDelete = invoice.status === 'Draft'

  return (
    <div className="detail-container">
      <div className="detail-header">
        <button className="btn-back" onClick={onBack}>← Back</button>
        <div className="detail-actions">
          {canDelete && <button className="btn-danger" onClick={onDelete}>Delete</button>}
          {invoice.status !== 'Paid' && <button className="btn-primary" onClick={onEdit}>Edit</button>}
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-section">
          <div className="section-header">
            <div>
              <h1>{invoice.id}</h1>
              <p className="status-text">Status: {invoice.status}</p>
            </div>
            <div className="status-controls">
              <select 
                value={invoice.status}
                onChange={(e) => onStatusChange(e.target.value)}
                className="status-select"
              >
                <option value={invoice.status}>{invoice.status}</option>
                {canTransition[invoice.status].map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="detail-grid">
          <div className="detail-section">
            <h3>Client Details</h3>
            <div className="detail-info">
              <p><strong>Name:</strong> {invoice.clientName}</p>
              <p><strong>Email:</strong> {invoice.clientEmail}</p>
            </div>
          </div>

          <div className="detail-section">
            <h3>Invoice Timeline</h3>
            <div className="detail-info">
              <p><strong>Invoice Date:</strong> {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
              <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        <div className="detail-section">
          <h3>Line Items</h3>
          <div className="items-table">
            <div className="table-header">
              <div>Description</div>
              <div>Qty</div>
              <div>Unit Price</div>
              <div>Total</div>
            </div>
            {invoice.items.map((item, idx) => (
              <div key={idx} className="table-row">
                <div>{item.description}</div>
                <div>{item.quantity}</div>
                <div>£{item.price.toFixed(2)}</div>
                <div>£{(item.quantity * item.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="detail-section">
          <div className="total-box">
            <span>Total Amount</span>
            <span className="amount">£{invoice.total.toFixed(2)}</span>
          </div>
        </div>

        {invoice.notes && (
          <div className="detail-section">
            <h3>Notes</h3>
            <p className="notes-text">{invoice.notes}</p>
          </div>
        )}
      </div>
    </div>
  )
}
