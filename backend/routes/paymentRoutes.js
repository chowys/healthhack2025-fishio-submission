const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();
const paymentCollection = db.collection('payments');

// Create a new Payment
router.post('/', async (req, res) => {
  try {
    const {
      physioTherapist_id,
      user_id,
      physioClinic_id,
      payment_description,
      payment_amount,
      payment_status,
      payment_method,
      payment_date
    } = req.body;

    const payment = {
      physioTherapist_id,
      user_id,
      physioClinic_id,
      payment_description,
      payment_amount,
      payment_status,
      payment_method,
      payment_date,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await paymentCollection.add(payment);

    res.status(201).send({
      message: 'Payment created successfully',
      payment_id: docRef.id
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create Payment', details: error.message });
  }
});

// Get all Payments
router.get('/', async (req, res) => {
  try {
    const snapshot = await paymentCollection.get();
    if (snapshot.empty) {
      return res.status(404).send({ error: 'No Payments found' });
    }

    const payments = [];
    snapshot.forEach(doc => {
      payments.push({ payment_id: doc.id, ...doc.data() });
    });

    res.status(200).send({ payments });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Payments', details: error.message });
  }
});

// Get a Payment by ID
router.get('/:paymentId', async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const doc = await paymentCollection.doc(paymentId).get();

    if (!doc.exists) {
      return res.status(404).send({ error: 'Payment not found' });
    }

    res.status(200).send({ payment_id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Payment', details: error.message });
  }
});

// Update a Payment
router.put('/:paymentId', async (req, res) => {
  try {
    const paymentId = req.params.paymentId;
    const {
      physioTherapist_id,
      user_id,
      physioClinic_id,
      payment_description,
      payment_amount,
      payment_status,
      payment_method,
      payment_date
    } = req.body;

    const updatedPayment = {
      physioTherapist_id,
      user_id,
      physioClinic_id,
      payment_description,
      payment_amount,
      payment_status,
      payment_method,
      payment_date,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    await paymentCollection.doc(paymentId).update(updatedPayment);

    res.status(200).send({
      message: 'Payment updated successfully',
      payment_id: paymentId
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update Payment', details: error.message });
  }
});

// Delete a Payment
router.delete('/:paymentId', async (req, res) => {
  try {
    const paymentId = req.params.paymentId;

    await paymentCollection.doc(paymentId).delete();

    res.status(200).send({
      message: 'Payment deleted successfully',
      payment_id: paymentId
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete Payment', details: error.message });
  }
});

router.get('/getUserByPayment/:paymentId', async (req, res) => {
    try {
      const paymentDoc = await paymentCollection.doc(req.params.paymentId).get();
      if (!paymentDoc.exists) {
        return res.status(404).send({ error: 'Payment not found' });
      }
      const payment = paymentDoc.data();
      const userDoc = await db.collection('users').doc(payment.user_id).get();
      if (!userDoc.exists) {
        return res.status(404).send({ error: 'User not found' });
      }
      res.status(200).send({ user: userDoc.data() });
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch User for Payment', details: error.message });
    }
  });
  
  // Get PhysioClinic by Payment
  router.get('/getPhysioClinicByPayment/:paymentId', async (req, res) => {
    try {
      const paymentDoc = await paymentCollection.doc(req.params.paymentId).get();
      if (!paymentDoc.exists) {
        return res.status(404).send({ error: 'Payment not found' });
      }
      const payment = paymentDoc.data();
      const physioClinicDoc = await db.collection('physioClinics').doc(payment.physioClinic_id).get();
      if (!physioClinicDoc.exists) {
        return res.status(404).send({ error: 'PhysioClinic not found' });
      }
      res.status(200).send({ physioClinic: physioClinicDoc.data() });
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch PhysioClinic for Payment', details: error.message });
    }
  });
  
  // Get PhysioTherapist by Payment
  router.get('/getPhysioTherapistByPayment/:paymentId', async (req, res) => {
    try {
      const paymentDoc = await paymentCollection.doc(req.params.paymentId).get();
      if (!paymentDoc.exists) {
        return res.status(404).send({ error: 'Payment not found' });
      }
      const payment = paymentDoc.data();
      const physioTherapistDoc = await db.collection('physioTherapists').doc(payment.physioTherapist_id).get();
      if (!physioTherapistDoc.exists) {
        return res.status(404).send({ error: 'PhysioTherapist not found' });
      }
      res.status(200).send({ physioTherapist: physioTherapistDoc.data() });
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch PhysioTherapist for Payment', details: error.message });
    }
  });

module.exports = router;
