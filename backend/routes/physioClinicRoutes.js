const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();
const physioClinicCollection = db.collection('physioClinics');

// Create a new Physio Clinic
router.post('/', async (req, res) => {
  try {
    const { 
      physioClinic_name, 
      physioClinic_email, 
      physioClinic_password, 
      physioClinic_address, 
      physioClinic_profilePic_URL, 
      physioClinic_description, 
      physioClinic_specalisation, 
      ratings 
    } = req.body;

    const physioClinic = {
      physioClinic_name,
      physioClinic_email,
      physioClinic_password,  // In production, consider encrypting the password
      physioClinic_address,
      physioClinic_profilePic_URL,
      physioClinic_description,
      physioClinic_specalisation,
      ratings,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await physioClinicCollection.add(physioClinic);

    res.status(201).send({
      message: 'PhysioClinic created successfully',
      physioClinic_id: docRef.id
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create PhysioClinic', details: error.message });
  }
});

// Get all Physio Clinics
router.get('/', async (req, res) => {
  try {
    const snapshot = await physioClinicCollection.get();
    if (snapshot.empty) {
      return res.status(404).send({ error: 'No PhysioClinics found' });
    }

    const physioClinics = [];
    snapshot.forEach(doc => {
      physioClinics.push({ physioClinic_id: doc.id, ...doc.data() });
    });

    res.status(200).send({ physioClinics });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch PhysioClinics', details: error.message });
  }
});

// Get a Physio Clinic by ID
router.get('/:physioClinicId', async (req, res) => {
  try {
    const physioClinicId = req.params.physioClinicId;
    const doc = await physioClinicCollection.doc(physioClinicId).get();

    if (!doc.exists) {
      return res.status(404).send({ error: 'PhysioClinic not found' });
    }

    res.status(200).send({ physioClinic_id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch PhysioClinic', details: error.message });
  }
});

// Update a Physio Clinic
router.put('/:physioClinicId', async (req, res) => {
  try {
    const physioClinicId = req.params.physioClinicId;
    const { 
      physioClinic_name, 
      physioClinic_email, 
      physioClinic_password, 
      physioClinic_address, 
      physioClinic_profilePic_URL, 
      physioClinic_description, 
      physioClinic_specalisation, 
      ratings 
    } = req.body;

    const updatedPhysioClinic = {
      physioClinic_name,
      physioClinic_email,
      physioClinic_password,  // In production, consider encrypting the password
      physioClinic_address,
      physioClinic_profilePic_URL,
      physioClinic_description,
      physioClinic_specalisation,
      ratings,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await physioClinicCollection.doc(physioClinicId).update(updatedPhysioClinic);

    res.status(200).send({
      message: 'PhysioClinic updated successfully',
      physioClinic_id: physioClinicId
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update PhysioClinic', details: error.message });
  }
});

// Delete a Physio Clinic
router.delete('/:physioClinicId', async (req, res) => {
  try {
    const physioClinicId = req.params.physioClinicId;

    await physioClinicCollection.doc(physioClinicId).delete();

    res.status(200).send({
      message: 'PhysioClinic deleted successfully',
      physioClinic_id: physioClinicId
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete PhysioClinic', details: error.message });
  }
});

module.exports = router;
