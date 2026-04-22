import { useState } from 'react'
import './InvoiceForm.css'

const VALIDATION_RULES = {
  clientName: v => v.trim().length >= 2 || 'Client name required',
  clientEmail: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Valid email required',
  items: v => v.length > 0 || 'At least one item required',
  itemQuantity: v => v > 0 || 'Quantity must be positive',
  itemPrice: v => v > 0 || 'Price must be positive',
  dueDate: v => new Date(v) > new Date() || 'Due date must be in future',
}

export default function InvoiceForm({ initialData, onSubmit, onCancel, isEditing }) {
  const [form, setForm] = useState(initialData || {
    clientName: '',
    clientEmail: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    items: [{ description: '', quantity: 1, price: 0 }],
    notes: '',
    total: 0
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    
    if (!form.clientName.trim()) newErrors.clientName = 'Client name required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail)) newErrors.clientEmail = 'Valid email required'
    if (form.items.length === 0) newErrors.items = 'At least one item required'
    if (!form.dueDate) newErrors.dueDate = 'Due date required'
    
    form.items.forEach((item, i) => {
      if (!item.description) newErrors[`item${i}Desc`] = 'Description required'
      if (item.quantity <= 0) newErrors[`item${i}Qty`] = 'Quantity must be positive'
      if (item.price <= 0) newErrors[`item${i}Price`] = 'Price must be positive'
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const total = form.items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
    onSubmit({ ...form, total })
  }

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { description: '', quantity: 1, price: 0 }]
    })
  }

  const removeItem = (idx) => {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== idx)
    })
  }

  const updateItem = (idx, field, value) => {
    const newItems = [...form.items]
    newItems[idx] = { ...newItems[idx], [field]: value }
    setForm({ ...form, items: newItems })
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="invoice-form">
        <h2>{isEditing ? 'Edit Invoice' : 'New Invoice'}</h2>

        <div className="form-section">
          <h3>Client Information</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="clientName">Client Name *</label>
              <input
                id="clientName"
                type="text"
                value={form.clientName}
                onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                className={errors.clientName ? 'error' : ''}
              />
              {errors.clientName && <span className="error-msg">{errors.clientName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="clientEmail">Email *</label>
              <input
                id="clientEmail"
                type="email"
                value={form.clientEmail}
                onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                className={errors.clientEmail ? 'error' : ''}
              />
              {errors.clientEmail && <span className="error-msg">{errors.clientEmail}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>Invoice Details</h3>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="invoiceDate">Invoice Date</label>
              <input
                id="invoiceDate"
                type="date"
                value={form.invoiceDate}
                onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dueDate">Due Date *</label>
              <input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className={errors.dueDate ? 'error' : ''}
              />
              {errors.dueDate && <span className="error-msg">{errors.dueDate}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="items-header">
            <h3>Line Items *</h3>
            <button type="button" className="btn-secondary" onClick={addItem}>+ Add Item</button>
          </div>
          {errors.items && <span className="error-msg">{errors.items}</span>}
          <div className="items-list">
            {form.items.map((item, idx) => (
              <div key={idx} className="item-row">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateItem(idx, 'description', e.target.value)}
                  className={errors[`item${idx}Desc`] ? 'error' : ''}
                />
                <input
                  type="number"
                  placeholder="Qty"
                  value={item.quantity}
                  onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value))}
                  min="1"
                  className={errors[`item${idx}Qty`] ? 'error' : ''}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => updateItem(idx, 'price', parseFloat(e.target.value))}
                  min="0"
                  step="0.01"
                  className={errors[`item${idx}Price`] ? 'error' : ''}
                />
                <span className="item-total">£{(item.quantity * item.price).toFixed(2)}</span>
                {form.items.length > 1 && (
                  <button type="button" className="btn-remove" onClick={() => removeItem(idx)}>×</button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-section">
          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows="4"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="btn-primary">{isEditing ? 'Update' : 'Create'} Invoice</button>
        </div>
      </form>
    </div>
  )
}
