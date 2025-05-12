/**
 * 智能分析功能集成脚本
 * 用于将智能分析功能集成到现有页面中
 */

// 等待页面加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 查找支部综合能力画像区域
    const portraitSection = findPortraitSection();
    
    if (portraitSection) {
        // 创建智能分析区域
        createIntelligentAnalysisSection(portraitSection);
    } else {
        console.error('未找到支部综合能力画像区域');
    }
});

/**
 * 查找支部综合能力画像区域
 * @returns {HTMLElement|null} 支部综合能力画像区域元素
 */
function findPortraitSection() {
    // 尝试通过标题文本查找
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    for (const heading of headings) {
        if (heading.textContent.includes('支部综合能力画像')) {
            return heading.closest('section') || heading.closest('div');
        }
    }
    
    // 尝试通过类名或ID查找
    const possibleSelectors = [
        '.portrait-section',
        '#portrait-section',
        '.branch-portrait',
        '#branch-portrait',
        '.radar-chart-container',
        '#radar-chart-container'
    ];
    
    for (const selector of possibleSelectors) {
        const element = document.querySelector(selector);
        if (element) {
            return element;
        }
    }
    
    // 如果找不到，返回页面的主要内容区域
    return document.querySelector('main') || document.querySelector('.main-content') || document.body;
}

/**
 * 创建智能分析区域
 * @param {HTMLElement} parentElement 父元素
 */
function createIntelligentAnalysisSection(parentElement) {
    // 创建智能分析区域容器
    const container = document.createElement('div');
    container.className = 'intelligent-analysis-container';
    container.style.marginTop = '30px';
    container.style.border = '1px solid #e8e8e8';
    container.style.borderRadius = '4px';
    container.style.padding = '20px';
    container.style.backgroundColor = '#fff';
    
    // 创建标题
    const title = document.createElement('h3');
    title.textContent = '智能分析与多维度对比';
    title.style.marginBottom = '20px';
    title.style.color = '#1890ff';
    container.appendChild(title);
    
    // 创建iframe
    const iframe = document.createElement('iframe');
    iframe.src = 'intelligent_analysis.html';
    iframe.style.width = '100%';
    iframe.style.height = '800px';
    iframe.style.border = 'none';
    iframe.style.overflow = 'hidden';
    container.appendChild(iframe);
    
    // 添加到父元素
    parentElement.appendChild(container);
    
    console.log('智能分析区域已创建');
}

// 如果页面已经加载完成，立即执行
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    const portraitSection = findPortraitSection();
    if (portraitSection) {
        createIntelligentAnalysisSection(portraitSection);
    } else {
        console.error('未找到支部综合能力画像区域');
    }
}
