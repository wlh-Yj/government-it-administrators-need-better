'use client';

import { useState, useMemo } from 'react';

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userRole: string;
  action: string;
  resource: string;
  result: 'success' | 'failed' | 'denied';
  ip: string;
  session: string;
  details: string;
  duration: string;
  recordsAffected: number;
}

interface ComplianceReport {
  id: string;
  name: string;
  type: string;
  date: string;
  status: 'Ready' | 'Generating' | 'Failed';
  downloadUrl: string;
  description: string;
}

const initialLogs: AuditLog[] = [
  {
    id: 'AUD-001',
    timestamp: '2026-06-03 11:48:23',
    user: '张三 (IT部门-已离职)',
    userRole: '数据库管理员',
    action: 'DELETE',
    resource: '公民信息数据库.users',
    result: 'denied',
    ip: '192.168.1.145',
    session: 'SESS-abc123',
    details: '操作被自动拦截 - 用户状态为已离职',
    duration: '12ms',
    recordsAffected: 0,
  },
  {
    id: 'AUD-002',
    timestamp: '2026-06-03 11:45:00',
    user: '张三 (IT部门-已离职)',
    userRole: '数据库管理员',
    action: 'LOGIN',
    resource: '系统认证',
    result: 'success',
    ip: '192.168.1.145',
    session: 'SESS-abc123',
    details: '用户登录成功，已标记为离职状态',
    duration: '180ms',
    recordsAffected: 0,
  },
  {
    id: 'AUD-003',
    timestamp: '2026-06-03 11:30:15',
    user: '李四 (安全团队)',
    userRole: '安全分析师',
    action: 'UPDATE',
    resource: '访问控制策略',
    result: 'success',
    ip: '10.0.0.52',
    session: 'SESS-def456',
    details: '更新了财务系统的访问时间限制策略',
    duration: '95ms',
    recordsAffected: 3,
  },
  {
    id: 'AUD-004',
    timestamp: '2026-06-03 10:45:00',
    user: '王五 (数据管理员)',
    userRole: '数据管理员',
    action: 'EXPORT',
    resource: '档案管理系统.records',
    result: 'success',
    ip: '10.0.0.89',
    session: 'SESS-ghi789',
    details: '导出月度报表数据，已记录审批',
    duration: '1.2s',
    recordsAffected: 2340,
  },
  {
    id: 'AUD-005',
    timestamp: '2026-06-03 10:15:00',
    user: '系统自动',
    userRole: '系统',
    action: 'REVOKE',
    resource: '用户权限',
    result: 'success',
    ip: '127.0.0.1',
    session: 'SYSTEM',
    details: 'HR系统触发 - 用户张三权限自动回收',
    duration: '320ms',
    recordsAffected: 0,
  },
  {
    id: 'AUD-006',
    timestamp: '2026-06-03 09:30:00',
    user: '赵六 (数据分析)',
    userRole: '数据分析师',
    action: 'SELECT',
    resource: '公民信息数据库.profiles',
    result: 'success',
    ip: '10.0.0.34',
    session: 'SESS-jkl012',
    details: '查询脱敏数据，符合合规要求',
    duration: '24ms',
    recordsAffected: 45,
  },
  {
    id: 'AUD-007',
    timestamp: '2026-06-03 09:15:00',
    user: '钱七 (应用系统)',
    userRole: '应用系统',
    action: 'INSERT',
    resource: '财务系统.transactions',
    result: 'success',
    ip: '10.0.1.10',
    session: 'SESS-mno345',
    details: '批量写入交易记录',
    duration: '450ms',
    recordsAffected: 120,
  },
];

const complianceReports: ComplianceReport[] = [
  {
    id: 'RPT-001',
    name: '季度安全审计报告',
    type: 'Security',
    date: '2026-04-01',
    status: 'Ready',
    downloadUrl: '#',
    description: '包含访问控制、异常检测、权限变更等完整安全审计内容',
  },
  {
    id: 'RPT-002',
    name: '数据访问合规性报告',
    type: 'Compliance',
    date: '2026-05-01',
    status: 'Ready',
    downloadUrl: '#',
    description: '符合等保2.0、GDPR等法规要求的数据访问合规报告',
  },
  {
    id: 'RPT-003',
    name: '内部威胁检测报告',
    type: 'Threat',
    date: '2026-05-15',
    status: 'Ready',
    downloadUrl: '#',
    description: '分析离职员工、权限滥用、异常时间访问等内部威胁情况',
  },
  {
    id: 'RPT-004',
    name: '数据脱敏效果评估报告',
    type: 'Privacy',
    date: '2026-05-20',
    status: 'Ready',
    downloadUrl: '#',
    description: '评估敏感数据脱敏处理效果，确保隐私保护合规',
  },
];

const complianceFrameworks = [
  { id: 'db20', name: '等级保护 2.0', status: 'Compliant', lastCheck: '2026-06-01' },
  { id: 'gdpr', name: 'GDPR', status: 'Compliant', lastCheck: '2026-05-15' },
  { id: 'hipaa', name: 'HIPAA', status: 'In Progress', lastCheck: '2026-04-20' },
  { id: 'pci', name: 'PCI DSS', status: 'Compliant', lastCheck: '2026-05-01' },
];

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>(initialLogs);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState<string>('all');
  const [filterAction, setFilterAction] = useState<string>('all');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesSearch = searchTerm === '' ||
        log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesResult = filterResult === 'all' || log.result === filterResult;
      const matchesAction = filterAction === 'all' || log.action === filterAction;
      return matchesSearch && matchesResult && matchesAction;
    });
  }, [logs, searchTerm, filterResult, filterAction]);

  const getResultColor = (result: string) => {
    switch (result) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'denied':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case 'success':
        return '成功';
      case 'failed':
        return '失败';
      case 'denied':
        return '拒绝';
      default:
        return '未知';
    }
  };

  const handleExport = () => {
    alert('正在导出审计报告...');
  };

  const handleGenerateReport = (reportType: string) => {
    alert(`正在生成 ${reportType} 报告...`);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">🛡</span>
              </div>
              <span className="text-xl font-semibold">GovDB Shield</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-5 px-2">
            <a href="/" className="group w-full flex items-center px-2 py-3 text-sm font-medium rounded-lg mb-1 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              <span className="mr-3 text-lg">📊</span>系统概览
            </a>
            <a href="/access" className="group w-full flex items-center px-2 py-3 text-sm font-medium rounded-lg mb-1 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              <span className="mr-3 text-lg">🔐</span>访问控制
            </a>
            <a href="/monitor" className="group w-full flex items-center px-2 py-3 text-sm font-medium rounded-lg mb-1 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              <span className="mr-3 text-lg">👁</span>实时监控
            </a>
            <a href="/alerts" className="group w-full flex items-center px-2 py-3 text-sm font-medium rounded-lg mb-1 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              <span className="mr-3 text-lg">🚨</span>异常警报
            </a>
            <a href="/audit" className="group w-full flex items-center px-2 py-3 text-sm font-medium rounded-lg mb-1 bg-blue-50 text-blue-700 border border-blue-200">
              <span className="mr-3 text-lg">📋</span>审计日志
            </a>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">活动审计日志</h1>
                <p className="mt-1 text-sm text-slate-600">完整的数据库访问活动记录，用于合规审计和安全调查</p>
              </div>
              <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                📥 导出审计报告
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <p className="text-sm font-medium text-slate-500">总审计记录</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">3,421</p>
                <p className="text-xs text-slate-400 mt-1">过去30天</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <p className="text-sm font-medium text-slate-500">成功操作</p>
                <p className="text-2xl font-semibold text-green-600 mt-1">3,289</p>
                <p className="text-xs text-slate-400 mt-1">96.1% 成功率</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <p className="text-sm font-medium text-slate-500">拒绝访问</p>
                <p className="text-2xl font-semibold text-orange-600 mt-1">87</p>
                <p className="text-xs text-slate-400 mt-1">包含23次离职员工尝试</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <p className="text-sm font-medium text-slate-500">失败操作</p>
                <p className="text-2xl font-semibold text-red-600 mt-1">45</p>
                <p className="text-xs text-slate-400 mt-1">需调查处理</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-[200px] text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={filterResult}
                onChange={(e) => setFilterResult(e.target.value)}
                className="text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">所有结果</option>
                <option value="success">成功</option>
                <option value="denied">拒绝</option>
                <option value="failed">失败</option>
              </select>
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">所有操作</option>
                <option value="SELECT">查询</option>
                <option value="INSERT">插入</option>
                <option value="UPDATE">更新</option>
                <option value="DELETE">删除</option>
                <option value="LOGIN">登录</option>
                <option value="EXPORT">导出</option>
                <option value="REVOKE">回收</option>
              </select>
              <span className="text-sm text-slate-500 ml-auto">显示 {filteredLogs.length} 条记录</span>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">时间</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">用户</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">操作</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">资源</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">结果</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">影响记录</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">详情</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {filteredLogs.map((log) => (
                      <tr
                        key={log.id}
                        className="hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedLog(log)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-900">{log.timestamp}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <p className="text-sm text-slate-900">{log.user}</p>
                          <p className="text-xs text-slate-500">{log.userRole}</p>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-mono font-semibold bg-slate-100 text-slate-800 rounded">{log.action}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700 font-mono">{log.resource}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getResultColor(log.result)}`}>
                            {getResultText(log.result)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                          {log.recordsAffected > 0 ? log.recordsAffected.toLocaleString() : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate" title={log.details}>{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredLogs.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                  <p className="text-lg">没有找到匹配的审计记录</p>
                  <p className="text-sm mt-1">请尝试调整筛选条件</p>
                </div>
              )}
            </div>

            {selectedLog && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-slate-900">审计记录详情 - {selectedLog.id}</h2>
                  <button
                    onClick={() => setSelectedLog(null)}
                    className="text-sm text-slate-500 hover:text-slate-700"
                  >
                    ✕ 关闭
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">时间</label>
                      <p className="text-sm text-slate-900 font-mono">{selectedLog.timestamp}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">用户</label>
                      <p className="text-sm text-slate-900">{selectedLog.user}</p>
                      <p className="text-xs text-slate-500">{selectedLog.userRole}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">操作</label>
                      <span className="ml-2 px-2 py-1 text-xs font-mono font-semibold bg-slate-100 text-slate-800 rounded">{selectedLog.action}</span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">资源</label>
                      <p className="text-sm text-slate-900 font-mono">{selectedLog.resource}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500">结果</label>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getResultColor(selectedLog.result)}`}>
                        {getResultText(selectedLog.result)}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">IP地址</label>
                      <p className="text-sm text-slate-900 font-mono">{selectedLog.ip}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">会话ID</label>
                      <p className="text-sm text-slate-900 font-mono">{selectedLog.session}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500">执行时长</label>
                      <p className="text-sm text-slate-900 font-mono">{selectedLog.duration}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <label className="text-sm font-medium text-slate-500">详情说明</label>
                  <p className="mt-1 text-sm text-slate-700 p-3 bg-slate-50 rounded-lg border border-slate-200">{selectedLog.details}</p>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">标记为已审查</button>
                  <button className="text-sm text-orange-600 hover:text-orange-800 font-medium">添加备注</button>
                  <button className="text-sm text-slate-600 hover:text-slate-800 font-medium">导出此记录</button>
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">合规管理工具包</h2>
                <p className="text-sm text-slate-600 mt-1">提供多法规合规支持、自动报告生成和合规检查</p>
              </div>
              <div className="p-6">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">合规状态概览</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  {complianceFrameworks.map((framework) => (
                    <div key={framework.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                      <h4 className="text-sm font-semibold text-slate-900">{framework.name}</h4>
                      <p className="text-xs text-slate-600 mt-1">
                        状态:
                        <span className={`ml-1 font-medium ${
                          framework.status === 'Compliant' ? 'text-green-600' :
                          framework.status === 'In Progress' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {framework.status}
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 mt-1">上次检查: {framework.lastCheck}</p>
                    </div>
                  ))}
                </div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">可用报告</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {complianceReports.map((report) => (
                    <div key={report.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{report.name}</h4>
                        <p className="text-xs text-slate-500 mt-1">{report.description}</p>
                        <p className="text-xs text-slate-400 mt-1">类型: {report.type} | 生成日期: {report.date}</p>
                      </div>
                      <button
                        onClick={() => handleGenerateReport(report.name)}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                      >
                        📄 下载
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
