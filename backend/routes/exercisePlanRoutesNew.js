const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();
const exercisePlanCollection = db.collection('exercisePlans');
const exercisesCollection = db.collection('exercises');

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

// Get an Exercise Plan by Appointment ID
router.get('/getByAppointmentId/:appointmentId', async (req, res) => {
  try {
    console.log(req.params); // Debugging step
    const { appointmentId } = req.params; // Extract the actual appointmentId
    console.log("Extracted appointmentId:", appointmentId); // Debugging step
    
    const snapshot = await exercisePlanCollection
      .where("appointment_id", "==", appointmentId)
      .get();
    
    // Check if snapshot is empty
    if (snapshot.empty) {
      return res.status(404).send({ error: 'Exercise Plan not found' });
    }

    // Since there should only be one result, get the first document
    const doc = snapshot.docs[0]; // Get the first matching document
    
    // Return the data from the first document
    res.status(200).send({
      exercisePlan_id: doc.id,
      ...doc.data(),
    });

  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Exercise Plan', details: error.message });
  }
});

// 📌 Create a new Exercise Plan (Linked to a Recovery Plan)
router.post('/create', async (req, res) => {
  try {
    const { recoveryPlan_id, physioTherapist_id, physioClinic_id, exercisePlan_name, exercisePlan_description, exercisePlan_endDate, exercisePlan_status, exercises } = req.body;

    if (!recoveryPlan_id || !physioTherapist_id || !physioClinic_id || !exercisePlan_name || !exercisePlan_description || !exercisePlan_endDate || !exercisePlan_status || !exercises) {
      return res.status(400).send({ error: 'Missing required fields' });
    }

    const exercisePlan = {
      recoveryPlan_id: String(recoveryPlan_id),
      physioTherapist_id: String(physioTherapist_id),
      physioClinic_id: String(physioClinic_id),
      exercisePlan_name,
      exercisePlan_description,
      exercisePlan_endDate: new Date(exercisePlan_endDate),
      exercisePlan_status,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
      progress: [] // Format: [{ date: 'YYYY-MM-DD', exercise_id: 'exercise_id', completed: true }]
    };

    const docRef = await exercisePlanCollection.add(exercisePlan);

    const exerciseRefs = [];
    for (const exercise of exercises) {
      const exerciseDoc = await exercisesCollection.add({
        name: exercise.name,
        description: exercise.description || '',
        created_at: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp()
      });
      exerciseRefs.push(exerciseDoc.id);
    }

    await docRef.update({
      exercises: exerciseRefs
    });

    res.status(201).send({ message: 'Exercise Plan created successfully', exercise_plan_id: docRef.id });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create Exercise Plan', details: error.message });
  }
});

// 📌 Update Patient Progress (Individual Exercise Tracking)
router.put('/updateProgress/:exercise_plan_id', async (req, res) => {
  try {
    const { exercise_plan_id } = req.params;
    const { date, exercise_id, completed } = req.body; // Format: { date: 'YYYY-MM-DD', exercise_id: 'exercise_id', completed: true }

    if (!date || !exercise_id || completed === undefined) {
      return res.status(400).send({ error: 'Missing required fields' });
    }

    const docRef = exercisePlanCollection.doc(exercise_plan_id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ error: 'No Exercise Plan found' });
    }

    let progress = doc.data().progress || [];
    
    // Check if progress already exists for this exercise on this date
    const existingIndex = progress.findIndex(p => p.date === date && p.exercise_id === exercise_id);

    if (existingIndex !== -1) {
      progress[existingIndex].completed = completed;
    } else {
      progress.push({ date, exercise_id, completed });
    }

    await docRef.update({
      progress,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    });

    res.status(200).send({ message: 'Progress updated successfully' });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update progress', details: error.message });
  }
});

// 📌 Fetch Progress for an Exercise Plan
router.get('/getProgress/:exercise_plan_id', async (req, res) => {
  try {
    const { exercise_plan_id } = req.params;
    
    const doc = await exercisePlanCollection.doc(exercise_plan_id).get();

    if (!doc.exists) {
      return res.status(404).send({ error: 'No Exercise Plan found' });
    }

    res.status(200).send({ progress: doc.data().progress });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch progress', details: error.message });
  }
});


// router.post('/create2', async (req, res) => {
//   try {
//     const { recoveryPlan_id, physioTherapist_id, physioClinic_id, exercisePlan_name, exercisePlan_description, exercisePlan_startDate, exercisePlan_endDate, exercisePlan_status, exercises } = req.body;

//     if (!recoveryPlan_id || !physioTherapist_id || !physioClinic_id || !exercisePlan_name || !exercisePlan_description || !exercisePlan_endDate || !exercisePlan_status || !exercises) {
//       return res.status(400).send({ error: 'Missing required fields' });
//     }

//     const exercisePlan = {
//       recoveryPlan_id: String(recoveryPlan_id),
//       physioTherapist_id: String(physioTherapist_id),
//       physioClinic_id: String(physioClinic_id),
//       exercisePlan_name,
//       exercisePlan_description,
//       exercisePlan_startDate: new Date(exercisePlan_startDate),
//       exercisePlan_endDate: new Date(exercisePlan_endDate),
//       exercisePlan_status,
//       created_at: admin.firestore.FieldValue.serverTimestamp(),
//       updated_at: admin.firestore.FieldValue.serverTimestamp(),
//       progress: [],
//       exercises: exercises
//     };

//     const docRef = await exercisePlanCollection.add(exercisePlan);

//     res.status(201).send({ message: 'Exercise Plan created successfully', exercise_plan_id: docRef.id });
//   } catch (error) {
//     res.status(500).send({ error: 'Failed to create Exercise Plan', details: error.message });
//   }
// });

// router.post('/create3', async (req, res) => {
//   try {
//     const { recoveryPlan_id, physioTherapist_id, physioClinic_id, exercisePlan_name, exercisePlan_description, exercisePlan_startDate, exercisePlan_endDate, exercisePlan_status, exercises } = req.body;

//     if (!recoveryPlan_id || !physioTherapist_id || !physioClinic_id || !exercisePlan_name || !exercisePlan_description || !exercisePlan_endDate || !exercisePlan_status || !exercises) {
//       return res.status(400).send({ error: 'Missing required fields' });
//     }

//     // Convert exercises list into a map format { date: { exercise_name: "uncompleted" } }
//     const formattedExercises = {};
    
//     exercises.forEach(({ date, exercise_name }) => {
//       if (!formattedExercises[date]) {
//         formattedExercises[date] = {};  // Initialize if the date is not already present
//       }
//       formattedExercises[date][exercise_name] = "uncompleted"; // Default status
//     });

//     const exercisePlan = {
//       recoveryPlan_id: String(recoveryPlan_id),
//       physioTherapist_id: String(physioTherapist_id),
//       physioClinic_id: String(physioClinic_id),
//       exercisePlan_name,
//       exercisePlan_description,
//       exercisePlan_startDate: new Date(exercisePlan_startDate),
//       exercisePlan_endDate: new Date(exercisePlan_endDate),
//       exercisePlan_status,
//       created_at: admin.firestore.FieldValue.serverTimestamp(),
//       updated_at: admin.firestore.FieldValue.serverTimestamp(),
//       exercises: formattedExercises, // Store exercises in the required format
//     };

//     const docRef = await exercisePlanCollection.add(exercisePlan);

//     res.status(201).send({ message: 'Exercise Plan created successfully', exercise_plan_id: docRef.id });
//   } catch (error) {
//     res.status(500).send({ error: 'Failed to create Exercise Plan', details: error.message });
//   }
// });

router.post('/create3', async (req, res) => {
  try {
    const { appointment_id, physioTherapist_id, physioClinic_id, exercisePlan_name, exercisePlan_description, exercisePlan_startDate, exercisePlan_endDate, exercisePlan_status, exercises } = req.body;
    console.log(req.body);
    // search through appointment collection to get the recoveryPlan_id
    const appointmentDoc = await db.collection('appointments').doc(appointment_id).get();
    const recoveryPlan_id = appointmentDoc.data().recoveryPlan_id;
    console.log(recoveryPlan_id);
    if (!physioTherapist_id || !recoveryPlan_id || !physioClinic_id || !exercisePlan_name || !exercisePlan_description || !exercisePlan_endDate || !exercisePlan_status || !exercises) {
      return res.status(400).send({ error: 'Missing required fields' });
    }

    // Convert exercises list into a map format { date: { exercise_name: "uncompleted" } }
    const formattedExercises = {};
    
    exercises.forEach(({ date, exercise_name }) => {
      if (!formattedExercises[date]) {
        formattedExercises[date] = {};  // Initialize if the date is not already present
      }
      formattedExercises[date][exercise_name] = "uncompleted"; // Default status
    });

    const exercisePlan = {
      appointment_id: String(appointment_id),
      recoveryPlan_id: String(recoveryPlan_id),
      physioTherapist_id: String(physioTherapist_id),
      physioClinic_id: String(physioClinic_id),
      exercisePlan_name,
      exercisePlan_description,
      exercisePlan_startDate: new Date(exercisePlan_startDate),
      exercisePlan_endDate: new Date(exercisePlan_endDate),
      exercisePlan_status,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
      exercises: formattedExercises, // Store exercises in the required format
    };

    // Add the exercise plan to Firestore and get the generated ID
    const docRef = await exercisePlanCollection.add(exercisePlan);

    // Explicitly add the auto-generated ID as exercisePlan_id in the Firestore document
    const exercisePlanWithId = {
      ...exercisePlan,
      exercisePlan_id: docRef.id // Add the generated ID explicitly to the document
    };

    // Now update the document with the new field "exercisePlan_id"
    await docRef.update({ exercisePlan_id: docRef.id });


    // Return the auto-generated exercise plan ID in the response
    res.status(201).send({ 
      message: 'Exercise Plan created successfully', 
      exercise_plan_id: docRef.id ,// Use the generated ID from Firestore
      exercisePlan: exercisePlanWithId // Return the full exercise plan data 
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create Exercise Plan', details: error.message });
  }
});

// update exercise plan exercises
// exerciseObject = {
//   [date] : {
//     [exercise_id] : "completed"
//   }
// }
router.put('/update-exercises', async (req, res) => {
  try {
    const { exercisePlan_id, exerciseObject } = req.body;
    const docRef = exercisePlanCollection.doc(exercisePlan_id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ error: 'Exercise Plan not found' });
    }

    const exerciseIds = new Set();
    for (const [date, exercises] of Object.entries(exerciseObject)) {
      for (const exercise_id of Object.keys(exercises)) {
        exerciseIds.add(exercise_id);
      }
    }
    const exerciseDocs = await exercisesCollection.where(admin.firestore.FieldPath.documentId(), 'in', Array.from(exerciseIds)).get();
    const validExerciseIds = new Set(exerciseDocs.docs.map(doc => doc.id));

    if (exerciseIds.size !== validExerciseIds.size) {
      return res.status(404).send({ error: 'Exercise not found' });
    }

    let updatedExercises = doc.data().exercises || {};

    for (const [date, exercise_id_key] of Object.entries(exerciseObject)) {
      if (!updatedExercises[date]) {
        updatedExercises[date] = {};
      }
      for (const [exercise_id, status] of Object.entries(exercise_id_key)) {
        updatedExercises[date][exercise_id] = status;
      }
    }

    await docRef.update({ exercises: updatedExercises });

  } catch (error) {
    res.status(500).send({ error: 'Failed to update exercise plan exercises', details: error.message });
  }
});

// add exercise to exercise plan
router.put('/add-exercise', async (req, res) => {
  try {
    const { exercisePlan_id, date, exercise_id, status } = req.body;
    const docRef = exercisePlanCollection.doc(exercisePlan_id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).send({ error: 'Exercise Plan not found' });
    }

    const exerciseDoc = await exercisesCollection.doc(exercise_id).get();
    if (!exerciseDoc.exists) {
      return res.status(404).send({ error: 'Exercise not found' });
    }
    const exercise = exerciseDoc.data();
    const updatedExercises = doc.data().exercises || {};

    if (!updatedExercises[date]) {
      updatedExercises[date] = {};
    }

    updatedExercises[date][exercise_id] = {
      status,
      exercise_name: exercise.exercise_name,
      exercise_description: exercise.exercise_description,
    };

    await docRef.update({ exercises: updatedExercises });

    const updatedDoc = await docRef.get();  // Get the updated document

    res.status(200).send({ 
      message: 'Exercise added to Exercise Plan',
      exercisePlan: { exercisePlan_id: doc.id, ...updatedDoc.data() }
    });

  } catch (error) {
    res.status(500).send({ error: 'Failed to add exercise to Exercise Plan', details: error.message });
  }
});

router.put('/update-status', async (req, res) => {
  try {
    const { exercisePlan_id, date, exercise_name, status } = req.body;

    if (!exercisePlan_id || !date || !exercise_name || !status) {
      return res.status(400).send({ error: 'Missing required fields' });
    }

    // Get reference to the document
    const exercisePlanRef = exercisePlanCollection.doc(exercisePlan_id);
    const exercisePlanDoc = await exercisePlanRef.get();

    if (!exercisePlanDoc.exists) {
      return res.status(404).send({ error: 'Exercise Plan not found' });
    }

    const exercisePlanData = exercisePlanDoc.data();

    // Check if the date exists
    if (!exercisePlanData.exercises[date]) {
      return res.status(400).send({ error: 'Date not found in exercise plan' });
    }

    // Check if the exercise exists for the date
    if (!exercisePlanData.exercises[date][exercise_name]) {
      return res.status(400).send({ error: 'Exercise not found for the given date' });
    }

    // Update the status of the exercise
    const updatedExercises = {
      ...exercisePlanData.exercises,
      [date]: {
        ...exercisePlanData.exercises[date],
        [exercise_name]: status, // Update status to "completed" or "uncompleted"
      }
    };

    // Update Firestore
    await exercisePlanRef.update({ exercises: updatedExercises });

    res.status(200).send({ message: 'Exercise status updated successfully' });

  } catch (error) {
    res.status(500).send({ error: 'Failed to update exercise status', details: error.message });
  }
});

// get all exercise plans progress for a specific patient
router.get('/getExerciseProgress/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;

    console.log(patientId); // Debugging step
    // get all appointments for the patient
    const appointments = await db.collection('appointments').where('user_id', '==', patientId).get();
    const appointmentIds = appointments.docs.map(doc => doc.id);

    console.log(appointmentIds);

    // get all exercise plans for the appointments
    const exercisePlans = [];
    for (const appointmentId of appointmentIds) {
      const snapshot = await exercisePlanCollection.where('appointment_id', '==', appointmentId).get();
      snapshot.forEach(doc => {
        exercisePlans.push({ exercisePlan_id: doc.id, ...doc.data() });
      });
    }

    // get all exercises for each exercise plan
    let totalExercises = 0;
    let completedExercises = 0;
    exercisePlans.forEach(exercisePlan => {
      const exercises = exercisePlan.exercises;
      for (const date in exercises) {
        for (const exercise in exercises[date]) {
          totalExercises++;
          if (exercises[date][exercise] === 'completed' || exercises[date][exercise].status === 'completed') {
            completedExercises++;
          }
        }
      }
    })

    let percentage = totalExercises === 0 ? 0 : (completedExercises / totalExercises);
    res.status(200).send({ patientId, percentage });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Exercise Plans', details: error.message });
  }
});

// get top 5 most completed exercises

router.get('/getTopExercises/:physioTherapistId', async (req, res) => {
  try {
    const { physioTherapistId } = req.params;
    
    const snapshot = await exercisePlanCollection.where('physioTherapist_id', '==', physioTherapistId).get();
    if (snapshot.empty) {
      return res.status(404).send({ error: 'No Exercise Plans found' });
    }

    const exercises = {};
    snapshot.forEach(doc => {
        const data = doc.data();
        for (const date in data.exercises) {
            for (const exerciseKey in data.exercises[date]) {
                const exerciseData = data.exercises[date][exerciseKey];
                // Ensure exerciseData is an object
                if (typeof exerciseData === 'object') {
                    const exerciseName = exerciseData.exercise_name

                    if (!exercises[exerciseName]) {
                        exercises[exerciseName] = 0;
                    } 
                      if (exerciseData.status === 'completed') {
                        exercises[exerciseName]++;  
                    }
                } else {
                    if (!exercises[exerciseKey]) {
                        exercises[exerciseKey] = 0;
                    } 
                    if (exerciseData === 'completed') {
                      exercises[exerciseData]++;
                    }
                }
            }
        }
    });
  
    console.log(exercises);
    exerciseArray = Object.entries(exercises);
    exerciseArray.sort((a, b) => b[1] - a[1]); // Sort in descending order
    const topExercises = exerciseArray
      .slice(0, 5)
      .map(([exerciseName, count]) => ({ exerciseName, count }));
    res.status(200).send({ topExercises });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Exercise Plans', details: error.message });
  }
});

module.exports = router;
