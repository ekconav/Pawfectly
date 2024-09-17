const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();

// Enable CORS for requests from the frontend (localhost:3000)
app.use(cors({
  origin: 'http://localhost:3000', // Change this to your frontend's origin in production
}));

app.use(bodyParser.json());

// Initialize Firebase Admin SDK
const serviceAccount = require('./pawfectlyadaptable-firebase-adminsdk-apxs8-5cd2844e13.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Route to delete a user
app.delete('/deleteUser/:uid', async (req, res) => {
  const uid = req.params.uid;

  try {
    // Delete the user from Firebase Authentication
    await admin.auth().deleteUser(uid);

    // Send a response indicating success
    res.status(200).send({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send({ error: 'Failed to delete user' });
  }
});

// Start the server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
