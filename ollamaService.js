/**
 * Ollama大模型集成服务
 * 用于支部数据智能分析
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 默认Ollama API配置
const DEFAULT_CONFIG = {
  baseUrl: 'http://localhost:11434/api',
  model: 'llama3',  // 默认使用llama3模型，可根据本地部署情况调整
  temperature: 0.7,
  maxTokens: 1000
};

// 配置文件路径
const CONFIG_FILE_PATH = path.join(__dirname, 'config', 'ollama-config.json');

// 当前配置
let currentConfig = null;

/**
 * 加载配置
 * @returns {Object} 配置对象
 */
function loadConfig() {
  try {
    // 确保配置目录存在
    const configDir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // 检查配置文件是否存在
    if (fs.existsSync(CONFIG_FILE_PATH)) {
      const configData = fs.readFileSync(CONFIG_FILE_PATH, 'utf8');
      return JSON.parse(configData);
    }

    // 如果配置文件不存在，创建默认配置
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(DEFAULT_CONFIG, null, 2));
    return DEFAULT_CONFIG;
  } catch (error) {
    console.error('加载配置失败:', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * 保存配置
 * @param {Object} config - 配置对象
 * @returns {boolean} 是否保存成功
 */
function saveConfig(config) {
  try {
    // 确保配置目录存在
    const configDir = path.dirname(CONFIG_FILE_PATH);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // 合并默认配置
    const newConfig = { ...DEFAULT_CONFIG, ...config };

    // 保存配置
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(newConfig, null, 2));

    // 更新当前配置
    currentConfig = newConfig;

    return true;
  } catch (error) {
    console.error('保存配置失败:', error);
    return false;
  }
}

/**
 * 获取当前配置
 * @returns {Object} 配置对象
 */
function getConfig() {
  if (!currentConfig) {
    currentConfig = loadConfig();
  }
  return currentConfig;
}

/**
 * 发送请求到Ollama API
 * @param {string} prompt - 提示词
 * @param {Object} options - 请求选项
 * @returns {Promise<Object>} 响应数据
 */
async function callOllamaAPI(prompt, options = {}) {
  const config = getConfig();

  try {
    const response = await axios.post(`${options.baseUrl || config.baseUrl}/generate`, {
      model: options.model || config.model,
      prompt: prompt,
      stream: false,
      options: {
        temperature: options.temperature || config.temperature,
        top_p: options.top_p || 0.9,
        max_tokens: options.maxTokens || config.maxTokens
      }
    });

    return response.data;
  } catch (error) {
    console.error('Ollama API调用失败:', error);
    throw new Error('AI分析服务暂时不可用，请稍后再试');
  }
}

/**
 * 测试Ollama连接
 * @param {Object} config - 配置对象
 * @returns {Promise<boolean>} 是否连接成功
 */
async function testConnection(config) {
  try {
    const response = await axios.post(`${config.baseUrl}/generate`, {
      model: config.model,
      prompt: '你好，这是一个测试',
      stream: false
    });

    return response.status === 200;
  } catch (error) {
    console.error('测试Ollama连接失败:', error);
    return false;
  }
}

/**
 * 生成支部综合分析
 * @param {Object} branchData - 支部数据
 * @returns {Promise<string>} 分析结果
 */
async function generateBranchAnalysis(branchData) {
  const prompt = `
请对以下党支部数据进行综合分析，提供优势分析和改进建议：

支部名称: ${branchData.name || '未知'}
组织建设能力得分: ${branchData.scores.organization || 0}
思想政治工作得分: ${branchData.scores.political || 0}
业务工作能力得分: ${branchData.scores.business || 0}
群众工作能力得分: ${branchData.scores.masses || 0}
党风廉政建设得分: ${branchData.scores.discipline || 0}

请提供以下内容：
1. 支部综合能力评估（100字以内）
2. 支部优势分析（列出3点主要优势）
3. 改进建议（列出3点具体建议）

回答格式：
{
  "evaluation": "支部综合能力评估...",
  "advantages": ["优势1", "优势2", "优势3"],
  "suggestions": ["建议1", "建议2", "建议3"]
}
`;

  try {
    const response = await callOllamaAPI(prompt);
    // 尝试解析JSON响应
    try {
      // 查找JSON部分
      const jsonMatch = response.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // 如果没有找到JSON格式，返回原始响应
      return {
        evaluation: "无法解析AI分析结果，请稍后再试",
        advantages: [],
        suggestions: []
      };
    } catch (parseError) {
      console.error('解析AI响应失败:', parseError);
      return {
        evaluation: response.response.substring(0, 200),
        advantages: [],
        suggestions: []
      };
    }
  } catch (error) {
    console.error('生成支部分析失败:', error);
    return {
      evaluation: "AI分析服务暂时不可用，请稍后再试",
      advantages: [],
      suggestions: []
    };
  }
}

/**
 * 生成支部对比分析
 * @param {Object} currentBranch - 当前支部数据
 * @param {Object} comparisonData - 对比数据（平均值、最高值等）
 * @returns {Promise<string>} 对比分析结果
 */
async function generateComparisonAnalysis(currentBranch, comparisonData) {
  const prompt = `
请对以下党支部数据与对比数据进行分析，提供对比结论和提升建议：

当前支部: ${currentBranch.name || '未知'}
当前支部各维度得分:
- 组织建设能力: ${currentBranch.scores.organization || 0}
- 思想政治工作: ${currentBranch.scores.political || 0}
- 业务工作能力: ${currentBranch.scores.business || 0}
- 群众工作能力: ${currentBranch.scores.masses || 0}
- 党风廉政建设: ${currentBranch.scores.discipline || 0}

对比数据（平均值）:
- 组织建设能力: ${comparisonData.average.organization || 0}
- 思想政治工作: ${comparisonData.average.political || 0}
- 业务工作能力: ${comparisonData.average.business || 0}
- 群众工作能力: ${comparisonData.average.masses || 0}
- 党风廉政建设: ${comparisonData.average.discipline || 0}

请提供以下内容：
1. 对比分析结论（100字以内）
2. 相对优势（列出主要优势）
3. 提升建议（针对差距较大的维度）

回答格式：
{
  "conclusion": "对比分析结论...",
  "advantages": ["相对优势1", "相对优势2"],
  "improvements": ["提升建议1", "提升建议2"]
}
`;

  try {
    const response = await callOllamaAPI(prompt);
    // 尝试解析JSON响应
    try {
      // 查找JSON部分
      const jsonMatch = response.response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      // 如果没有找到JSON格式，返回原始响应
      return {
        conclusion: "无法解析AI分析结果，请稍后再试",
        advantages: [],
        improvements: []
      };
    } catch (parseError) {
      console.error('解析AI响应失败:', parseError);
      return {
        conclusion: response.response.substring(0, 200),
        advantages: [],
        improvements: []
      };
    }
  } catch (error) {
    console.error('生成对比分析失败:', error);
    return {
      conclusion: "AI分析服务暂时不可用，请稍后再试",
      advantages: [],
      improvements: []
    };
  }
}

// 导出函数
module.exports = {
  callOllamaAPI,
  generateBranchAnalysis,
  generateComparisonAnalysis,
  getConfig,
  saveConfig,
  testConnection
};
