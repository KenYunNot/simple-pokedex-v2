import { MongoClient } from 'mongodb';

const connectionString = process.env.ATLAS_URI || "";

const client = new MongoClient('mongodb+srv://yunhaen:HC2M3zahEvQFHhUR@simple-pokedex-v2.jncndl5.mongodb.net/?retryWrites=true&w=majority');

let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db("simple-pokedex-v2");

export default db;