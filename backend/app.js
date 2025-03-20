// Ensure all required modules are loaded
require('dotenv').config(); // Load environment variables
const cors = require('cors');
const express = require('express');
const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase first
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

admin.initializeApp({
  credential: admin.credential.cert(require(path.resolve(serviceAccountPath))),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
});


//middleware
const app = express();
app.use(express.json());
app.use(cors());

//import routes
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const physioClinicRoutes = require('./routes/physioClinicRoutes');
const physioTherapistRoutes = require('./routes/physioTherapistRoutes');
const recoveryPlanRoutes = require('./routes/recoveryPlanRoutes');
const exercisePlanRoutes = require('./routes/exercisePlanRoutesNew');
const exerciseRoutes = require('./routes/exerciseRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const weeklyPlanRoutes = require('./routes/weeklyPlanRoutes');
const indivExerciseRoutes = require('./routes/indivExerciseRoutes');
const bookingRoutes = require('./routes/initialBookingRoutes');

//default routes
app.get('/', (req, res) => {
  res.send('Hello, world! Server is running.');
});

// Use user-related routes
app.use('/users', userRoutes);
app.use('/reviews', reviewRoutes);
app.use('/physioClinics', physioClinicRoutes);
app.use('/physioTherapists', physioTherapistRoutes);
app.use('/recoveryPlans', recoveryPlanRoutes);
app.use('/exercisePlans', exercisePlanRoutes);

app.use('/exercises', exerciseRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/payments', paymentRoutes);
app.use('/indivExercise', indivExerciseRoutes);
app.use('/weeklyPlans', weeklyPlanRoutes);
app.use('/booking', bookingRoutes)


// Start the server on a specific port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
