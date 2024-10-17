var express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
var router = express.Router();

const mongoConfig = require('./mongoConfig.json');
const uri = mongoConfig.uri;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function connectToMongo() {
    try {
        await client.connect();
        console.log("Connected to MongoDB!");
        return client.db("Fall24LikeLion");
    } catch (err) {
        console.error('Failed to connect to MongoDB', err);
    }
}

router.get('/', async (req, res) => {
  const { course } = req.body; 

  if (!course) {
      return res.status(400).send('Course query parameter is required.');
  }

  try {
      const db = await connectToMongo();
      const collection = db.collection('course');

      // Search for courses with names starting with the given string (case-insensitive)
      const regex = new RegExp(`^${course}`, 'i');
      const results = await collection.find({ course_name: { $regex: regex } }).toArray();

      if (results.length === 0) {
          return res.status(404).send('No matching courses found.');
      }

      res.status(200).send(results);
  } catch (error) {
      console.error('Error fetching courses:', error);
      res.status(500).send('Internal server error.');
  }

});

module.exports = router;
