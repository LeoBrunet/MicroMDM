import express, { Request, Response } from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// API to send MDM command
app.post('/send-command', async (req: Request, res: Response): Promise<void> => {
    const { udid, requestType } = req.body;
  
    if (!udid || !requestType) {
      res.status(400).json({ error: 'UDID and Request Type are required' });
      return;
    }
  
    try {
      const response = await axios.post(
        `${process.env.SERVER_URL}/v1/commands`,
        {
          udid,
          request_type: requestType,
        },
        {
          auth: {
            username: 'micromdm',
            password: process.env.API_TOKEN || '',
          },
        }
      );
  
      res.json({ message: 'Command sent successfully', data: response.data });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({
        error: 'Failed to send command',
        details: error.response?.data || error.message,
      });
    }
  });
  

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
