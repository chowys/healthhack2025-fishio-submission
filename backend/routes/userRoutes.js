const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();
const userCollection = db.collection('users');

// Create a new user
router.post('/', async (req, res) => {
  try {
    console.log('Received POST request for /users');
    const user = {
      user_id,
      user_name,
      user_gender,
      user_address,
      primaryInjury,
      duration_of_condition,
      user_goals,
      preferred_physio_specialty,
      user_email,
      user_password
    };
    console.log('User:', user);
    await userCollection.doc(user_id).set(user);
    res.status(201).send({ message: 'User created successfully', user });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create user', details: error.message });
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const usersSnapshot = await userCollection.get();

    // If no users are found
    if (usersSnapshot.empty) {
      return res.status(404).send({ error: 'No users found' });
    }

    // Map over the documents to extract user data
    const users = usersSnapshot.docs.map(doc => doc.data());

    res.status(200).send({ users });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch users', details: error.message });
  }
});


// Get a user by ID
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const userDoc = await userCollection.doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).send({ error: 'User not found' });
    }

    res.status(200).send({ user: userDoc.data() });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch user', details: error.message });
  }
});

// Update a user by ID
router.put('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const updateData = req.body;

    updateData.updated_at = admin.firestore.FieldValue.serverTimestamp();

    await userCollection.doc(userId).update(updateData);
    res.status(200).send({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update user', details: error.message });
  }
});

// Delete a user by ID
router.delete('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    await userCollection.doc(userId).delete();
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete user', details: error.message });
  }
});

module.exports = router;
