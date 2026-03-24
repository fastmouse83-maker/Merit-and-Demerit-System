import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Google Sheets Setup
  const getDoc = async () => {
    const serviceAccountKey = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}');
    const auth = new JWT({
      email: serviceAccountKey.client_email,
      key: serviceAccountKey.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID || '', auth);
    await doc.loadInfo();
    return doc;
  };

  // API Routes
  app.get('/api/proxy-image', async (req, res) => {
    const imageUrl = req.query.url as string;
    if (!imageUrl) return res.status(400).send('URL is required');

    try {
      const response = await axios.get(imageUrl, { 
        responseType: 'arraybuffer',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      const contentType = response.headers['content-type'] || 'image/jpeg';
      
      // Set cache headers for 2 weeks (1209600 seconds)
      res.setHeader('Cache-Control', 'public, max-age=1209600, immutable');
      res.setHeader('Content-Type', contentType);
      res.send(response.data);
    } catch (error: any) {
      console.error('Error proxying image:', error.message);
      res.status(500).send('Error fetching image');
    }
  });

  app.get('/api/data', async (req, res) => {
    try {
      const doc = await getDoc();
      
      const studentSheet = doc.sheetsByTitle['학생정보'];
      const pointItemSheet = doc.sheetsByTitle['상벌점항목'];
      const recordSheet = doc.sheetsByTitle['상벌점기록'];

      const studentRows = await studentSheet.getRows();
      const pointItemRows = await pointItemSheet.getRows();
      const recordRows = await recordSheet.getRows();

      const students = studentRows.map(row => {
        const url = row.get('사진URL') || '';
        // Convert Google Drive view links to direct image links if possible
        let photoUrl = url;
        if (url.includes('drive.google.com/uc?id=')) {
          const id = url.split('id=')[1]?.split('&')[0];
          if (id) photoUrl = `https://lh3.googleusercontent.com/d/${id}`;
        } else if (url.includes('drive.google.com/file/d/')) {
          const id = url.split('/d/')[1]?.split('/')[0];
          if (id) photoUrl = `https://lh3.googleusercontent.com/d/${id}`;
        }
        
        let finalPhotoUrl = photoUrl || row.get('사진이미지');
        if (finalPhotoUrl && (finalPhotoUrl.startsWith('http') || finalPhotoUrl.includes('drive.google.com'))) {
          finalPhotoUrl = `/api/proxy-image?url=${encodeURIComponent(finalPhotoUrl)}`;
        }
        
        return {
          id: row.get('학번'),
          name: row.get('이름'),
          photoUrl: finalPhotoUrl
        };
      });

      const pointItems = pointItemRows.map(row => {
        const rowObj = row.toObject();
        const keys = Object.keys(rowObj);
        
        // Find columns by index or name
        const id = row.get('항목코드') || rowObj[keys[0]] || '';
        const category = row.get('구분') || rowObj[keys[1]] || '';
        const content = row.get('상벌점내용') || row.get('내용') || row.get('항목') || rowObj[keys[2]] || '';
        const score = parseInt(row.get('점수') || rowObj[keys[3]]) || 0;

        return {
          id: id || Math.random().toString(36).substr(2, 9),
          category,
          content: content || '내용 없음',
          score,
          type: category === '상점' ? 'merit' : 'demerit'
        };
      });

      const records = recordRows.map(row => ({
        id: row.get('ID') || Math.random().toString(36).substr(2, 9),
        date: row.get('일시'),
        studentId: row.get('학번'),
        studentName: row.get('이름'),
        content: row.get('상벌점내용'),
        score: parseInt(row.get('점수')),
        teacher: row.get('확인교사'),
        note: row.get('비고(상세내용)')
      }));

      res.json({ students, pointItems, records });
    } catch (error: any) {
      console.error('Error fetching data from Google Sheets:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.post('/api/records', async (req, res) => {
    try {
      const doc = await getDoc();
      const recordSheet = doc.sheetsByTitle['상벌점기록'];
      
      const { date, studentId, studentName, content, score, teacher, note } = req.body;
      
      await recordSheet.addRow({
        '일시': date,
        '학번': studentId,
        '이름': studentName,
        '상벌점내용': content,
        '점수': score,
        '확인교사': teacher,
        '비고(상세내용)': note
      });

      res.json({ success: true });
    } catch (error: any) {
      console.error('Error adding record to Google Sheets:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
