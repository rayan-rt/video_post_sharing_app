import mongoose from "mongoose";

export async function DBconnection() {
  try {
    console.log("DB connecting...");
    let connectionInstance = await mongoose.connect(
      `${process.env.DB_URL}/${process.env.DB_NAME}`
    );
    console.log(`DB connected on ${connectionInstance.connection.host}`);
  } catch (error) {
    console.log("DB connection failed!", error);
    process.exit(1);
  }
}
