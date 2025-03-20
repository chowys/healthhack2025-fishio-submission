const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();
const indivExerciseCollection = db.collection('indivExercise');

// Create a new Exercise
router.post('/', async (req, res) => {
  try {
    const {
        physioTherapist_id,
        physioClinic_id = '',
        exercise_name, 
        exercise_description, 
        exercise_video_URL = '', 
        exercise_picture_URL = '', 
    } = req.body;

    const exercise = {
        physioTherapist_id,
        physioClinic_id,
        exercise_name,
        exercise_description,
        exercise_video_URL,
        exercise_picture_URL,
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    // console.log('Exercise:', exercise);

    const docRef = await indivExerciseCollection.add(exercise);
    const doc = await docRef.get();

    console.log(docRef);
    res.status(200).send({
      message: 'Exercise created successfully',
      exercise_id: docRef.id,
      exercise: doc.data()
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Failed to create Exercise', details: error.message });
  }
});

// Get all Exercises for a specific physiotherapist
router.get('/:physioTherapist_id', async (req, res) => {
  try {
    const physioTherapist_id = req.params.physioTherapist_id;
    console.log('physioTherapist_id:', physioTherapist_id);
    const snapshot = await indivExerciseCollection.where('physioTherapist_id', '==', physioTherapist_id).get();
    if (snapshot.empty) {
      return res.status(404).send({ error: 'No Exercises found' });
    }

    const exercises = [];
    snapshot.forEach(doc => {
      exercises.push({ exercise_id: doc.id, ...doc.data() });
    });
    // console.log('Exercises:', exercises);
    res.status(200).send({ exercises });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Exercises', details: error.message });
  }
});

module.exports = router;