const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();
const bookingCollection = db.collection('initial_booking');

router.post('/', async (req, res) => {
    try {
        const {
            physioTherapist_id,
            user_id,
            physioClinic_id,
            booking_description,
            booking_date,
            booking_status,
        } = req.body;

        // Ensure booking_date is a valid Date
        const parsedBookingDate = new Date(booking_date);
        if (isNaN(parsedBookingDate.getTime())) {
            return res.status(400).send({
                error: 'Invalid booking_date format. Please provide a valid date.',
            });
        }

        const booking = {
            physioTherapist_id,
            user_id,
            physioClinic_id,
            booking_description,
            booking_date: parsedBookingDate, // Use the valid date
            booking_status,
            created_at: admin.firestore.FieldValue.serverTimestamp(),
            updated_at: admin.firestore.FieldValue.serverTimestamp()
        };

        const docRef = await bookingCollection.add(booking);

        res.status(201).send({
            message: 'Booking created successfully',
            booking_id: docRef.id
        });
    } catch (error) {
        res.status(500).send({ error: 'Failed to create Booking', details: error.message });
    }
});



module.exports = router;
