const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();
const exerciseCollection = db.collection('exercises');

// Create a new Exercise
router.post('/', async (req, res) => {
  try {
    const { 
      exercise_name, 
      exercise_description, 
      exercise_endDate, 
      exercise_sets, 
      exercise_reps, 
      exercise_duration_sec, 
      exercise_video_URL = '', 
      exercise_picture_URL = '', 
      exercise_status = 'active', 
    } = req.body;

    const exercise = {
      exercise_name,
      exercise_description,
      exercise_endDate,
      exercise_sets,
      exercise_reps,
      exercise_duration_sec,
      exercise_video_URL,
      exercise_picture_URL,
      exercise_status,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    console.log('Exercise:', exercise);
    const docRef = await exerciseCollection.add(exercise);

    res.status(201).send({
      message: 'Exercise created successfully',
      exercise_id: docRef.id
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create Exercise', details: error.message });
  }
});

// Get all Exercises
router.get('/', async (req, res) => {
  try {
    const snapshot = await exerciseCollection.get();
    if (snapshot.empty) {
      return res.status(404).send({ error: 'No Exercises found' });
    }

    const exercises = [];
    snapshot.forEach(doc => {
      exercises.push({ exercise_id: doc.id, ...doc.data() });
    });

    res.status(200).send({ exercises });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Exercises', details: error.message });
  }
});

// Get an Exercise by ID
router.get('/:exerciseId', async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;
    const doc = await exerciseCollection.doc(exerciseId).get();

    if (!doc.exists) {
      return res.status(404).send({ error: 'Exercise not found' });
    }

    res.status(200).send({ exercise_id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Exercise', details: error.message });
  }
});

// Update an Exercise
router.put('/:exerciseId', async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;
    const { 
      exercise_name, 
      exercise_description, 
      exercise_endDate, 
      exercise_sets, 
      exercise_reps, 
      exercise_duration_sec, 
      exercise_video_URL, 
      exercise_picture_URL, 
      exercise_status 
    } = req.body;

    const updatedExercise = {
      exercise_name,
      exercise_description,
      exercise_endDate,
      exercise_sets,
      exercise_reps,
      exercise_duration_sec,
      exercise_video_URL,
      exercise_picture_URL,
      exercise_status,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    await exerciseCollection.doc(exerciseId).update(updatedExercise);

    res.status(200).send({
      message: 'Exercise updated successfully',
      exercise_id: exerciseId
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update Exercise', details: error.message });
  }
});

// Delete an Exercise
router.delete('/:exerciseId', async (req, res) => {
  try {
    const exerciseId = req.params.exerciseId;

    await exerciseCollection.doc(exerciseId).delete();

    res.status(200).send({
      message: 'Exercise deleted successfully',
      exercise_id: exerciseId
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete Exercise', details: error.message });
  }
});

router.get('/getPhysioClinicByExercise/:exerciseId', async (req, res) => {
    try {
      const exerciseDoc = await exerciseCollection.doc(req.params.exerciseId).get();
      if (!exerciseDoc.exists) {
        return res.status(404).send({ error: 'Exercise not found' });
      }
      const exercise = exerciseDoc.data();
      const physioClinicDoc = await db.collection('physioClinics').doc(exercise.physioClinic_id).get();
      if (!physioClinicDoc.exists) {
        return res.status(404).send({ error: 'PhysioClinic not found' });
      }
      res.status(200).send({ physioClinic: physioClinicDoc.data() });
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch PhysioClinic for Exercise', details: error.message });
    }
  });
  
  // Get PhysioTherapist by Exercise
  router.get('/getPhysioTherapistByExercise/:exerciseId', async (req, res) => {
    try {
      const exerciseDoc = await exerciseCollection.doc(req.params.exerciseId).get();
      if (!exerciseDoc.exists) {
        return res.status(404).send({ error: 'Exercise not found' });
      }
      const exercise = exerciseDoc.data();
      const physioTherapistDoc = await db.collection('physioTherapists').doc(exercise.physioTherapist_id).get();
      if (!physioTherapistDoc.exists) {
        return res.status(404).send({ error: 'PhysioTherapist not found' });
      }
      res.status(200).send({ physioTherapist: physioTherapistDoc.data() });
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch PhysioTherapist for Exercise', details: error.message });
    }
  });
  
module.exports = router;
