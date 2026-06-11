import Stripe from 'stripe';

import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import * as factoryHandler from './factoryHandler.js';

import Booking from './../models/bookingModel.js';
import Tour from './../models/tourModel.js';
import User from './../models/userModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSession = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);

    if (!tour) return next(new AppError('No tour found with that ID', 404));

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5174';

    const session = await stripe.checkout.sessions.create({
        // Accept credit cards
        payment_method_types: ['card'],
        // Where to send the user after a successful payment
        success_url: `${frontendUrl}/tour/${tour.nameSlug}?alert=booking`,
        // Where to send the user if they cancel midway
        cancel_url: `${frontendUrl}/tour/${tour.nameSlug}?alert=booking_failed`,

        // Customer details
        customer_email: req.user.email,
        client_reference_id: req.params.tourId,

        // Information about the product being bought
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    unit_amount: tour.price * 100,
                    product_data: {
                        name: `${tour.name} Tour`,
                        description: tour.summary,
                        images: [
                            `https://www.natours.dev/img/tours/${tour.imageCover}`,
                        ],
                    },
                },
                quantity: 1,
            },
        ],

        mode: 'payment',
    });

    res.status(200).json({
        status: 'success',
        session,
    });
});

const createBookingCheckout = async (session) => {
    try {
        const tour = session.client_reference_id;
        const userDoc = await User.findOne({ email: session.customer_email });
        if (!userDoc) throw new AppError('User not found for booking');
        const user = userDoc.id;
        const price = session.amount_total / 100;
        await Booking.create({ tour, user, price });
    } catch (err) {
        console.error('Error creating booking from webhook:', err);
    }
};

export const webhookCheckout = (req, res, next) => {
    const signature = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        return next(new AppError(`Webhook Error: ${err.message}`, 400));
    }

    if (event.type === 'checkout.session.completed') {
        createBookingCheckout(event.data.object);
    }

    res.status(200).json({ received: true });
};

export const getAllBookings = factoryHandler.getAll(Booking);
export const getBooking = factoryHandler.getOne(Booking);
export const createBooking = factoryHandler.createOne(Booking);
export const updateBooking = factoryHandler.updateOne(Booking);
export const deleteBooking = factoryHandler.deleteOne(Booking);
