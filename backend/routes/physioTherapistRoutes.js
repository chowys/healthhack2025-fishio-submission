const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();
const physioTherapistCollection = db.collection('physioTherapists');

// Create a new Physio Therapist
router.post('/', async (req, res) => {
  try {
    const {
      physioTherapist_id,
      physioTherapist_name, 
      physioTherapist_email, 
      physioTherapist_profilePic_URL, 
      physioTherapist_cert_URL, 
      physioTherapist_specialisation, 
      ratings 
    } = req.body;

    const physioTherapist = {
      physioTherapist_name,
      physioTherapist_email,
      physioTherapist_profilePic_URL,
      physioTherapist_cert_URL,
      physioTherapist_specialisation,
      ratings,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
      verified: false,
    };

    const docRef = await physioTherapistCollection.doc(physioTherapist_id).set(physioTherapist);

    res.status(201).send({
      message: 'PhysioTherapist created successfully',
      physioTherapist_id: docRef.id
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create PhysioTherapist', details: error.message });
  }
});

// Get all Physio Therapists
router.get('/', async (req, res) => {
  try {
    const snapshot = await physioTherapistCollection.get();
    if (snapshot.empty) {
      return res.status(404).send({ error: 'No PhysioTherapists found' });
    }

    const physioTherapists = [];
    snapshot.forEach(doc => {
      physioTherapists.push({ physioTherapist_id: doc.id, ...doc.data() });
    });

    res.status(200).send({ physioTherapists });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch PhysioTherapists', details: error.message });
  }
});

// Get a Physio Therapist by ID
router.get('/:physioTherapistId', async (req, res) => {
  try {
    const physioTherapistId = req.params.physioTherapistId;
    const doc = await physioTherapistCollection.doc(physioTherapistId).get();

    if (!doc.exists) {
      return res.status(404).send({ error: 'PhysioTherapist not found' });
    }

    res.status(200).send({ physioTherapist_id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch PhysioTherapist', details: error.message });
  }
});

// Get a Physio Therapist by email
router.get('/email/:email', async (req, res) => {
  try {
    const physioTherapistEmail = req.params.email;
    const snapshot = await physioTherapistCollection.where('physioTherapist_email', '==', physioTherapistEmail).get();
    const doc = snapshot.docs[0]; // Get the first document
    if (!doc.exists) {
      return res.status(404).send({ error: 'PhysioTherapist not found' });
    }

    res.status(200).send({ physioTherapist_id: doc.id, ...doc.data() });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: 'Failed to fetch PhysioTherapist', details: error.message });
  }
});

// Update a Physio Therapist
router.put('/:physioTherapistId', async (req, res) => {
  try {
    const physioTherapistId = req.params.physioTherapistId;
    const { 
      physioTherapist_name, 
      physioTherapist_email, 
      physioTherapist_password, 
      physioTherapist_profilePic_URL, 
      physioTherapist_cert_URL, 
      physioTherapist_specialisation, 
      physioTherapist_about,
      physioTherapist_address,
      ratings,
      physioTherapist_idcert
    } = req.body;

    const currentPhysioTherapistDoc = await physioTherapistCollection.doc(physioTherapistId).get();
    if (!currentPhysioTherapistDoc.exists) {
      return res.status(404).send({ error: 'PhysioTherapist not found' });
    }
    const currentPhysioTherapist = currentPhysioTherapistDoc.data();

    const updatedPhysioTherapist = {
      physioTherapist_name,
      physioTherapist_email,
      physioTherapist_password,  // In production, consider encrypting the password
      physioTherapist_profilePic_URL,
      physioTherapist_cert_URL,
      physioTherapist_specialisation,
      physioTherapist_about,
      physioTherapist_address,
      ratings,
      physioTherapist_idcert,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };
    updatedPhysioTherapist.physioTherapist_password = currentPhysioTherapist.physioTherapist_password;
    await physioTherapistCollection.doc(physioTherapistId).update(updatedPhysioTherapist);

    res.status(200).send({
      message: 'PhysioTherapist updated successfully',
      physioTherapist_id: physioTherapistId
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update PhysioTherapist', details: error.message });
  }
});

// Delete a Physio Therapist
router.delete('/:physioTherapistId', async (req, res) => {
  try {
    const physioTherapistId = req.params.physioTherapistId;

    await physioTherapistCollection.doc(physioTherapistId).delete();

    res.status(200).send({
      message: 'PhysioTherapist deleted successfully',
      physioTherapist_id: physioTherapistId
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete PhysioTherapist', details: error.message });
  }
});

// Search & Filter Physiotherapists
// GET /physiotherapists/search?specialisation=Orthopedic
// GET /physiotherapists/search?minRating=4.5
// GET /physiotherapists/search?location=Singapore
// GET /physiotherapists/search?specialisation=Orthopedic&minRating=4.5&location=Singapore

router.get("/search", async (req, res) => {
  try {
    let query = physioTherapistCollection;

    // Apply filters based on query parameters
    if (req.query.specialisation) {
      query = query.where("physioTherapist_specialisation", "==", req.query.specialisation);
    }
    if (req.query.minRating) {
      query = query.where("ratings", ">=", parseFloat(req.query.minRating));
    }
    if (req.query.location) {
      // Firestore doesn't support direct text-based location search, but you can structure your data to support this
      query = query.where("location", "==", req.query.location);
    }

    const snapshot = await query.get();
    if (snapshot.empty) return res.status(404).json({ message: "No physiotherapists found." });

    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
