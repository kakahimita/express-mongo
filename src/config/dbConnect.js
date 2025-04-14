import mongoose, { mongo } from "mongoose";

async function conectaNaDatabase() {
    mongoose.connect("mongodb+srv://luismachadodev95:admin123@cluster0.honjlwr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");

    return mongoose.connection;
};

export default conectaNaDatabase;