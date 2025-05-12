/**
 * 智能分析功能脚本
 * 用于在React应用加载完成后添加智能分析功能
 */

// 等待React应用加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 给React一些时间来渲染页面
    setTimeout(initIntelligentAnalysis, 1000);
});

/**
 * 初始化智能分析功能
 */
function initIntelligentAnalysis() {
    // 检查是否已经存在智能分析模块
    if (document.querySelector('.intelligent-analysis-module')) {
        console.log('智能分析区域已存在');
        return;
    }

    // 尝试直接找到红框区域
    // 在图片中，红框区域是在支部综合能力画像区域下方的一个区域
    const mainContainer = document.querySelector('#root > div');
    if (!mainContainer) {
        console.log('未找到主容器，稍后再试');
        setTimeout(initIntelligentAnalysis, 1000);
        return;
    }

    // 查找支部综合能力画像区域
    const portraitTitle = Array.from(document.querySelectorAll('div')).find(
        div => div.textContent && div.textContent.trim() === '支部综合能力画像'
    );

    if (portraitTitle) {
        console.log('找到支部综合能力画像标题');

        // 查找包含支部综合能力画像的主要容器
        let portraitContainer = portraitTitle;
        for (let i = 0; i < 5; i++) {
            if (portraitContainer.parentElement) {
                portraitContainer = portraitContainer.parentElement;
                if (portraitContainer.offsetWidth > 800) {
                    break;
                }
            }
        }

        // 创建一个新的容器，作为支部综合能力画像区域的兄弟元素
        const container = document.createElement('div');
        container.style.width = '100%';
        container.style.marginTop = '0';
        container.style.marginBottom = '20px';
        container.style.backgroundColor = '#fff';
        container.style.borderRadius = '4px';

        // 将新容器添加到父元素中，紧跟在支部综合能力画像区域之后
        if (portraitContainer.nextSibling) {
            portraitContainer.parentElement.insertBefore(container, portraitContainer.nextSibling);
        } else {
            portraitContainer.parentElement.appendChild(container);
        }

        // 在新容器中创建智能分析区域
        createIntelligentAnalysisSection(container);
        console.log('智能分析区域已创建（作为同级元素）');

        // 加载模型配置
        loadModelConfig();
    } else {
        // 如果找不到支部综合能力画像标题，尝试查找页面中的所有白色背景容器
        const whiteContainers = Array.from(document.querySelectorAll('div')).filter(
            div => {
                const style = window.getComputedStyle(div);
                return style.backgroundColor === 'rgb(255, 255, 255)' &&
                       div.offsetWidth > 800 &&
                       div.offsetHeight > 200;
            }
        );

        if (whiteContainers.length > 0) {
            // 使用最后一个白色容器（假设它是支部综合能力画像区域）
            const lastWhiteContainer = whiteContainers[whiteContainers.length - 1];

            // 创建一个新的容器
            const container = document.createElement('div');
            container.style.width = '100%';
            container.style.marginTop = '20px';
            container.style.marginBottom = '20px';

            // 将新容器添加到父元素中，紧跟在最后一个白色容器之后
            if (lastWhiteContainer.nextSibling) {
                lastWhiteContainer.parentElement.insertBefore(container, lastWhiteContainer.nextSibling);
            } else {
                lastWhiteContainer.parentElement.appendChild(container);
            }

            // 在新容器中创建智能分析区域
            createIntelligentAnalysisSection(container);
            console.log('智能分析区域已创建（在最后一个白色容器之后）');

            // 加载模型配置
            loadModelConfig();
        } else {
            // 如果找不到任何合适的容器，直接添加到主容器中
            createIntelligentAnalysisSection(mainContainer);
            console.log('智能分析区域已创建（添加到主容器）');

            // 加载模型配置
            loadModelConfig();
        }
    }
}

/**
 * 查找支部综合能力画像区域
 * @returns {HTMLElement|null} 支部综合能力画像区域元素
 */
function findPortraitSection() {
    // 尝试通过标题文本查找
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6, div');
    for (const heading of headings) {
        if (heading.textContent && heading.textContent.includes('支部综合能力画像')) {
            // 找到包含标题的元素后，向上查找合适的父元素
            let parent = heading;
            // 向上查找最多5层
            for (let i = 0; i < 5; i++) {
                if (parent.parentElement) {
                    parent = parent.parentElement;
                    // 如果找到一个足够大的容器，就返回它
                    if (parent.offsetWidth > 500) {
                        // 找到了支部综合能力画像区域，现在我们需要找到它的父容器
                        // 以便在同一级别添加我们的新模块
                        return parent;
                    }
                } else {
                    break;
                }
            }
            return heading.parentElement || heading;
        }
    }

    // 如果通过标题没找到，尝试查找雷达图容器
    const radarCharts = document.querySelectorAll('canvas');
    if (radarCharts.length > 0) {
        // 假设第一个canvas是雷达图
        const radarChart = radarCharts[0];
        return radarChart.parentElement.parentElement || radarChart.parentElement;
    }

    // 如果以上方法都找不到，尝试查找页面中的主要容器
    const mainContainers = document.querySelectorAll('.container, .main, main, #root > div');
    for (const container of mainContainers) {
        if (container.offsetWidth > 800 && container.offsetHeight > 400) {
            return container;
        }
    }

    // 最后尝试直接使用body或root元素
    return document.getElementById('root') || document.body;
}

/**
 * 创建智能分析区域
 * @param {HTMLElement} parentElement 父元素
 */
function createIntelligentAnalysisSection(parentElement) {
    // 创建新模块区域（与支部综合能力画像区域大小相似）
    const moduleContainer = document.createElement('div');
    moduleContainer.className = 'intelligent-analysis-module';
    moduleContainer.style.width = '100%';
    moduleContainer.style.marginTop = '0';
    moduleContainer.style.marginBottom = '20px';
    moduleContainer.style.padding = '20px';
    moduleContainer.style.backgroundColor = '#fff';
    moduleContainer.style.borderRadius = '4px';
    moduleContainer.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    moduleContainer.style.border = '1px solid #e8e8e8';
    moduleContainer.style.boxSizing = 'border-box';
    moduleContainer.style.height = '650px'; // 设置固定高度，与支部综合能力画像区域相似
    moduleContainer.style.display = 'flex';
    moduleContainer.style.flexDirection = 'column';

    // 创建一个蓝色背景的标题栏，与支部综合能力画像区域风格一致
    const titleBar = document.createElement('div');
    titleBar.style.backgroundColor = '#0066b3'; // 蓝色背景，与页面顶部颜色一致
    titleBar.style.color = 'white';
    titleBar.style.padding = '10px 20px';
    titleBar.style.marginBottom = '20px';
    titleBar.style.borderRadius = '4px 4px 0 0';
    titleBar.style.marginLeft = '-20px';
    titleBar.style.marginRight = '-20px';
    titleBar.style.marginTop = '-20px';
    titleBar.style.fontWeight = 'bold';
    titleBar.style.fontSize = '16px';

    // 创建标题文本
    const titleText = document.createElement('span');
    titleText.textContent = '智能分析与多维度对比';
    titleBar.appendChild(titleText);

    // 将标题栏添加到模块容器
    moduleContainer.appendChild(titleBar);

    // 创建选项卡容器
    const tabsContainer = document.createElement('div');
    tabsContainer.style.flex = '1';
    tabsContainer.style.display = 'flex';
    tabsContainer.style.flexDirection = 'column';
    tabsContainer.style.overflow = 'hidden'; // 防止整体溢出

    // 设置HTML内容
    tabsContainer.innerHTML = `
        <ul class="nav nav-tabs" id="analysisTabs" role="tablist">
            <li class="nav-item" role="presentation">
                <button class="nav-link active" id="labels-tab" data-bs-toggle="tab" data-bs-target="#labels" type="button" role="tab" aria-controls="labels" aria-selected="true">支部标签</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="ai-tab" data-bs-toggle="tab" data-bs-target="#ai" type="button" role="tab" aria-controls="ai" aria-selected="false">AI智能分析</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="comparison-tab" data-bs-toggle="tab" data-bs-target="#comparison" type="button" role="tab" aria-controls="comparison" aria-selected="false">多维度对比</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="visualization-tab" data-bs-toggle="tab" data-bs-target="#visualization" type="button" role="tab" aria-controls="visualization" aria-selected="false">高级可视化</button>
            </li>
            <li class="nav-item" role="presentation">
                <button class="nav-link" id="settings-tab" data-bs-toggle="tab" data-bs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="false">模型配置</button>
            </li>
        </ul>

        <div class="tab-content mt-3" id="analysisTabsContent" style="overflow-y: auto; max-height: 520px;">
            <!-- 支部标签 -->
            <div class="tab-pane fade show active" id="labels" role="tabpanel" aria-labelledby="labels-tab">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">支部特征标签</h5>
                        <button class="btn btn-sm btn-outline-primary" id="refreshLabelsBtn">
                            <i class="bi bi-arrow-clockwise"></i> 刷新
                        </button>
                    </div>
                    <div class="card-body">
                        <div class="alert alert-info mb-3">
                            <i class="bi bi-info-circle-fill me-2"></i>
                            基于支部综合能力画像数据，系统自动生成的特征标签
                        </div>
                        <div id="labelsContainer">
                            <div class="loading" id="labelsLoading">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">加载中...</span>
                                </div>
                                <p class="mt-2">正在计算标签...</p>
                            </div>
                            <div id="labelsContent" class="d-flex flex-wrap gap-2"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- AI智能分析 -->
            <div class="tab-pane fade" id="ai" role="tabpanel" aria-labelledby="ai-tab">
                <div class="card">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5 class="mb-0">支部综合分析</h5>
                        <div>
                            <button class="btn btn-sm btn-outline-secondary me-2" id="exportAnalysisBtn">
                                <i class="bi bi-download"></i> 导出
                            </button>
                            <button class="btn btn-sm btn-primary" id="generateAnalysisBtn">
                                <i class="bi bi-cpu"></i> 生成分析
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="alert alert-primary mb-3">
                            <i class="bi bi-lightbulb-fill me-2"></i>
                            AI将基于支部数据进行全面分析，提供客观评价和改进建议
                        </div>
                        <div id="analysisContainer">
                            <div class="loading" id="analysisLoading">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">加载中...</span>
                                </div>
                                <p class="mt-2">正在生成AI分析...</p>
                            </div>

                            <div id="analysisContent">
                                <div class="card mb-3 bg-light">
                                    <div class="card-body">
                                        <p id="evaluationText" class="lead mb-0">点击"生成分析"按钮获取AI分析结果</p>
                                    </div>
                                </div>

                                <div class="row">
                                    <div class="col-md-6">
                                        <div class="card border-success mb-3">
                                            <div class="card-header bg-success text-white">
                                                <i class="bi bi-graph-up-arrow me-2"></i>优势分析
                                            </div>
                                            <div class="card-body">
                                                <ul id="advantagesList" class="mb-0">
                                                    <li class="text-muted">暂无数据</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="card border-warning mb-3">
                                            <div class="card-header bg-warning text-dark">
                                                <i class="bi bi-tools me-2"></i>改进建议
                                            </div>
                                            <div class="card-body">
                                                <ul id="suggestionsList" class="mb-0">
                                                    <li class="text-muted">暂无数据</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 多维度对比 -->
            <div class="tab-pane fade" id="comparison" role="tabpanel" aria-labelledby="comparison-tab">
                <div class="row">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5>雷达图对比</h5>
                            </div>
                            <div class="card-body">
                                <div id="radarChartContainer" class="chart-container">
                                    <canvas id="radarChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5>柱状图对比</h5>
                            </div>
                            <div class="card-body">
                                <div id="barChartContainer" class="chart-container">
                                    <canvas id="barChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mt-3">
                    <div class="card-header d-flex justify-content-between align-items-center">
                        <h5>对比分析结论</h5>
                        <button class="btn btn-primary" id="generateComparisonBtn">生成对比分析</button>
                    </div>
                    <div class="card-body">
                        <div id="comparisonContainer">
                            <div class="loading" id="comparisonLoading">
                                <div class="spinner-border text-primary" role="status">
                                    <span class="visually-hidden">加载中...</span>
                                </div>
                                <p class="mt-2">正在生成对比分析...</p>
                            </div>

                            <div id="comparisonContent">
                                <p id="conclusionText" class="lead">点击"生成对比分析"按钮获取AI分析结果</p>

                                <h6 class="mt-4">相对优势</h6>
                                <ul id="advantagesComparisonList">
                                    <li class="text-muted">暂无数据</li>
                                </ul>

                                <h6 class="mt-4">提升建议</h6>
                                <ul id="improvementsList">
                                    <li class="text-muted">暂无数据</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 高级可视化 -->
            <div class="tab-pane fade" id="visualization" role="tabpanel" aria-labelledby="visualization-tab">
                <div class="row">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5>历史趋势分析</h5>
                            </div>
                            <div class="card-body">
                                <div id="trendChartContainer" class="chart-container">
                                    <canvas id="trendChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header">
                                <h5>支部能力热力图</h5>
                            </div>
                            <div class="card-body">
                                <div id="heatmapContainer" class="chart-container">
                                    <canvas id="heatmapChart"></canvas>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="card mt-3">
                    <div class="card-header">
                        <h5>支部关系网络图</h5>
                    </div>
                    <div class="card-body">
                        <div id="networkChartContainer" class="chart-container" style="height: 400px;">
                            <canvas id="networkChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 模型配置 -->
            <div class="tab-pane fade" id="settings" role="tabpanel" aria-labelledby="settings-tab">
                <div class="alert alert-info mb-3">
                    <div class="d-flex">
                        <div class="me-3">
                            <i class="bi bi-info-circle-fill fs-3"></i>
                        </div>
                        <div>
                            <h5 class="alert-heading">Ollama本地大模型集成</h5>
                            <p class="mb-0">本系统已与Ollama集成，可使用本地部署的大模型进行智能分析。当前已检测到4个本地模型。</p>
                        </div>
                    </div>
                </div>

                <div class="row">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header bg-primary text-white">
                                <h5 class="mb-0"><i class="bi bi-cpu me-2"></i>Ollama大模型配置</h5>
                            </div>
                            <div class="card-body">
                                <form id="modelConfigForm">
                                    <div class="mb-3">
                                        <label for="modelEndpoint" class="form-label">Ollama API端点</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="bi bi-link-45deg"></i></span>
                                            <input type="text" class="form-control" id="modelEndpoint" value="http://localhost:11434/api" placeholder="例如：http://localhost:11434/api">
                                        </div>
                                        <div class="form-text">默认为本地Ollama服务地址</div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="modelSelect" class="form-label">选择模型</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="bi bi-box"></i></span>
                                            <select class="form-select" id="modelSelect">
                                                <option value="deepseek-r1:7b" selected>DeepSeek R1 7B</option>
                                                <option value="deepseek-r1:1.5b">DeepSeek R1 1.5B</option>
                                                <option value="nomic-embed-text">Nomic Embed Text</option>
                                                <option value="bge-m3">BGE M3</option>
                                            </select>
                                        </div>
                                        <div class="form-text">已显示本地部署的Ollama模型</div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="temperatureRange" class="form-label">温度 (Temperature): <span id="temperatureValue">0.7</span></label>
                                        <input type="range" class="form-range" min="0" max="1" step="0.1" value="0.7" id="temperatureRange" oninput="document.getElementById('temperatureValue').textContent = this.value">
                                        <div class="form-text">较低的值使输出更确定，较高的值使输出更随机</div>
                                    </div>

                                    <div class="mb-3">
                                        <label for="maxTokensRange" class="form-label">最大生成长度: <span id="maxTokensValue">1000</span></label>
                                        <input type="range" class="form-range" min="100" max="4000" step="100" value="1000" id="maxTokensRange" oninput="document.getElementById('maxTokensValue').textContent = this.value">
                                    </div>

                                    <div class="mb-3 form-check">
                                        <input type="checkbox" class="form-check-input" id="testConnection">
                                        <label class="form-check-label" for="testConnection">保存前测试连接</label>
                                    </div>

                                    <div class="d-flex gap-2">
                                        <button type="button" class="btn btn-primary" id="saveModelConfig">
                                            <i class="bi bi-save me-1"></i> 保存配置
                                        </button>
                                        <button type="button" class="btn btn-outline-primary" id="testModelConnection">
                                            <i class="bi bi-check-circle me-1"></i> 测试连接
                                        </button>
                                    </div>
                                </form>

                                <div class="mt-3" id="connectionStatus"></div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card">
                            <div class="card-header bg-success text-white">
                                <h5 class="mb-0"><i class="bi bi-gear me-2"></i>分析配置</h5>
                            </div>
                            <div class="card-body">
                                <form id="analysisConfigForm">
                                    <div class="mb-3 form-check form-switch">
                                        <input type="checkbox" class="form-check-input" id="autoAnalysis" checked>
                                        <label class="form-check-label" for="autoAnalysis">数据加载后自动分析</label>
                                    </div>

                                    <div class="mb-3">
                                        <label for="analysisDepth" class="form-label">分析深度</label>
                                        <div class="input-group">
                                            <span class="input-group-text"><i class="bi bi-layers"></i></span>
                                            <select class="form-select" id="analysisDepth">
                                                <option value="basic">基础分析</option>
                                                <option value="standard" selected>标准分析</option>
                                                <option value="deep">深度分析</option>
                                            </select>
                                        </div>
                                        <div class="form-text">深度分析将消耗更多资源并需要更长时间</div>
                                    </div>

                                    <div class="mb-3">
                                        <label class="form-label">分析内容选择</label>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" value="" id="analyzeStrengths" checked>
                                            <label class="form-check-label" for="analyzeStrengths">
                                                优势分析
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" value="" id="analyzeWeaknesses" checked>
                                            <label class="form-check-label" for="analyzeWeaknesses">
                                                不足分析
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" value="" id="analyzeSuggestions" checked>
                                            <label class="form-check-label" for="analyzeSuggestions">
                                                改进建议
                                            </label>
                                        </div>
                                    </div>

                                    <button type="button" class="btn btn-success" id="saveAnalysisConfig">
                                        <i class="bi bi-save me-1"></i> 保存配置
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div class="card mt-3">
                            <div class="card-header bg-info text-white">
                                <h5 class="mb-0"><i class="bi bi-info-circle me-2"></i>模型信息</h5>
                            </div>
                            <div class="card-body">
                                <table class="table table-sm">
                                    <tbody>
                                        <tr>
                                            <th scope="row">当前模型</th>
                                            <td>DeepSeek R1 7B</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">模型大小</th>
                                            <td>4.7 GB</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">最后更新</th>
                                            <td>6周前</td>
                                        </tr>
                                        <tr>
                                            <th scope="row">服务状态</th>
                                            <td><span class="badge bg-success">在线</span></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    moduleContainer.appendChild(tabsContainer);

    // 添加到父元素
    parentElement.appendChild(moduleContainer);

    // 初始化功能
    initCharts();
    initAdvancedCharts();
    fetchLabels();

    // 绑定事件
    document.getElementById('generateAnalysisBtn').addEventListener('click', generateAnalysis);
    document.getElementById('generateComparisonBtn').addEventListener('click', generateComparisonAnalysis);
    document.getElementById('saveModelConfig').addEventListener('click', saveModelConfig);
    document.getElementById('testModelConnection').addEventListener('click', testModelConnection);
    document.getElementById('saveAnalysisConfig').addEventListener('click', saveAnalysisConfig);
}

// 模拟数据
const branchData = {
    name: "测试支部",
    scores: {
        organization: 85,
        political: 75,
        business: 90,
        masses: 80,
        discipline: 70
    }
};

const comparisonData = {
    average: {
        organization: 75,
        political: 70,
        business: 75,
        masses: 70,
        discipline: 75
    },
    target: {
        organization: 90,
        political: 90,
        business: 90,
        masses: 90,
        discipline: 90
    }
};

/**
 * 初始化图表
 */
function initCharts() {
    // 雷达图
    const radarCtx = document.getElementById('radarChart').getContext('2d');
    const radarChart = new Chart(radarCtx, {
        type: 'radar',
        data: {
            labels: ['组织建设', '思想政治', '业务工作', '群众工作', '党风廉政'],
            datasets: [
                {
                    label: '当前支部',
                    data: [
                        branchData.scores.organization,
                        branchData.scores.political,
                        branchData.scores.business,
                        branchData.scores.masses,
                        branchData.scores.discipline
                    ],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
                },
                {
                    label: '平均水平',
                    data: [
                        comparisonData.average.organization,
                        comparisonData.average.political,
                        comparisonData.average.business,
                        comparisonData.average.masses,
                        comparisonData.average.discipline
                    ],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    pointBackgroundColor: 'rgba(75, 192, 192, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(75, 192, 192, 1)'
                },
                {
                    label: '目标水平',
                    data: [
                        comparisonData.target.organization,
                        comparisonData.target.political,
                        comparisonData.target.business,
                        comparisonData.target.masses,
                        comparisonData.target.discipline
                    ],
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    borderColor: 'rgba(255, 159, 64, 1)',
                    pointBackgroundColor: 'rgba(255, 159, 64, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255, 159, 64, 1)'
                }
            ]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            }
        }
    });

    // 柱状图
    const barCtx = document.getElementById('barChart').getContext('2d');
    const barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: ['组织建设', '思想政治', '业务工作', '群众工作', '党风廉政'],
            datasets: [
                {
                    label: '当前支部',
                    data: [
                        branchData.scores.organization,
                        branchData.scores.political,
                        branchData.scores.business,
                        branchData.scores.masses,
                        branchData.scores.discipline
                    ],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)'
                },
                {
                    label: '平均水平',
                    data: [
                        comparisonData.average.organization,
                        comparisonData.average.political,
                        comparisonData.average.business,
                        comparisonData.average.masses,
                        comparisonData.average.discipline
                    ],
                    backgroundColor: 'rgba(75, 192, 192, 0.7)'
                },
                {
                    label: '目标水平',
                    data: [
                        comparisonData.target.organization,
                        comparisonData.target.political,
                        comparisonData.target.business,
                        comparisonData.target.masses,
                        comparisonData.target.discipline
                    ],
                    backgroundColor: 'rgba(255, 159, 64, 0.7)'
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

/**
 * 获取支部标签
 */
async function fetchLabels() {
    document.getElementById('labelsLoading').classList.add('active');
    document.getElementById('labelsContent').innerHTML = '';

    try {
        const response = await fetch('http://localhost:3001/api/branch-portrait', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ scores: branchData.scores })
        });

        const data = await response.json();

        if (data.labels && data.labels.length > 0) {
            const labelsHtml = data.labels.map(label => {
                const tagClass = label.type === 'positive' ? 'tag-positive' : 'tag-negative';
                return `<span class="tag ${tagClass}">${label.name}</span>`;
            }).join('');

            document.getElementById('labelsContent').innerHTML = labelsHtml;
        } else {
            document.getElementById('labelsContent').innerHTML = '<p class="text-muted">暂无标签</p>';
        }
    } catch (error) {
        console.error('获取标签失败:', error);
        document.getElementById('labelsContent').innerHTML = '<p class="text-danger">获取标签失败，请稍后再试</p>';
    } finally {
        document.getElementById('labelsLoading').classList.remove('active');
    }
}

/**
 * 生成AI分析
 */
async function generateAnalysis() {
    document.getElementById('analysisLoading').classList.add('active');

    try {
        const response = await fetch('http://localhost:3001/api/ai-analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ branchData })
        });

        const data = await response.json();

        document.getElementById('evaluationText').textContent = data.evaluation || '暂无评估结果';

        if (data.advantages && data.advantages.length > 0) {
            const advantagesHtml = data.advantages.map(item => `<li>${item}</li>`).join('');
            document.getElementById('advantagesList').innerHTML = advantagesHtml;
        } else {
            document.getElementById('advantagesList').innerHTML = '<li class="text-muted">暂无数据</li>';
        }

        if (data.suggestions && data.suggestions.length > 0) {
            const suggestionsHtml = data.suggestions.map(item => `<li>${item}</li>`).join('');
            document.getElementById('suggestionsList').innerHTML = suggestionsHtml;
        } else {
            document.getElementById('suggestionsList').innerHTML = '<li class="text-muted">暂无数据</li>';
        }
    } catch (error) {
        console.error('生成分析失败:', error);
        document.getElementById('evaluationText').textContent = 'AI分析服务暂时不可用，请稍后再试';
        document.getElementById('advantagesList').innerHTML = '<li class="text-muted">暂无数据</li>';
        document.getElementById('suggestionsList').innerHTML = '<li class="text-muted">暂无数据</li>';
    } finally {
        document.getElementById('analysisLoading').classList.remove('active');
    }
}

/**
 * 生成对比分析
 */
async function generateComparisonAnalysis() {
    document.getElementById('comparisonLoading').classList.add('active');

    try {
        const response = await fetch('http://localhost:3001/api/comparison-analysis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentBranch: branchData, comparisonData })
        });

        const data = await response.json();

        document.getElementById('conclusionText').textContent = data.conclusion || '暂无分析结论';

        if (data.advantages && data.advantages.length > 0) {
            const advantagesHtml = data.advantages.map(item => `<li>${item}</li>`).join('');
            document.getElementById('advantagesComparisonList').innerHTML = advantagesHtml;
        } else {
            document.getElementById('advantagesComparisonList').innerHTML = '<li class="text-muted">暂无数据</li>';
        }

        if (data.improvements && data.improvements.length > 0) {
            const improvementsHtml = data.improvements.map(item => `<li>${item}</li>`).join('');
            document.getElementById('improvementsList').innerHTML = improvementsHtml;
        } else {
            document.getElementById('improvementsList').innerHTML = '<li class="text-muted">暂无数据</li>';
        }
    } catch (error) {
        console.error('生成对比分析失败:', error);
        document.getElementById('conclusionText').textContent = '对比分析服务暂时不可用，请稍后再试';
        document.getElementById('advantagesComparisonList').innerHTML = '<li class="text-muted">暂无数据</li>';
        document.getElementById('improvementsList').innerHTML = '<li class="text-muted">暂无数据</li>';
    } finally {
        document.getElementById('comparisonLoading').classList.remove('active');
    }
}

/**
 * 初始化高级可视化图表
 */
function initAdvancedCharts() {
    // 历史趋势图
    const trendCtx = document.getElementById('trendChart').getContext('2d');
    const trendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['2020年', '2021年', '2022年', '2023年', '2024年'],
            datasets: [
                {
                    label: '组织建设能力',
                    data: [70, 75, 78, 82, 85],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: '思想政治工作',
                    data: [65, 68, 72, 74, 75],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: '业务工作能力',
                    data: [75, 80, 85, 88, 90],
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: '群众工作能力',
                    data: [68, 72, 76, 78, 80],
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.1)',
                    tension: 0.3,
                    fill: true
                },
                {
                    label: '党风廉政建设',
                    data: [72, 74, 75, 72, 70],
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.1)',
                    tension: 0.3,
                    fill: true
                }
            ]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '支部能力历年变化趋势'
                }
            }
        }
    });

    // 热力图（使用矩阵图代替，因为Chart.js没有内置热力图）
    const heatmapCtx = document.getElementById('heatmapChart').getContext('2d');
    const heatmapData = {
        labels: ['组织建设', '思想政治', '业务工作', '群众工作', '党风廉政'],
        datasets: [
            {
                label: '本支部',
                data: [85, 75, 90, 80, 70],
                backgroundColor: 'rgba(54, 162, 235, 0.7)'
            },
            {
                label: '优秀支部1',
                data: [90, 85, 88, 82, 85],
                backgroundColor: 'rgba(75, 192, 192, 0.7)'
            },
            {
                label: '优秀支部2',
                data: [88, 90, 85, 85, 80],
                backgroundColor: 'rgba(255, 159, 64, 0.7)'
            },
            {
                label: '优秀支部3',
                data: [85, 88, 92, 78, 82],
                backgroundColor: 'rgba(153, 102, 255, 0.7)'
            }
        ]
    };

    const heatmapChart = new Chart(heatmapCtx, {
        type: 'bar',
        data: heatmapData,
        options: {
            indexAxis: 'y',
            plugins: {
                title: {
                    display: true,
                    text: '与优秀支部能力对比'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.raw}分`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });

    // 网络图（使用雷达图代替，因为Chart.js没有内置网络图）
    const networkCtx = document.getElementById('networkChart').getContext('2d');
    const networkChart = new Chart(networkCtx, {
        type: 'radar',
        data: {
            labels: ['组织建设协同性', '思想引领影响力', '业务创新能力', '群众服务覆盖面', '廉政建设示范性', '支部凝聚力', '党员发展质量', '工作执行力'],
            datasets: [
                {
                    label: '本支部',
                    data: [85, 75, 90, 80, 70, 85, 78, 88],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
                },
                {
                    label: '平均水平',
                    data: [75, 70, 75, 70, 75, 72, 70, 74],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    pointBackgroundColor: 'rgba(255, 99, 132, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(255, 99, 132, 1)'
                }
            ]
        },
        options: {
            scales: {
                r: {
                    angleLines: {
                        display: true
                    },
                    suggestedMin: 0,
                    suggestedMax: 100
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '支部能力多维网络分析'
                }
            }
        }
    });
}

/**
 * 加载模型配置
 */
async function loadModelConfig() {
    const modelEndpoint = document.getElementById('modelEndpoint');
    const modelSelect = document.getElementById('modelSelect');
    const temperatureRange = document.getElementById('temperatureRange');
    const maxTokensRange = document.getElementById('maxTokensRange');
    const temperatureValue = document.getElementById('temperatureValue');
    const maxTokensValue = document.getElementById('maxTokensValue');

    try {
        const response = await fetch('http://localhost:3001/api/ollama-config');

        if (response.ok) {
            const config = await response.json();

            // 更新表单值
            modelEndpoint.value = config.baseUrl || 'http://localhost:11434/api';

            // 如果下拉列表中有对应的模型，则选中它
            const modelOption = Array.from(modelSelect.options).find(option => option.value === config.model);
            if (modelOption) {
                modelSelect.value = config.model;
            }

            // 更新温度值
            if (config.temperature !== undefined) {
                temperatureRange.value = config.temperature;
                temperatureValue.textContent = config.temperature;
            }

            // 更新最大生成长度
            if (config.maxTokens !== undefined) {
                maxTokensRange.value = config.maxTokens;
                maxTokensValue.textContent = config.maxTokens;
            }
        }
    } catch (error) {
        console.error('加载模型配置失败:', error);
        // 使用默认值
    }
}

/**
 * 保存模型配置
 */
async function saveModelConfig() {
    const baseUrl = document.getElementById('modelEndpoint').value;
    const model = document.getElementById('modelSelect').value;
    const temperature = document.getElementById('temperatureRange').value;
    const maxTokens = document.getElementById('maxTokensRange').value;
    const testBeforeSave = document.getElementById('testConnection').checked;
    const connectionStatus = document.getElementById('connectionStatus');

    // 验证输入
    if (!baseUrl || !model) {
        connectionStatus.innerHTML = '<div class="alert alert-danger">请填写完整的配置信息</div>';
        return;
    }

    // 如果需要先测试连接
    if (testBeforeSave) {
        const testResult = await testModelConnection();
        if (!testResult) {
            return; // 如果测试失败，不保存配置
        }
    }

    // 保存配置到服务器
    try {
        connectionStatus.innerHTML = '<div class="alert alert-info">正在保存配置...</div>';

        const response = await fetch('http://localhost:3001/api/ollama-config', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                baseUrl,
                model,
                temperature: parseFloat(temperature),
                maxTokens: parseInt(maxTokens)
            })
        });

        if (response.ok) {
            connectionStatus.innerHTML = '<div class="alert alert-success">配置已成功保存</div>';
        } else {
            const errorData = await response.json();
            connectionStatus.innerHTML = `<div class="alert alert-danger">保存失败：${errorData.error || '未知错误'}</div>`;
        }
    } catch (error) {
        connectionStatus.innerHTML = `<div class="alert alert-danger">保存失败：${error.message}</div>`;
    }

    // 3秒后隐藏消息
    setTimeout(() => {
        connectionStatus.innerHTML = '';
    }, 3000);
}

/**
 * 测试模型连接
 * @returns {Promise<boolean>} 连接是否成功
 */
async function testModelConnection() {
    const baseUrl = document.getElementById('modelEndpoint').value;
    const model = document.getElementById('modelSelect').value;
    const connectionStatus = document.getElementById('connectionStatus');

    // 验证输入
    if (!baseUrl || !model) {
        connectionStatus.innerHTML = '<div class="alert alert-danger">请填写完整的配置信息</div>';
        return false;
    }

    connectionStatus.innerHTML = '<div class="alert alert-info">正在测试连接...</div>';

    try {
        const response = await fetch('http://localhost:3001/api/test-ollama-connection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                baseUrl,
                model
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                connectionStatus.innerHTML = '<div class="alert alert-success">连接成功！模型可用。</div>';
                return true;
            } else {
                connectionStatus.innerHTML = `<div class="alert alert-danger">连接失败：${data.error || '未知错误'}</div>`;
                return false;
            }
        } else {
            const errorData = await response.json();
            connectionStatus.innerHTML = `<div class="alert alert-danger">连接失败：${errorData.error || '未知错误'}</div>`;
            return false;
        }
    } catch (error) {
        connectionStatus.innerHTML = `<div class="alert alert-danger">连接失败：${error.message}</div>`;
        return false;
    }
}

/**
 * 保存分析配置
 */
function saveAnalysisConfig() {
    const autoAnalysis = document.getElementById('autoAnalysis').checked;
    const analysisDepth = document.getElementById('analysisDepth').value;

    // 保存配置
    const config = {
        autoAnalysis,
        analysisDepth
    };

    localStorage.setItem('analysisConfig', JSON.stringify(config));

    // 显示成功消息
    const configForm = document.getElementById('analysisConfigForm');
    const successMessage = document.createElement('div');
    successMessage.className = 'alert alert-success mt-3';
    successMessage.textContent = '分析配置已保存';
    configForm.appendChild(successMessage);

    // 3秒后隐藏消息
    setTimeout(() => {
        configForm.removeChild(successMessage);
    }, 3000);
}
