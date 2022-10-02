// external imports
import mongoose from 'mongoose';
import {config} from 'dotenv';
config();


async function dbConnect() {
    mongoose.connect(
          process.env.MONGODB_URI,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }
      )
      .then(() => {
        console.log("Successfully connected to MongoDB Atlas!");
      })
      .catch((error) => {
        console.log("Unable to connect to MongoDB Atlas!");
        console.error(error);
      });
  }

export default dbConnect;