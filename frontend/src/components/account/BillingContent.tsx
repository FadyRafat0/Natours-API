const BillingContent = () => {
  return (
    <div className="user-view__form-container">
      <h2 className="heading-secondary ma-bt-md">Billing Overview</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', marginBottom: '4rem' }}>
        <div style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '1rem', boxShadow: '0 1.5rem 4rem rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <h3 className="heading-tertirary" style={{ fontSize: '1.6rem', color: '#777', textTransform: 'uppercase' }}>Current Balance</h3>
          <p style={{ fontSize: '4rem', fontWeight: 700, color: '#55c57a', margin: '1rem 0' }}>$0.00</p>
          <span className="btn btn--small btn--green" style={{ cursor: 'default' }}>Paid in Full</span>
        </div>
        
        <div style={{ backgroundColor: '#fff', padding: '3rem', borderRadius: '1rem', boxShadow: '0 1.5rem 4rem rgba(0,0,0,0.1)' }}>
          <h3 className="heading-tertirary" style={{ fontSize: '1.6rem', color: '#777', textTransform: 'uppercase', marginBottom: '2rem' }}>Payment Methods</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.5rem', backgroundColor: '#f9f9f9', borderRadius: '0.5rem', border: '1px solid #eee' }}>
            <div style={{ fontSize: '3rem', color: '#55c57a' }}>💳</div>
            <div>
              <p style={{ fontSize: '1.4rem', fontWeight: 700 }}>Visa ending in 4242</p>
              <p style={{ fontSize: '1.2rem', color: '#999' }}>Expires 12/26</p>
            </div>
          </div>
          <button className="btn-text" style={{ marginTop: '1.5rem', fontSize: '1.4rem' }}>+ Add payment method</button>
        </div>
      </div>

      <h2 className="heading-secondary ma-bt-md">Recent Invoices</h2>
      <div style={{ backgroundColor: '#fff', borderRadius: '1rem', boxShadow: '0 1.5rem 4rem rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {[1, 2, 3].map((num) => (
          <div key={num} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem', borderBottom: num !== 3 ? '1px solid #f4f2f2' : 'none' }}>
            <div>
              <p style={{ fontSize: '1.4rem', fontWeight: 700 }}>Invoice INV-{2025000 + num}</p>
              <p style={{ fontSize: '1.2rem', color: '#999' }}>Oct {num + 10}, 2025 &bull; $497.00</p>
            </div>
            <button className="btn btn--small" style={{ backgroundColor: '#f3f3f3', color: '#777' }} onClick={() => alert('Downloading invoice...')}>
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillingContent;
