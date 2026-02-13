import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // 'my_local_db' can be any name you want for your database
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/cali-ascension');
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;