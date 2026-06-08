/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
    try {
        const stripe = new Stripe(
            'pk_test_51TeuvD04TEUQ66LtGHVDHTiXHzNjLagkZlFqSLfImzvcNQAFMet54q2VL4kTbZt2zBQr2BphWPlqhKjgBwElLcTd00J2oUde6h',
        );

        // 1) Get checkout session from API
        const session = await axios(
            `/api/v1/bookings/checkout-session/${tourId}`,
        );

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
        setTimeout(() => {
            location.reload();
        }, 1000);
    }
};
