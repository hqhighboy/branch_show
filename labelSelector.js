/**
 * 党支部标签选择算法
 * 根据支部各维度得分，选择最具代表性的标签
 */

// 维度权重配置
const DIMENSION_WEIGHTS = {
  organization: 0.25,  // 组织建设能力
  political: 0.20,     // 思想政治工作
  business: 0.25,      // 业务工作能力
  masses: 0.15,        // 群众工作能力
  discipline: 0.15     // 党风廉政建设
};

// 标签配置
const LABELS = {
  // 正向标签
  positive: {
    organization: { name: "组织规范", threshold: 85, representativeness: 1.2 },
    political: { name: "政治强", threshold: 85, representativeness: 1.2 },
    business1: { name: "业绩优", threshold: 85, representativeness: 1.2 },
    business2: { name: "创新强", threshold: 85, representativeness: 1.2 },
    masses1: { name: "服务优", threshold: 85, representativeness: 1.2 },
    masses2: { name: "解难题", threshold: 85, representativeness: 1.2 },
    discipline: { name: "廉洁好", threshold: 85, representativeness: 1.2 }
  },
  // 反向标签
  negative: {
    organization: { name: "组织松散", threshold: 60, representativeness: 1.0 },
    political: { name: "学习浅", threshold: 60, representativeness: 1.0 },
    business: { name: "业绩差", threshold: 60, representativeness: 1.0 },
    masses: { name: "服务差", threshold: 60, representativeness: 1.0 },
    discipline: { name: "纪律松", threshold: 60, representativeness: 1.0 }
  }
};

// 权重系数
const WEIGHT_COEFFICIENTS = {
  alpha: 0.4,  // 得分与阈值差距的权重
  beta: 0.3,   // 维度重要性的权重
  gamma: 0.3   // 标签代表性的权重
};

/**
 * 计算标签权重
 * @param {number} score - 维度得分
 * @param {number} threshold - 标签阈值
 * @param {number} importanceCoefficient - 维度重要性系数
 * @param {number} representativeness - 标签代表性系数
 * @returns {number} 标签权重得分
 */
function calculateLabelWeight(score, threshold, importanceCoefficient, representativeness) {
  const { alpha, beta, gamma } = WEIGHT_COEFFICIENTS;
  const scoreDifference = Math.abs(score - threshold);
  
  return alpha * scoreDifference + beta * importanceCoefficient + gamma * representativeness;
}

/**
 * 生成候选标签池
 * @param {Object} scores - 各维度得分
 * @returns {Array} 候选标签数组
 */
function generateCandidateLabels(scores) {
  const candidates = [];
  
  // 检查正向标签
  Object.entries(LABELS.positive).forEach(([key, label]) => {
    let dimensionKey = key.replace(/\d+$/, ''); // 移除数字后缀，如business1 -> business
    const score = scores[dimensionKey];
    
    if (score >= label.threshold) {
      candidates.push({
        name: label.name,
        type: 'positive',
        dimension: dimensionKey,
        score: score,
        threshold: label.threshold,
        importance: DIMENSION_WEIGHTS[dimensionKey],
        representativeness: label.representativeness,
        weight: calculateLabelWeight(
          score, 
          label.threshold, 
          DIMENSION_WEIGHTS[dimensionKey], 
          label.representativeness
        )
      });
    }
  });
  
  // 检查反向标签
  Object.entries(LABELS.negative).forEach(([key, label]) => {
    const score = scores[key];
    
    if (score <= label.threshold) {
      candidates.push({
        name: label.name,
        type: 'negative',
        dimension: key,
        score: score,
        threshold: label.threshold,
        importance: DIMENSION_WEIGHTS[key],
        representativeness: label.representativeness,
        weight: calculateLabelWeight(
          score, 
          label.threshold, 
          DIMENSION_WEIGHTS[key], 
          label.representativeness
        )
      });
    }
  });
  
  return candidates;
}

/**
 * 选择最具代表性的标签
 * @param {Object} scores - 各维度得分
 * @returns {Array} 选中的标签数组
 */
function selectRepresentativeLabels(scores) {
  const candidates = generateCandidateLabels(scores);
  
  // 如果没有候选标签，返回空数组
  if (candidates.length === 0) {
    return [];
  }
  
  // 如果候选标签少于等于2个，直接返回所有候选标签
  if (candidates.length <= 2) {
    return candidates;
  }
  
  // 分离正向和反向标签
  const positiveLabels = candidates.filter(label => label.type === 'positive');
  const negativeLabels = candidates.filter(label => label.type === 'negative');
  
  // 按权重排序
  positiveLabels.sort((a, b) => b.weight - a.weight);
  negativeLabels.sort((a, b) => b.weight - a.weight);
  
  // 优先选择1个正向标签和1个反向标签
  if (positiveLabels.length > 0 && negativeLabels.length > 0) {
    return [positiveLabels[0], negativeLabels[0]];
  }
  
  // 如果只有正向标签或只有反向标签，选择权重最高的2个
  const sortedCandidates = candidates.sort((a, b) => b.weight - a.weight);
  return sortedCandidates.slice(0, 2);
}

/**
 * 获取支部标签
 * @param {Object} scores - 各维度得分
 * @returns {Array} 选中的标签数组
 */
function getBranchLabels(scores) {
  return selectRepresentativeLabels(scores);
}

// 导出函数
module.exports = {
  getBranchLabels,
  generateCandidateLabels,
  calculateLabelWeight,
  DIMENSION_WEIGHTS,
  LABELS
};
