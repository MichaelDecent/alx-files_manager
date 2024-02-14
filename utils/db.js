#!/usr/bin/node

const { MongoClient, ObjectId } = require('mongodb');
const sha1 = require('sha1');

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || '127.0.0.1';
    const port = process.env.DB_PORT || 27017;

    this.db = process.env.DB_DATABASE || 'files_manager';

    const url = `mongodb://${host}:${port}`;

    this.client = new MongoClient(url, { useUnifiedTopology: true });

    this.connected = false;

    this.client.connect()
      .then(() => {
        this.connected = true;
      })
      .catch((error) => {
        console.error(error);
      });
  }

  isAlive() {
    return this.connected;
  }

  async nbUsers() {
    try {
      await this.client.connect();
      const usersCount = await this.client.db(this.db).collection('users').countDocuments();
      return usersCount;
    } catch (error) {
      console.error('Error counting documents in users collection:', error);
      return null;
    }
  }

  async nbFiles() {
    try {
      await this.client.connect();
      const filesCount = await this.client.db(this.db).collection('files').countDocuments();
      return filesCount;
    } catch (error) {
      console.error('Error counting documents in users collection:', error);
      return null;
    }
  }

  async createUser(email, password) {
    try {
      await this.client.connect();
      const newUser = { email, password: sha1(password) };
      const user = await this.client.db(this.db).collection('users').insertOne(newUser);
      return user;
    } catch (error) {
      console.error('Error craeting new user');
      return null;
    }
  }

  async getUserByEmail(email) {
    try {
      await this.client.connect();
      const user = await this.client.db(this.db).collection('users').findOne({ email });
      return user;
    } catch (error) {
      console.error('Error getting user by email: ', error);
      return null;
    }
  }

  async getUserById(id) {
    const _id = ObjectId(id);
    await this.client.connect();
    const user = await this.client.db(this.db).collection('users').findOne({ _id });
    if (!user) {
      return null;
    }
    return user;
  }

  async checkExistingEmail(email) {
    const user = await this.getUserByEmail(email);
    if (user) {
      return true;
    }
    return false;
  }
}

const dbClient = new DBClient();

module.exports = dbClient;
