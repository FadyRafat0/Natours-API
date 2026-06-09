import { Link } from 'react-router-dom';
import type { Tour } from '../types';
import { tourImg, formatDate } from '../utils/helpers';

const ICONS = '/img/icons.svg';

interface TourCardProps {
  tour: Tour;
}

const TourCard = ({ tour }: TourCardProps) => {
  return (
    <div className="card">
      <div className="card__header">
        <div className="card__picture">
          <div className="card__picture-overlay">&nbsp;</div>
          <img
            src={tourImg(tour.imageCover)}
            alt={tour.name}
            className="card__picture-img"
          />
        </div>

        <h3 className="heading-tertirary">
          <span>{tour.name}</span>
        </h3>
      </div>

      <div className="card__details">
        <h4 className="card__sub-heading">{tour.difficulty} {tour.duration}-day tour</h4>
        <p className="card__text">{tour.summary}</p>
        
        <div className="card__data">
          <svg className="card__icon">
            <use href={`${ICONS}#icon-map-pin`} />
          </svg>
          <span>{tour.startLocation?.description}</span>
        </div>
        <div className="card__data">
          <svg className="card__icon">
            <use href={`${ICONS}#icon-calendar`} />
          </svg>
          <span>{tour.startDates.length > 0 ? formatDate(tour.startDates[0]) : 'TBD'}</span>
        </div>
        <div className="card__data">
          <svg className="card__icon">
            <use href={`${ICONS}#icon-flag`} />
          </svg>
          <span>{tour.locations?.length} stops</span>
        </div>
        <div className="card__data">
          <svg className="card__icon">
            <use href={`${ICONS}#icon-user`} />
          </svg>
          <span>{tour.maxGroupSize} people</span>
        </div>
      </div>

      <div className="card__footer">
        <p>
          <span className="card__footer-value">${tour.price}</span>
          <span className="card__footer-text"> per person</span>
        </p>
        <p className="card__ratings">
          <span className="card__footer-value">{tour.ratingsAverage}</span>
          <span className="card__footer-text"> rating ({tour.ratingsQuantity})</span>
        </p>
        <Link to={`/tour/${tour.nameSlug}`} className="btn btn--green btn--small">
          Details
        </Link>
      </div>
    </div>
  );
};

export default TourCard;
