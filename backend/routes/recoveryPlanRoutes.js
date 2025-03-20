const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();
const recoveryPlanCollection = db.collection('recoveryPlans');

// Create a new Recovery Plan
router.post('/', async (req, res) => {
  try {
    const { 
      user_id, 
      physioTherapist_id, 
      physioClinic_id, 
      recoveryPlan_name, 
      recoveryPlan_description, 
      appointment_status,
      recoveryPlan_id
    } = req.body;

    const recoveryPlan = {
      user_id,
      physioTherapist_id,
      physioClinic_id,
      recoveryPlan_name,
      recoveryPlan_description,
      appointment_status,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
      recoveryPlan_id: ""
    };


    const docRef = await recoveryPlanCollection.add(recoveryPlan);
    const doc = await docRef.get();

    docRef.update({ recoveryPlan_id: docRef.id });

    res.status(201).send({
      message: 'Recovery Plan created successfully',
      recoveryPlan_id: docRef.id,
      recoveryPlan_created: doc.data()
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create Recovery Plan', details: error.message });
  }
});

// Get all Recovery Plans
router.get('/', async (req, res) => {
  try {
    const snapshot = await recoveryPlanCollection.get();
    if (snapshot.empty) {
      return res.status(404).send({ error: 'No Recovery Plans found' });
    }

    const recoveryPlans = [];
    snapshot.forEach(doc => {
      recoveryPlans.push({ recoveryPlan_id: doc.id, ...doc.data() });
    });

    res.status(200).send({ recoveryPlans });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Recovery Plans', details: error.message });
  }
});

// Get a Recovery Plan by ID
router.get('/:recoveryPlanId', async (req, res) => {
  try {
    const recoveryPlanId = req.params.recoveryPlanId;
    const doc = await recoveryPlanCollection.doc(recoveryPlanId).get();

    if (!doc.exists) {
      return res.status(404).send({ error: 'Recovery Plan not found' });
    }

    res.status(200).send({ recoveryPlan_id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Recovery Plan', details: error.message });
  }
});

// Update a Recovery Plan
router.put('/:recoveryPlanId', async (req, res) => {
  try {
    const recoveryPlanId = req.params.recoveryPlanId;
    const { 
      user_id, 
      physioTherapist_id, 
      physioClinic_id, 
      recoveryPlan_name, 
      recoveryPlan_description, 
      appointment_status,
      recoveryPlan_id 
    } = req.body;

    const updatedRecoveryPlan = {
      user_id,
      physioTherapist_id,
      physioClinic_id,
      recoveryPlan_name,
      recoveryPlan_description,
      appointment_status,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
      recoveryPlan_id
    };

    await recoveryPlanCollection.doc(recoveryPlanId).update(updatedRecoveryPlan);

    res.status(200).send({
      message: 'Recovery Plan updated successfully',
      recoveryPlan_id: recoveryPlanId
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update Recovery Plan', details: error.message });
  }
});

// Delete a Recovery Plan
router.delete('/:recoveryPlanId', async (req, res) => {
  try {
    const recoveryPlanId = req.params.recoveryPlanId;

    await recoveryPlanCollection.doc(recoveryPlanId).delete();

    res.status(200).send({
      message: 'Recovery Plan deleted successfully',
      recoveryPlan_id: recoveryPlanId
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete Recovery Plan', details: error.message });
  }
});

router.get('/getUserByRecoveryPlan/:recoveryPlanId', async (req, res) => {
    try {
      const recoveryPlanDoc = await recoveryPlanCollection.doc(req.params.recoveryPlanId).get();
      if (!recoveryPlanDoc.exists) {
        return res.status(404).send({ error: 'RecoveryPlan not found' });
      }
      const recoveryPlan = recoveryPlanDoc.data();
      const userDoc = await db.collection('users').doc(recoveryPlan.user_id).get();
      if (!userDoc.exists) {
        return res.status(404).send({ error: 'User not found' });
      }
      res.status(200).send({ user: userDoc.data() });
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch User for RecoveryPlan', details: error.message });
    }
  });
  
  // Get PhysioTherapist by RecoveryPlan
  router.get('/getPhysioTherapistByRecoveryPlan/:recoveryPlanId', async (req, res) => {
    try {
      const recoveryPlanDoc = await recoveryPlanCollection.doc(req.params.recoveryPlanId).get();
      if (!recoveryPlanDoc.exists) {
        return res.status(404).send({ error: 'RecoveryPlan not found' });
      }
      const recoveryPlan = recoveryPlanDoc.data();
      const physioTherapistDoc = await db.collection('physioTherapists').doc(recoveryPlan.physioTherapist_id).get();
      if (!physioTherapistDoc.exists) {
        return res.status(404).send({ error: 'PhysioTherapist not found' });
      }
      res.status(200).send({ physioTherapist: physioTherapistDoc.data() });
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch PhysioTherapist for RecoveryPlan', details: error.message });
    }
  });
  
  // Get PhysioClinic by RecoveryPlan
  router.get('/getPhysioClinicByRecoveryPlan/:recoveryPlanId', async (req, res) => {
    try {
      const recoveryPlanDoc = await recoveryPlanCollection.doc(req.params.recoveryPlanId).get();
      if (!recoveryPlanDoc.exists) {
        return res.status(404).send({ error: 'RecoveryPlan not found' });
      }
      const recoveryPlan = recoveryPlanDoc.data();
      const physioClinicDoc = await db.collection('physioClinics').doc(recoveryPlan.physioClinic_id).get();
      if (!physioClinicDoc.exists) {
        return res.status(404).send({ error: 'PhysioClinic not found' });
      }
      res.status(200).send({ physioClinic: physioClinicDoc.data() });
    } catch (error) {
      res.status(500).send({ error: 'Failed to fetch PhysioClinic for RecoveryPlan', details: error.message });
    }
  });

  // Get all recovery plan by user and physiotherapist
  router.get('/getRecoveryPlanByUserAndPhysioTherapist/:userId/:physioTherapistId', async (req, res) => {
      try {
        const userId = req.params.userId;
        const physioTherapistId = req.params.physioTherapistId;
        const snapshot = await recoveryPlanCollection.where('user_id', '==', userId).where('physioTherapist_id', '==', physioTherapistId).get();
        const recoveryPlans = [];
        snapshot.forEach(doc => {
          recoveryPlans.push({ recoveryPlan_id: doc.id, ...doc.data() });
        });
        res.status(200).send({ recoveryPlans });
      } catch (error) {
        res.status(500).send({ error: 'Failed to fetch Recovery Plans', details: error.message });
      }
    }
  );
  
module.exports = router;
