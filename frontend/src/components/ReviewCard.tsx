import type { Review } from '../types';
import { userImg } from '../utils/helpers';

const ICONS = '/img/icons.svg';

const ReviewCard = ({ review }: { review: Review }) => (
  <div className="reviews__card">
    <div className="reviews__avatar">
      <img
        src={userImg(review.user.photo)}
        alt={review.user.name}
        className="reviews__avatar-img"
      />
      <h6 className="reviews__user">{review.user.name}</h6>
    </div>
    <p className="reviews__text">{review.review}</p>
    <div className="reviews__rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`reviews__star reviews__star--${star <= review.rating ? 'active' : 'inactive'}`}
        >
          <use href={`${ICONS}#icon-star`} />
        </svg>
      ))}
    </div>
  </div>
);

export default ReviewCard;
