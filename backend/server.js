const express = require('express');
const multer = require('multer');
const cors = require('cors');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const archiver = require('archiver');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const port = 5000;

app.use(cors());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const clearDirectory = (directory) => {
  if (fs.existsSync(directory)) {
    fs.readdirSync(directory).forEach((file) => {
      const curPath = path.join(directory, file);
      fs.unlinkSync(curPath);
    });
  }
};

app.post('/upload', upload.array('files'), async (req, res) => {
  const files = req.files;
  if (!files || files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }

  const outputDir = path.join(__dirname, 'output');
  const uploadDir = path.join(__dirname, 'uploads');
  clearDirectory(outputDir);

  const socketId = req.body.socketId;
  const socket = io.sockets.sockets.get(socketId);

  res.status(200).send('Processing started');

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (socket) {
      socket.emit('file-processing-start', { filename: file.originalname });
    }

    await new Promise((resolve, reject) => {
      exec(`docling "${file.path}" --output "${outputDir}"`, (error, stdout, stderr) => {
        if (error) {
          if (socket) {
            socket.emit('file-processing-error', { filename: file.originalname, error: stderr });
          }
          return reject(error);
        }
        if (socket) {
          socket.emit('file-processing-complete', { filename: file.originalname });
        }
        resolve();
      });
    });
  }

  const archive = archiver('zip', {
    zlib: { level: 9 }
  });

  const zipPath = path.join(__dirname, 'output.zip');
  const output = fs.createWriteStream(zipPath);

  output.on('close', () => {
    if (socket) {
      socket.emit('all-files-complete', { downloadUrl: `http://localhost:${port}/download` });
    }
    clearDirectory(uploadDir);
  });

  archive.pipe(output);
  archive.directory(outputDir, false);
  archive.finalize();
});

app.get('/download', (req, res) => {
  const file = path.join(__dirname, 'output.zip');
  res.download(file, 'converted_files.zip', (err) => {
    if (err) {
      console.error(err);
    }
    fs.unlinkSync(file);
  });
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
