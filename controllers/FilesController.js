#!/usr/bin/node

const { v4: uuidv4 } = require('uuid');
const { mkdir, writeFile, existsSync } = require('fs');
const { ObjectId } = require('mongodb');
const path = require('path');
const { promisify } = require('util');
const dbClient = require('../utils/db');

const VALID_FILE_TYPE = ['folder', 'file', 'image'];

const mkdirAsync = promisify(mkdir);
const writeFileAsync = promisify(writeFile);

class FilesController {
  static async postUpload(request, response) {
    const token = request.headers['x-token'];
    const user = await dbClient.getUserByToken(token);
    if (!user) {
      response.status(401).json({ error: 'Unauthorized' });
      response.end();
    }

    const {
      name, type, parentId = 0, isPublic = false, data,
    } = request.body;

    if (!name) {
      response.status(400).json({ error: 'Missing Name' });
      response.end();
    }
    if (!type || !VALID_FILE_TYPE.includes(type)) {
      response.status(400).json({ error: 'Missing type' });
      response.end();
    }
    if (!data && type !== 'folder') {
      response.status(400).json({ error: 'Missing data' });
      response.end();
    }
    if (parentId !== 0) {
      const file = dbClient.getFileById(parentId);
      if (!file) {
        response.status(400).json({ error: 'Parent not found' });
        response.end();
      }
      if (file.type !== 'folder') {
        response.status(400).json({ error: 'Parent is not a folder' });
        response.end();
      }
    }
    let localPath;
    if (type !== 'folder') {
      const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';

      const filename = uuidv4();

      if (!existsSync(folderPath)) {
        await mkdirAsync(folderPath, { recursive: true });
      }

      localPath = path.join(folderPath, filename);

      const fileData = Buffer.from(data, 'base64');
      await writeFileAsync(localPath, fileData);
    }

    localPath = type !== 'folder' ? localPath : undefined;
    const newFile = await dbClient.createFile(user._id.toString(), name, type,
      parentId, isPublic, localPath);
    console.log(newFile);
    if (!newFile) {
      response.status(502).json({ error: 'Error creating a file' });
      response.end();
    }
    const fileData = {
      id: ObjectId(newFile._id),
      userId: user._id.toString(),
      name,
      type,
      isPublic,
      parentId,
    };

    response.status(201).json(fileData);
    response.end();
  }
}

module.exports = FilesController;
