const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();
const reviewCollection = db.collection('reviews');

// Create a new review
router.post('/', async (req, res) => {
  try {
    const { user_id, physioTherapist_id, physioClinic_id, review_description, review_rating, review_date } = req.body;
    
    if (!user_id || !review_rating) {
      return res.status(400).send({ error: 'User ID and Rating are required' });
    }

    const review = {
      user_id,
      physioTherapist_id,
      physioClinic_id,
      review_description: review_description || null,
      review_rating,
      review_date: review_date || null,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await reviewCollection.add(review);
    res.status(201).send({ message: 'Review created successfully', review_id: docRef.id });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create review', details: error.message });
  }
});

// Get all reviews for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const reviewsSnapshot = await reviewCollection.where('user_id', '==', userId).get();

    if (reviewsSnapshot.empty) {
      return res.status(404).send({ error: 'No reviews found for this user' });
    }

    const reviews = reviewsSnapshot.docs.map(doc => doc.data());
    res.status(200).send({ reviews });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch reviews', details: error.message });
  }
});

// Get all reviews for a physio therapist
router.get('/therapist/:therapistId', async (req, res) => {
  try {
    const therapistId = req.params.therapistId;
    const reviewsSnapshot = await reviewCollection.where('physioTherapist_id', '==', therapistId).get();

    if (reviewsSnapshot.empty) {
      return res.status(404).send({ error: 'No reviews found for this therapist' });
    }

    const reviews = reviewsSnapshot.docs.map(doc => doc.data());
    res.status(200).send({ reviews });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch reviews', details: error.message });
  }
});

// Get all reviews for a physio clinic
router.get('/clinic/:clinicId', async (req, res) => {
  try {
    const clinicId = req.params.clinicId;
    const reviewsSnapshot = await reviewCollection.where('physioClinic_id', '==', clinicId).get();

    if (reviewsSnapshot.empty) {
      return res.status(404).send({ error: 'No reviews found for this clinic' });
    }

    const reviews = reviewsSnapshot.docs.map(doc => doc.data());
    res.status(200).send({ reviews });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch reviews', details: error.message });
  }
});

// Update a review by ID
router.put('/:reviewId', async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const updateData = req.body;
    updateData.updated_at = admin.firestore.FieldValue.serverTimestamp();

    const reviewDoc = await reviewCollection.doc(reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).send({ error: 'Review not found' });
    }

    await reviewCollection.doc(reviewId).update(updateData);
    res.status(200).send({ message: 'Review updated successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update review', details: error.message });
  }
});

// Delete a review by ID
router.delete('/:reviewId', async (req, res) => {
  try {
    const reviewId = req.params.reviewId;
    const reviewDoc = await reviewCollection.doc(reviewId).get();
    if (!reviewDoc.exists) {
      return res.status(404).send({ error: 'Review not found' });
    }

    await reviewCollection.doc(reviewId).delete();
    res.status(200).send({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete review', details: error.message });
  }
});

module.exports = router;
