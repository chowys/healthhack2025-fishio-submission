const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();
const exercisePlanCollection = db.collection('exercisePlans');

// Create a new Exercise Plan
router.post('/', async (req, res) => {
  try {
    const { 
      physioTherapist_id, 
      physioClinic_id, 
      exercisePlan_name, 
      exercisePlan_description,
      exercisePlan_startDate, 
      exercisePlan_endDate, 
      exercisePlan_status 
    } = req.body;

    const exercisePlan = {
      physioTherapist_id,
      physioClinic_id,
      exercisePlan_name,
      exercisePlan_description,
      exercisePlan_startDate,
      exercisePlan_endDate,
      exercisePlan_status,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await exercisePlanCollection.add(exercisePlan);

    res.status(201).send({
      message: 'Exercise Plan created successfully',
      exercisePlan_id: docRef.id
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create Exercise Plan', details: error.message });
  }
});

// Get all Exercise Plans
router.get('/', async (req, res) => {
  try {
    const snapshot = await exercisePlanCollection.get();
    if (snapshot.empty) {
      return res.status(404).send({ error: 'No Exercise Plans found' });
    }

    const exercisePlans = [];
    snapshot.forEach(doc => {
      exercisePlans.push({ exercisePlan_id: doc.id, ...doc.data() });
    });

    res.status(200).send({ exercisePlans });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Exercise Plans', details: error.message });
  }
});

// Get an Exercise Plan by ID
router.get('/:exercisePlanId', async (req, res) => {
  try {
    const exercisePlanId = req.params.exercisePlanId;
    const doc = await exercisePlanCollection.doc(exercisePlanId).get();

    if (!doc.exists) {
      return res.status(404).send({ error: 'Exercise Plan not found' });
    }

    res.status(200).send({ exercisePlan_id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Exercise Plan', details: error.message });
  }
});

// Update an Exercise Plan
router.put('/:exercisePlanId', async (req, res) => {
  try {
    const exercisePlanId = req.params.exercisePlanId;
    const { 
      physioTherapist_id, 
      physioClinic_id, 
      exercisePlan_name, 
      exercisePlan_description,
      exercisePlan_startDate,
      exercisePlan_endDate, 
      exercisePlan_status 
    } = req.body;

    const updatedExercisePlan = {
      physioTherapist_id,
      physioClinic_id,
      exercisePlan_name,
      exercisePlan_description,
      exercisePlan_startDate,
      exercisePlan_endDate,
      exercisePlan_status,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    await exercisePlanCollection.doc(exercisePlanId).update(updatedExercisePlan);

    res.status(200).send({
      message: 'Exercise Plan updated successfully',
      exercisePlan_id: exercisePlanId
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update Exercise Plan', details: error.message });
  }
});

// Delete an Exercise Plan
router.delete('/:exercisePlanId', async (req, res) => {
  try {
    const exercisePlanId = req.params.exercisePlanId;

    await exercisePlanCollection.doc(exercisePlanId).delete();

    res.status(200).send({
      message: 'Exercise Plan deleted successfully',
      exercisePlan_id: exercisePlanId
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete Exercise Plan', details: error.message });
  }
});

router.get('/getPhysioTherapistByExercisePlan/:exercisePlanId', async (req, res) => {
    try {
      const exercisePlanDoc = await exercisePlanCollection.doc(req.params.exercisePlanId).get();
      if (!exercisePlanDoc.exists) {
        return res.status(404).send({ error: 'ExercisePlan not found' });
      }
      const exercisePlan = exercisePlanDoc.data();
      const physioTherapistDoc = await db.collection('physioTherapists').doc(exercisePlan.physioTherapist_id).get();
      if (!physioTherapistDoc.exists) {
        return res.status(404).send({ error: 'PhysioTherapist not found' });
      }
      res.status(200).send({ physioTherapist: physioTherapistDoc.data() });
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch PhysioTherapist for ExercisePlan', details: error.message });
    }
  });
  
  // Get PhysioClinic by ExercisePlan
  router.get('/getPhysioClinicByExercisePlan/:exercisePlanId', async (req, res) => {
    try {
      const exercisePlanDoc = await exercisePlanCollection.doc(req.params.exercisePlanId).get();
      if (!exercisePlanDoc.exists) {
        return res.status(404).send({ error: 'ExercisePlan not found' });
      }
      const exercisePlan = exercisePlanDoc.data();
      const physioClinicDoc = await db.collection('physioClinics').doc(exercisePlan.physioClinic_id).get();
      if (!physioClinicDoc.exists) {
        return res.status(404).send({ error: 'PhysioClinic not found' });
      }
      res.status(200).send({ physioClinic: physioClinicDoc.data() });
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch PhysioClinic for ExercisePlan', details: error.message });
    }
  });

  
module.exports = router;
