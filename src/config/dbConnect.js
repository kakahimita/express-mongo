import mongoose, { mongo } from "mongoose";

async function conectaNaDatabase() {
  mongoose.connect(process.env.DB_CONNCECTION_STRING);
  return mongoose.connection;
};

export default conectaNaDatabase;