import { connectDatabase, insertDocument } from '../../helpers/db-util';

async function handler(req, res) {
  if (req.method === 'POST') {
    const userEmail = req.body.email;

    // TODO: robust email validation check
    if (!userEmail || !userEmail.includes('@')) {
      return res.status(422).json({ message: 'Invalid email address.' });
    }

    let client;
    try {
      client = await connectDatabase();
    } catch (error) {
      return res.status(500).json({ message: 'Failed to connect to database' });
    }

    try {
      await insertDocument(client, 'newsletter', { email: userEmail });
    } catch (error) {
      return res.status(500).json({ message: 'Write to database failed' });
    } finally {
      client.close();
    }
  }

  res.status(201).json({ message: 'Signed up!' });
}

export default handler;
