const ICONS = '/img/icons.svg';

const QuickFact = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div className="overview-box__detail">
    <svg className="overview-box__icon">
      <use href={`${ICONS}#icon-${icon}`} />
    </svg>
    <span className="overview-box__label">{label}</span>
    <span className="overview-box__text">{value}</span>
  </div>
);

export default QuickFact;
