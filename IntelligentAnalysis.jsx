import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spin, Alert, Tabs, Tag, Divider, Button, Typography, Space } from 'antd';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, 
         BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

/**
 * 智能分析组件
 * 展示支部综合能力画像下的智能分析区域
 */
const IntelligentAnalysis = ({ branchData, comparisonData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [labels, setLabels] = useState([]);
  const [analysis, setAnalysis] = useState({
    evaluation: '',
    advantages: [],
    suggestions: []
  });
  const [comparison, setComparison] = useState({
    conclusion: '',
    advantages: [],
    improvements: []
  });

  // 获取标签
  useEffect(() => {
    if (branchData && branchData.scores) {
      setLoading(true);
      axios.post('/api/branch-portrait', { scores: branchData.scores })
        .then(response => {
          setLabels(response.data.labels || []);
          setError(null);
        })
        .catch(err => {
          console.error('获取标签失败:', err);
          setError('获取标签失败，请稍后再试');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [branchData]);

  // 获取AI分析
  const fetchAIAnalysis = () => {
    if (branchData && branchData.scores) {
      setLoading(true);
      axios.post('/api/ai-analysis', { branchData })
        .then(response => {
          setAnalysis(response.data || {
            evaluation: '',
            advantages: [],
            suggestions: []
          });
          setError(null);
        })
        .catch(err => {
          console.error('AI分析失败:', err);
          setError('AI分析服务暂时不可用，请稍后再试');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // 获取对比分析
  const fetchComparisonAnalysis = () => {
    if (branchData && comparisonData) {
      setLoading(true);
      axios.post('/api/comparison-analysis', { currentBranch: branchData, comparisonData })
        .then(response => {
          setComparison(response.data || {
            conclusion: '',
            advantages: [],
            improvements: []
          });
          setError(null);
        })
        .catch(err => {
          console.error('对比分析失败:', err);
          setError('对比分析服务暂时不可用，请稍后再试');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  // 准备雷达图数据
  const prepareRadarData = () => {
    if (!branchData || !branchData.scores || !comparisonData || !comparisonData.average) {
      return [];
    }

    return [
      {
        subject: '组织建设',
        current: branchData.scores.organization || 0,
        average: comparisonData.average.organization || 0,
        target: comparisonData.target ? (comparisonData.target.organization || 85) : 85,
        fullMark: 100
      },
      {
        subject: '思想政治',
        current: branchData.scores.political || 0,
        average: comparisonData.average.political || 0,
        target: comparisonData.target ? (comparisonData.target.political || 85) : 85,
        fullMark: 100
      },
      {
        subject: '业务工作',
        current: branchData.scores.business || 0,
        average: comparisonData.average.business || 0,
        target: comparisonData.target ? (comparisonData.target.business || 85) : 85,
        fullMark: 100
      },
      {
        subject: '群众工作',
        current: branchData.scores.masses || 0,
        average: comparisonData.average.masses || 0,
        target: comparisonData.target ? (comparisonData.target.masses || 85) : 85,
        fullMark: 100
      },
      {
        subject: '党风廉政',
        current: branchData.scores.discipline || 0,
        average: comparisonData.average.discipline || 0,
        target: comparisonData.target ? (comparisonData.target.discipline || 85) : 85,
        fullMark: 100
      }
    ];
  };

  // 准备柱状图数据
  const prepareBarData = () => {
    if (!branchData || !branchData.scores) {
      return [];
    }

    return [
      {
        name: '组织建设',
        current: branchData.scores.organization || 0,
        average: comparisonData?.average?.organization || 0,
        target: comparisonData?.target?.organization || 85
      },
      {
        name: '思想政治',
        current: branchData.scores.political || 0,
        average: comparisonData?.average?.political || 0,
        target: comparisonData?.target?.political || 85
      },
      {
        name: '业务工作',
        current: branchData.scores.business || 0,
        average: comparisonData?.average?.business || 0,
        target: comparisonData?.target?.business || 85
      },
      {
        name: '群众工作',
        current: branchData.scores.masses || 0,
        average: comparisonData?.average?.masses || 0,
        target: comparisonData?.target?.masses || 85
      },
      {
        name: '党风廉政',
        current: branchData.scores.discipline || 0,
        average: comparisonData?.average?.discipline || 0,
        target: comparisonData?.target?.discipline || 85
      }
    ];
  };

  // 渲染标签
  const renderLabels = () => {
    if (!labels || labels.length === 0) {
      return <Text type="secondary">暂无标签</Text>;
    }

    return (
      <Space size={[8, 16]} wrap>
        {labels.map((label, index) => (
          <Tag 
            key={index} 
            color={label.type === 'positive' ? '#108ee9' : '#f50'}
            style={{ fontSize: '14px', padding: '4px 8px' }}
          >
            {label.name}
          </Tag>
        ))}
      </Space>
    );
  };

  return (
    <div className="intelligent-analysis-container">
      <Card 
        title={<Title level={4}>智能分析与多维度对比</Title>}
        bordered={false}
        style={{ width: '100%', marginBottom: '20px' }}
      >
        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: '16px' }} />}
        
        <Tabs defaultActiveKey="1">
          <TabPane tab="支部标签" key="1">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card title="支部特征标签" bordered={false}>
                  <Spin spinning={loading}>
                    {renderLabels()}
                  </Spin>
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="AI智能分析" key="2">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card 
                  title="支部综合分析" 
                  bordered={false}
                  extra={<Button type="primary" onClick={fetchAIAnalysis}>生成分析</Button>}
                >
                  <Spin spinning={loading}>
                    <Paragraph>{analysis.evaluation || '点击"生成分析"按钮获取AI分析结果'}</Paragraph>
                    
                    <Divider orientation="left">优势分析</Divider>
                    <ul>
                      {analysis.advantages && analysis.advantages.length > 0 ? (
                        analysis.advantages.map((item, index) => (
                          <li key={index}><Paragraph>{item}</Paragraph></li>
                        ))
                      ) : (
                        <li><Text type="secondary">暂无数据</Text></li>
                      )}
                    </ul>
                    
                    <Divider orientation="left">改进建议</Divider>
                    <ul>
                      {analysis.suggestions && analysis.suggestions.length > 0 ? (
                        analysis.suggestions.map((item, index) => (
                          <li key={index}><Paragraph>{item}</Paragraph></li>
                        ))
                      ) : (
                        <li><Text type="secondary">暂无数据</Text></li>
                      )}
                    </ul>
                  </Spin>
                </Card>
              </Col>
            </Row>
          </TabPane>
          
          <TabPane tab="多维度对比" key="3">
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="雷达图对比" bordered={false}>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={prepareRadarData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar name="当前支部" dataKey="current" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                      <Radar name="平均水平" dataKey="average" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.6} />
                      <Radar name="目标水平" dataKey="target" stroke="#ffc658" fill="#ffc658" fillOpacity={0.6} />
                      <Legend />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="柱状图对比" bordered={false}>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={prepareBarData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="current" name="当前支部" fill="#8884d8" />
                      <Bar dataKey="average" name="平均水平" fill="#82ca9d" />
                      <Bar dataKey="target" name="目标水平" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </Col>
              
              <Col span={24}>
                <Card 
                  title="对比分析结论" 
                  bordered={false}
                  extra={<Button type="primary" onClick={fetchComparisonAnalysis}>生成对比分析</Button>}
                >
                  <Spin spinning={loading}>
                    <Paragraph>{comparison.conclusion || '点击"生成对比分析"按钮获取AI分析结果'}</Paragraph>
                    
                    <Divider orientation="left">相对优势</Divider>
                    <ul>
                      {comparison.advantages && comparison.advantages.length > 0 ? (
                        comparison.advantages.map((item, index) => (
                          <li key={index}><Paragraph>{item}</Paragraph></li>
                        ))
                      ) : (
                        <li><Text type="secondary">暂无数据</Text></li>
                      )}
                    </ul>
                    
                    <Divider orientation="left">提升建议</Divider>
                    <ul>
                      {comparison.improvements && comparison.improvements.length > 0 ? (
                        comparison.improvements.map((item, index) => (
                          <li key={index}><Paragraph>{item}</Paragraph></li>
                        ))
                      ) : (
                        <li><Text type="secondary">暂无数据</Text></li>
                      )}
                    </ul>
                  </Spin>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default IntelligentAnalysis;
