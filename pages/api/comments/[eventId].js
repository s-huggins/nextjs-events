import {
  connectDatabase,
  getAllDocuments,
  insertDocument
} from '../../../helpers/db-util';

async function handler(req, res) {
  const { eventId } = req.query;

  let client;
  try {
    client = await connectDatabase();
  } catch (error) {
    return res.status(500).json({ message: 'Failed to connect to database' });
  }

  if (req.method === 'POST') {
    const { email, name, text } = req.body;

    // basic validation, etc
    if (
      !email.includes('@') ||
      !name ||
      name.trim() === '' ||
      !text ||
      text.trim() === ''
    ) {
      res.status(422).json({ message: 'Invalid input.' });
      client.close();
      return;
    }

    const newComment = {
      email,
      name,
      text,
      eventId
    };

    let result;
    try {
      result = await insertDocument(client, 'comments', newComment);
      newComment._id = result.insertedId;

      res.status(201).json({ message: 'Added comment.', comment: newComment });
    } catch (error) {
      res.status(500).json({ message: 'Write to database failed' });
    }
  }

  if (req.method === 'GET') {
    let documents;

    try {
      documents = await getAllDocuments(client, 'comments', { _id: -1 });
      res.status(200).json({ comments: documents });
    } catch (error) {
      res.status(500).json({ message: 'Failed to get comments' });
    }
  }

  client.close();
}

export default handler;
