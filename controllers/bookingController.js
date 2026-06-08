import Stripe from 'stripe';

import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';
import * as factoryHandler from './factoryHandler.js';

import Booking from './../models/bookingModel.js';
import Tour from './../models/tourModel.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const getCheckoutSession = catchAsync(async (req, res, next) => {
    const tour = await Tour.findById(req.params.tourId);

    if (!tour) return next(new AppError('No tour found with that ID', 404));

    const session = await stripe.checkout.sessions.create({
        // Accept credit cards
        payment_method_types: ['card'],
        // Where to send the user after a successful payment
        success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
        // Where to send the user if they cancel midway
        cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.nameSlug}`,

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

export const createBookingCheckout = catchAsync(async (req, res, next) => {
    const { tour, user, price } = req.query;
    if (!tour || !user || !price) return next();

    await Booking.create({ tour, user, price });
    res.redirect(req.originalUrl.split('?')[0]);
});

export const getAllBookings = factoryHandler.getAll(Booking);
export const getBooking = factoryHandler.getOne(Booking);
export const createBooking = factoryHandler.createOne(Booking);
export const updateBooking = factoryHandler.updateOne(Booking);
export const deleteBooking = factoryHandler.deleteOne(Booking);
