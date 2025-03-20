const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();
const appointmentCollection = db.collection('appointments');
const bookingCollection = db.collection('initial_booking');

// Create a new Appointment
router.post('/', async (req, res) => {
  try {
    const {
      physioTherapist_id,
      user_id,
      physioClinic_id,
      appointment_description,
      appointment_date,
      appointment_end,
      recoveryPlan_id = "",
      appointment_status
    } = req.body;

    const appointment = {
      physioTherapist_id,
      user_id,
      physioClinic_id,
      appointment_description,
      appointment_date,
      appointment_end,
      appointment_status,
      recoveryPlan_id,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await appointmentCollection.add(appointment);

    res.status(201).send({
      message: 'Appointment created successfully',
      appointment_id: docRef.id
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create Appointment', details: error.message });
  }
});

// Get all Appointments
router.get('/', async (req, res) => {
  try {
    const snapshot = await appointmentCollection.get();
    if (snapshot.empty) {
      return res.status(404).send({ error: 'No Appointments found' });
    }

    const appointments = [];
    snapshot.forEach(doc => {
      appointments.push({ appointment_id: doc.id, ...doc.data() });
    });

    res.status(200).send({ appointments });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Appointments', details: error.message });
  }
});

// Get an Appointment by ID
router.get('/getAppointmentById/:appointmentId', async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const doc = await appointmentCollection.doc(appointmentId).get();

    if (!doc.exists) {
      return res.status(404).send({ error: 'Appointment not found' });
    }

    res.status(200).send({ appointment_id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Appointment', details: error.message });
  }
});

// Update an Appointment
router.put('/:appointmentId', async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const {
      physioTherapist_id,
      user_id,
      physioClinic_id,
      appointment_title,
      appointment_description,
      appointment_date,
      appointment_status,
      recoveryPlan_id
    } = req.body;

    const updatedAppointment = {
      physioTherapist_id,
      user_id,
      physioClinic_id,
      appointment_title,
      appointment_description,
      appointment_date,
      appointment_status,
      recoveryPlan_id,
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    await appointmentCollection.doc(appointmentId).update(updatedAppointment);

    res.status(200).send({
      message: 'Appointment updated successfully',
      appointment_id: appointmentId
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update Appointment', details: error.message });
  }
});

// Delete an Appointment
router.delete('/:appointmentId', async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;

    await appointmentCollection.doc(appointmentId).delete();

    res.status(200).send({
      message: 'Appointment deleted successfully',
      appointment_id: appointmentId
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to delete Appointment', details: error.message });
  }
});


router.get('/getUserByAppointment/:appointmentId', async (req, res) => {
  try {
    const appointmentDoc = await appointmentCollection.doc(req.params.appointmentId).get();
    if (!appointmentDoc.exists) {
      return res.status(404).send({ error: 'Appointment not found' });
    }
    const appointment = appointmentDoc.data();
    const userDoc = await db.collection('users').doc(appointment.user_id).get();
    if (!userDoc.exists) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send({ user: userDoc.data() });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch User for Appointment', details: error.message });
  }
});

// Get PhysioClinic by Appointment
router.get('/getPhysioClinicByAppointment/:appointmentId', async (req, res) => {
  try {
    const appointmentDoc = await appointmentCollection.doc(req.params.appointmentId).get();
    if (!appointmentDoc.exists) {
      return res.status(404).send({ error: 'Appointment not found' });
    }
    const appointment = appointmentDoc.data();
    const physioClinicDoc = await db.collection('physioClinics').doc(appointment.physioClinic_id).get();
    if (!physioClinicDoc.exists) {
      return res.status(404).send({ error: 'PhysioClinic not found' });
    }
    res.status(200).send({ physioClinic: physioClinicDoc.data() });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch PhysioClinic for Appointment', details: error.message });
  }
});

// Get PhysioTherapist by Appointment
router.get('/getPhysioTherapistByAppointment/:appointmentId', async (req, res) => {
  try {
    const appointmentDoc = await appointmentCollection.doc(req.params.appointmentId).get();
    if (!appointmentDoc.exists) {
      return res.status(404).send({ error: 'Appointment not found' });
    }
    const appointment = appointmentDoc.data();
    const physioTherapistDoc = await db.collection('physioTherapists').doc(appointment.physioTherapist_id).get();
    if (!physioTherapistDoc.exists) {
      return res.status(404).send({ error: 'PhysioTherapist not found' });
    }
    res.status(200).send({ physioTherapist: physioTherapistDoc.data() });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch PhysioTherapist for Appointment', details: error.message });
  }
});

 // get appointment by physiotherapist id
 router.get('/getAppointmentByPhysioTherapist', async (req, res) => {
  const physioTherapist_id = req.query.physioTherapist_id;
  console.log("physioTherapist_id", physioTherapist_id);
  console.log("hi");
  try {
    const snapshot = await appointmentCollection.where('physioTherapist_id', '==', physioTherapist_id).get();
    if (snapshot.empty) {
      return res.status(404).send({ error: 'No Appointments found' });
    }
    const patientDict = {};
    const userPromises = snapshot.docs.map(doc => {
      console.log("doc", doc.data());
      const userId = doc.data().user_id;
      if (!userId) return null; 
      return db.collection('users').doc(userId).get();
    });
    const userDocs = await Promise.all(userPromises);
    console.log("userDocs", userDocs);
    userDocs.forEach(doc => {
      if (!doc) return;
      if (!(doc.id in patientDict)) {
        patientDict[doc.id] = {
          user_id: doc.id,
          user_name: doc.data().user_name,
          user_email: doc.data().user_email,
          user_address: doc.data().user_address,
          preferred_physio_specialty: doc.data().preferred_physio_specialty,
          user_goals: doc.data().user_goals,
        };
      }
    })

    const result = []
    snapshot.forEach(doc => {
      result.push({
        appointment_id: doc.id,
        ...doc.data(),
        patient: patientDict[doc.data().user_id]
      })
    })
    res.status(200).send({ appointments: result });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Appointments', details: error.message });
  }
})

// Create a new Appointment with date and time
router.post('/createAppointment', async (req, res) => {
  try {
    const {
      appointment_title,
      appointment_id,
      physioTherapist_id,
      user_id,
      physioClinic_id,
      appointment_description,
      appointment_date,
      appointment_end,
      appointment_status
    } = req.body;

    // Ensure start_datetime and end_datetime are valid
    if (!appointment_date || !appointment_end) {
      return res.status(400).send({ error: 'Start datetime and End datetime are required' });
    }

    const appointment = {
      appointment_title,
      appointment_id,
      physioTherapist_id,
      user_id,
      physioClinic_id,
      appointment_description,
      start_datetime: new Date(appointment_date), // Ensure proper Date format
      end_datetime: new Date(appointment_end),     // Ensure proper Date format
      appointment_status,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
      updated_at: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await appointmentCollection.add(appointment);

    // Explicitly add the auto-generated ID as exercisePlan_id in the Firestore document
    const appointmentWithId = {
      ...appointment,
      appointment_id: docRef.id // Add the generated ID explicitly to the document
    };

    // Now update the document with the new field "exercisePlan_id"
    await docRef.update({ appointment_id: docRef.id });

    res.status(201).send({
      message: 'Appointment created successfully',
      appointment_id: docRef.id
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to create Appointment with datetime', details: error.message });
  }
});

//Make an appointment with a physiotherapist
//1. Get all appointments by physio ID'
//2. CHECK IF THE PHYSIO timeslot is available
//3. If available, make an appointment and update the timeslot to unavailable
//4. If not available, return an error message or grey out button
//5. Get all appointments by user ID
//6. Display all appointments by user ID
//7. Add in the new appointment id

router.get('/getAppointmentByPhysio/:physioTherapistId', async (req, res) => {
  try {
    console.log("physioTherapistId", req.params.physioTherapistId);
    const physioTherapistId = req.params.physioTherapistId;
    const snapshot = await appointmentCollection.where('physioTherapist_id', '==', physioTherapistId).get();
    console.log("snapshot", snapshot);
    if (snapshot.empty) {
      return res.status(404).send({ error: 'No Appointments found' });
    }

    const appointments = [];
    snapshot.forEach(doc => {
      appointments.push({ appointment_id: doc.id, ...doc.data() });
    });

    res.status(200).send({ appointments });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Appointments', details: error.message });
  }
});

// Get appointments by physio ID, start date and time, end date and time
// •	If the client is in Singapore (UTC+8):
// •	Input: 2025-03-10T09:00:00+08:00
// •	API converts to UTC: 2025-03-10T01:00:00.000Z
// •	Firestore queries correctly in UTC.


//frontend call code
// const fetchAppointments = async () => {
//   const physioTherapistId = "12345";

//   // Define the start and end time in Singapore Time (UTC+8)
//   const startDateLocal = new Date("2025-03-10T17:00:00+08:00"); // 5 PM UTC+8
//   const endDateLocal = new Date("2025-03-10T18:00:00+08:00"); // 6 PM UTC+8

//   // Convert to UTC format before sending
//   const startDateUTC = startDateLocal.toISOString(); // "2025-03-10T09:00:00.000Z"
//   const endDateUTC = endDateLocal.toISOString(); // "2025-03-10T10:00:00.000Z"

//   const url = `http://localhost:3000/appointments/getAvailableAppointmentsByPhysio/${physioTherapistId}/${startDateUTC}/${endDateUTC}`;

//   try {
//     const response = await fetch(url);
//     const data = await response.json();
//     console.log("Appointments:", data);
//   } catch (error) {
//     console.error("Error fetching appointments:", error);
//   }
// };

router.get('/getCurrentAppointmentsByPhysio/:physioTherapistId/:startDate/:endDate', async (req, res) => {
  try {
    const physioTherapistId = req.params.physioTherapistId;

    // Convert input dates (from client) to proper UTC Date objects
    const startDate = new Date(req.params.startDate); // Input format: "YYYY-MM-DDTHH:mm:ss+08:00"
    const endDate = new Date(req.params.endDate);

    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).send({ error: 'Invalid date format. Use ISO 8601 format (YYYY-MM-DDTHH:mm:ss+08:00).' });
    }

    console.log(`Querying appointments from ${startDate.toISOString()} to ${endDate.toISOString()}`);

    const snapshot = await appointmentCollection
      .where('physioTherapist_id', '==', physioTherapistId)
      .where('start_datetime', '>=', startDate)
      .where('end_datetime', '<=', endDate)
      .get();

    if (snapshot.empty) {
      return res.status(404).send({ error: 'No Appointments found' });
    }

    const appointments = [];
    snapshot.forEach(doc => {
      appointments.push({ appointment_id: doc.id, ...doc.data() });
    });

    res.status(200).send({ appointments });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch Appointments', details: error.message });
  }
});


// Get all unavailable dates for a given Physiotherapist (all initial bookings and appts)
router.get('/getBookedDatesByPhysio/:physioTherapistId', async (req, res) => {
  try {
    const physioTherapistId = req.params.physioTherapistId;

    // Fetch all appointments for the given physiotherapist
    const appointmentSnapshot = await appointmentCollection
      .where('physioTherapist_id', '==', physioTherapistId)
      .get();

    let bookedDates = new Set();

    // Add appointment dates to bookedDates
    appointmentSnapshot.forEach(doc => {
      const appointment = doc.data();
      const appointmentDate = new Date(appointment.start_datetime.toDate()).toISOString().split('T')[0]; // Extract YYYY-MM-DD
      bookedDates.add(appointmentDate);
    });

    // Fetch all bookings for the given physiotherapist
    const bookingSnapshot = await bookingCollection
      .where('physioTherapist_id', '==', physioTherapistId)
      .get();

    // Add booking dates to bookedDates
    bookingSnapshot.forEach(doc => {
      const booking = doc.data();
      const bookingDate = new Date(booking.booking_date.toDate()).toISOString().split('T')[0]; // Extract YYYY-MM-DD
      bookedDates.add(bookingDate);
    });

    res.status(200).send({ bookedDates: Array.from(bookedDates) });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch booked dates', details: error.message });
  }
});

// get user by appointment id
router.get('/getUserByAppointment/:appointmentId', async (req, res) => {
  try {
    const appointmentDoc = await appointmentCollection.doc(req.params.appointmentId).get();
    if (!appointmentDoc.exists) {
      return res.status(404).send({ error: 'Appointment not found' });
    }
    const appointment = appointmentDoc.data();
    const userDoc = await db.collection('users').doc(appointment.user_id).get();
    if (!userDoc.exists) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send({ user: userDoc.data() });
  } catch (error) {
    res.status(500).send({ error: 'Failed to fetch User for Appointment', details: error.message });
  }
});

// update appointment status
router.put('/updateAppointmentStatus/:appointmentId', async (req, res) => {
  try {
    const appointmentId = req.params.appointmentId;
    const { appointment_status, recoveryPlan_id  } = req.body;
    console.log("appointment_status", appointment_status);
    console.log("recoveryPlan_id", recoveryPlan_id);
    console.log("appointmentId", appointmentId);
    await appointmentCollection.doc(appointmentId).update({ 
      appointment_status,
      recoveryPlan_id,
    });
    res.status(200).send({
      message: 'Appointment status updated successfully',
    });
  } catch (error) {
    res.status(500).send({ error: 'Failed to update Appointment status', details: error.message });
  }
});

module.exports = router;




