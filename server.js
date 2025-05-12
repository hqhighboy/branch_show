const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// 导入自定义模块
const labelSelector = require('./labelSelector');
const ollamaService = require('./ollamaService');

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

// 处理支部综合能力画像数据
app.post('/api/branch-portrait', express.json(), (req, res) => {
  try {
    const { scores } = req.body;

    if (!scores) {
      return res.status(400).json({ error: '缺少必要的得分数据' });
    }

    // 计算标签
    const labels = labelSelector.getBranchLabels(scores);

    // 返回结果
    res.json({ labels });
  } catch (error) {
    console.error('处理支部画像数据失败:', error);
    res.status(500).json({ error: '处理支部画像数据失败' });
  }
});

// AI智能分析
app.post('/api/ai-analysis', express.json(), async (req, res) => {
  try {
    const { branchData } = req.body;

    if (!branchData || !branchData.scores) {
      return res.status(400).json({ error: '缺少必要的支部数据' });
    }

    // 调用Ollama服务进行分析
    const analysis = await ollamaService.generateBranchAnalysis(branchData);

    // 返回分析结果
    res.json(analysis);
  } catch (error) {
    console.error('AI分析失败:', error);
    res.status(500).json({
      error: 'AI分析服务暂时不可用',
      evaluation: "AI分析服务暂时不可用，请稍后再试",
      advantages: [],
      suggestions: []
    });
  }
});

// 支部对比分析
app.post('/api/comparison-analysis', express.json(), async (req, res) => {
  try {
    const { currentBranch, comparisonData } = req.body;

    if (!currentBranch || !comparisonData) {
      return res.status(400).json({ error: '缺少必要的对比数据' });
    }

    // 调用Ollama服务进行对比分析
    const analysis = await ollamaService.generateComparisonAnalysis(currentBranch, comparisonData);

    // 返回分析结果
    res.json(analysis);
  } catch (error) {
    console.error('对比分析失败:', error);
    res.status(500).json({
      error: '对比分析服务暂时不可用',
      conclusion: "对比分析服务暂时不可用，请稍后再试",
      advantages: [],
      improvements: []
    });
  }
});

// 创建math目录（如果不存在）
const mathPath = path.join(__dirname, 'math');
if (!fs.existsSync(mathPath)) {
  fs.mkdirSync(mathPath, { recursive: true });
}

// 提供静态文件访问
app.use('/math', express.static(mathPath));

// 获取Ollama模型配置
app.get('/api/ollama-config', (req, res) => {
  try {
    const config = ollamaService.getConfig();
    res.json(config);
  } catch (error) {
    console.error('获取Ollama配置失败:', error);
    res.status(500).json({ error: '获取配置失败' });
  }
});

// 保存Ollama模型配置
app.post('/api/ollama-config', express.json(), (req, res) => {
  try {
    const { baseUrl, model, temperature, maxTokens } = req.body;

    if (!baseUrl || !model) {
      return res.status(400).json({ error: '缺少必要的配置参数' });
    }

    const config = {
      baseUrl,
      model,
      temperature: parseFloat(temperature) || 0.7,
      maxTokens: parseInt(maxTokens) || 1000
    };

    const success = ollamaService.saveConfig(config);

    if (success) {
      res.json({ success: true, message: '配置已保存' });
    } else {
      res.status(500).json({ error: '保存配置失败' });
    }
  } catch (error) {
    console.error('保存Ollama配置失败:', error);
    res.status(500).json({ error: '保存配置失败' });
  }
});

// 测试Ollama连接
app.post('/api/test-ollama-connection', express.json(), async (req, res) => {
  try {
    const { baseUrl, model } = req.body;

    if (!baseUrl || !model) {
      return res.status(400).json({ error: '缺少必要的配置参数' });
    }

    const config = {
      baseUrl,
      model
    };

    const success = await ollamaService.testConnection(config);

    if (success) {
      res.json({ success: true, message: '连接成功' });
    } else {
      res.status(500).json({ error: '连接失败' });
    }
  } catch (error) {
    console.error('测试Ollama连接失败:', error);
    res.status(500).json({ error: '连接失败: ' + error.message });
  }
});

// 提供静态文件访问
app.use(express.static(path.join(__dirname, 'build')));

// 所有其他请求返回React应用
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});