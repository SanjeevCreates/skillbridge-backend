import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect('mongodb+srv://sanjeevmaddukuri07_db_user:3Ol4uX1AdHo58zhI@cluster0.jjvwjj6.mongodb.net/SkillBridge');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
