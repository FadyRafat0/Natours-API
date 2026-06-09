const BillingContent = () => {
  return (
    <div className="user-view__form-container">
      <h2 className="heading-secondary ma-bt-md">Billing Overview</h2>

      <div className="billing-grid">

        <div className="billing-card billing-card--center">

          <h3 className="heading-tertirary billing-card__title">
            Current Balance
          </h3>
          <p className="billing-card__balance">
            $0.00
          </p>
          <span
            className="btn btn--small btn--green"
            style={{ cursor: "default" }}
          >
            Paid in Full
          </span>
        </div>

        <div className="billing-card">

          <h3 className="heading-tertirary billing-card__title billing-card__title--mb">
            Payment Methods
          </h3>
          <div className="billing-card__payment-method">

            <div className="billing-card__icon">💳</div>
            <div>
              <p className="billing-card__text-bold">
                Visa ending in 4242
              </p>
              <p className="billing-card__text-muted">Expires 12/26</p>
            </div>
          </div>
          <button className="btn-text billing-card__btn-add">
            + Add payment method
          </button>
        </div>
      </div>

      <h2 className="heading-secondary ma-bt-md">Recent Invoices</h2>
      <div className="invoice-list">

        {[1, 2, 3].map((num) => (
          <div key={num} className="invoice-item">

            <div>
              <p className="billing-card__text-bold">
                Invoice INV-{2025000 + num}
              </p>
              <p className="billing-card__text-muted">
                Oct {num + 10}, 2025 &bull; $497.00
              </p>
            </div>
            <button
              className="btn btn--small invoice-item__btn"
              onClick={() => alert("Downloading invoice...")}
            >
              Download PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BillingContent;
