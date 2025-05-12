const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

// 确定uploads目录路径
let uploadsPath;
if (process.env.NODE_ENV === 'production') {
  // 生产环境，使用resources目录下的uploads
  uploadsPath = process.platform === 'win32' 
    ? path.join(process.resourcesPath, 'uploads')
    : path.join(__dirname, 'uploads');
} else {
  // 开发环境
  uploadsPath = path.join(__dirname, 'uploads');
}

// 确保uploads目录存在
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}

console.log('Using uploads directory:', uploadsPath);

const upload = multer({ dest: uploadsPath });

app.use(cors());
app.use(express.json());

// 添加状态检查端点
app.get('/api/status', (req, res) => {
  res.json({ status: 'running' });
});

// 处理支部基本情况上传
app.post('/api/upload/basic-info', upload.single('file'), (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '文件处理失败' });
  }
});

// 处理支部人员分析上传
app.post('/api/upload/personnel', upload.single('file'), (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '文件处理失败' });
  }
});

// 处理年度重点工作上传
app.post('/api/upload/annual-work', upload.single('file'), (req, res) => {
  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: '文件处理失败' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 