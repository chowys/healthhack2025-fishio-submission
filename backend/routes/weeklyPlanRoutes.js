const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();
const weeklyPlanCollection = db.collection('weeklyPlans');
//lol

// Create a new Weekly Plan
router.post('/', async (req, res) => {
  try {
    const { user_id, weeklyProgram_weekNumber, weeklyProgram_description, weeklyProgram_completed, recoveryPlan_id } = req.body;

    const weeklyPlan = {
      user_id,
      weeklyProgram_weekNumber,
      weeklyProgram_description,
      weeklyProgram_completed,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
      recoveryPlan_id
    };

    const docRef = await weeklyPlanCollection.add(weeklyPlan);

    await docRef.update({ program_id: docRef.id });

    res.status(201).send({
      message: 'Weekly Plan created successfully',
      weeklyPlan_id: docRef.id
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create Weekly Plan', details: error.message });
  }
});

// Get all Weekly Plans
router.get('/', async (req, res) => {
  try {
    const snapshot = await weeklyPlanCollection.get();
    if (snapshot.empty) {
      return res.status(404).send({ error: 'No Weekly Plans found' });
    }

    const weeklyPlans = [];
    snapshot.forEach(doc => {
      weeklyPlans.push({ weeklyPlan_id: doc.id, ...doc.data() });
    });

    res.status(200).send({ weeklyPlans });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Weekly Plans', details: error.message });
  }
});

// Get a Weekly Plan by ID
router.get('/:weeklyPlanId', async (req, res) => {
  try {
    const doc = await weeklyPlanCollection.doc(req.params.weeklyPlanId).get();
    if (!doc.exists) {
      return res.status(404).send({ error: 'Weekly Plan not found' });
    }
    res.status(200).send({ weeklyPlan_id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Weekly Plan', details: error.message });
  }
});

// Update a Weekly Plan
router.put('/:weeklyPlanId', async (req, res) => {
  try {
    const { program_id, user_id, weeklyProgram_weekNumber, weeklyProgram_description, weeklyProgram_completed } = req.body;
    const updatedWeeklyPlan = {
      user_id,
      weeklyProgram_weekNumber,
      weeklyProgram_description,
      weeklyProgram_completed,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
      recoveryPlan_id
    };

    await weeklyPlanCollection.doc(req.params.weeklyPlanId).update(updatedWeeklyPlan);
    res.status(200).send({ message: 'Weekly Plan updated successfully', weeklyPlan_id: req.params.weeklyPlanId });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update Weekly Plan', details: error.message });
  }
});

// Delete a Weekly Plan
router.delete('/:weeklyPlanId', async (req, res) => {
  try {
    await weeklyPlanCollection.doc(req.params.weeklyPlanId).delete();
    res.status(200).send({ message: 'Weekly Plan deleted successfully', weeklyPlan_id: req.params.weeklyPlanId });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete Weekly Plan', details: error.message });
  }
});

// Get User by Weekly Plan
router.get('/getUserByWeeklyPlan/:weeklyPlanId', async (req, res) => {
  try {
    const doc = await weeklyPlanCollection.doc(req.params.weeklyPlanId).get();
    if (!doc.exists) {
      return res.status(404).send({ error: 'Weekly Plan not found' });
    }
    const weeklyPlan = doc.data();
    const userDoc = await db.collection('users').doc(weeklyPlan.user_id).get();
    if (!userDoc.exists) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send({ user: userDoc.data() });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch User for Weekly Plan', details: error.message });
  }
});

// Get Program by Weekly Plan
router.get('/getProgramByWeeklyPlan/:weeklyPlanId', async (req, res) => {
  try {
    const doc = await weeklyPlanCollection.doc(req.params.weeklyPlanId).get();
    if (!doc.exists) {
      return res.status(404).send({ error: 'Weekly Plan not found' });
    }
    const weeklyPlan = doc.data();
    const programDoc = await db.collection('programs').doc(weeklyPlan.program_id).get();
    if (!programDoc.exists) {
      return res.status(404).send({ error: 'Program not found' });
    }
    res.status(200).send({ program: programDoc.data() });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Program for Weekly Plan', details: error.message });
  }
});

// Get WeeklyPlan by UserID
router.get('/getWeeklyPlanByUser/:userId', async (req, res) => {
  try {
    console.log("called");
    const snapshot = await weeklyPlanCollection.where('user_id', '==', req.params.userId).get();
    console.log("snapshot", snapshot);
    if (snapshot.empty) {
      return res.status(404).send({ error: 'No Weekly Plans found' });
    }

    const weeklyPlans = [];
    snapshot.forEach(doc => {
      weeklyPlans.push({ weeklyPlan_id: doc.id, ...doc.data() });
    });

    res.status(200).send({ weeklyPlans });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Weekly Plans', details: error.message });
  }
});

// Get WeeklyPlan by RecoveryPlanID
router.get('/getWeeklyPlanByRecoveryPlan/:recoveryPlanId', async (req, res) => {
  try {
    const snapshot = await weeklyPlanCollection.where('recoveryPlan_id', '==', req.params.recoveryPlanId).get();
    if (snapshot.empty) {
      return res.status(404).send({ error: 'No Weekly Plans found' });
    }

    const weeklyPlans = [];
    snapshot.forEach(doc => {
      weeklyPlans.push({ weeklyPlan_id: doc.id, ...doc.data() });
    });

    res.status(200).send({ weeklyPlans });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Weekly Plans', details: error.message });
  }
});

module.exports = router;
