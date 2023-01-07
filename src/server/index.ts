import { addFileToQueue } from '@/worker';
import express from 'express';
import multer from 'multer';

const app = express();

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'uploads/raw');
	},
	filename: function (req, file, cb) {
		const ext = file.mimetype.split('/')[1];
		cb(null, file.fieldname + '-' + Date.now() + '.' + ext);
	}
});

const upload = multer({ storage });

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.post('/upload', upload.single('file'), (req, res) => {
	addFileToQueue(req.file.filename);

	res.json({ message: 'File uploaded successfully' });
});

app.listen(8080, () => {
	console.log('🚀 Server running on port 8080');
});
