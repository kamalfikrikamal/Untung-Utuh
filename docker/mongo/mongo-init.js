// MongoDB initialization script — runs on first container start
// Sets up database user and initial collections

const dbName = process.env.MONGO_INITDB_DATABASE || 'mernapp';
const db = db.getSiblingDB(dbName);

// Create app user with least-privilege access
db.createUser({
  user: process.env.MONGO_APP_USER || 'mernapp_user',
  pwd: process.env.MONGO_APP_PASSWORD || 'CHANGE_THIS_PASSWORD',
  roles: [
    { role: 'readWrite', db: dbName },
  ],
});

// Create indexes for User collection
db.createCollection('users');
db.users.createIndex({ email: 1 }, { unique: true });
db.users.createIndex({ createdAt: 1 });

print(`MongoDB initialized: database "${dbName}" and user created.`);
