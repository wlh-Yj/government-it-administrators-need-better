'use client';

import { useState } from 'react';

interface Alert {
  id: string;
  timestamp: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  user: string;
  database: string;
  status: 'new' | 'investigating' | 'resolved' | 'dismissed';
  action: string;
}

const initialAlerts: Alert[] = [
  {
    id: 'ALT-001',
    timestamp: '2026-06-03 11:48:00',
    severity: 'critical',
    title: '离职员工尝试批量删除数据',
    description: '用户张三（已离职状态）在公民信息数据库执行了DELETE操作，影响行数超过10,000行',
    user: '张三 (IT部门-已离职)',
    database: '公民信息数据库',
    status: 'new',
    action: '已自动阻止操作并冻结账户',
  },
  {
    id: 'ALT-002',
    timestamp: '2026-06-03 11:32:00',
    severity: 'high',
    title: '非工作时间异常登录',
    description: '用户李四在非工作时间（凌晨2:15）从异常IP地址登录财务系统',
    user: '李四 (安全团队)',
    database: '财务系统',
    status: 'investigating',
    action: '已通知安全管理员审核',
  },
  {
    id: 'ALT-003',
    timestamp: '2026-06-03 10:20:00',
    severity: 'medium',
    title: '权限提升请求异常',
    description: '用户赵六申请从"只读"角色升级为"管理员"角色，但未通过部门主管审批流程',
    user: '赵六 (数据分析)',
    database: '人事管理系统',
    status: 'new',
    action: '已暂缓权限变更，等待审批',
  },
  {
    id: 'ALT-004',
    timestamp: '2026-06-03 09:45:00',
    severity: 'low',
    title: '数据库查询频率异常',
    description: '用户王五在过去1小时内执行了超过500次SELECT查询，超出正常范围30%',
    user: '王五 (数据管理员)',
    database: '档案管理系统',
    status: 'resolved',
    action: '确认为定期报表生成任务，已标记为正常',
  },
  {
    id: 'ALT-005',
    timestamp: '2026-06-02 22:10:00',
    severity: 'medium',
    title: '敏感数据导出行为',
    description: '系统检测到从公民信息数据库导出大量个人身份信息的操作',
    user: '孙七 (审计部门)',
    database: '公民信息数据库',
    status: 'dismissed',
    action: '确认为授权审计任务',
  },
];

const severityConfig = {
  critical: { label: '严重', color: 'bg-red-100 text-red-800 border-red-200', dot: 'bg-red-500' },
  high: { label: '高', color: 'bg-orange-100 text-orange-800 border-orange-200', dot: 'bg-orange-500' },
  medium: { label: '中', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', dot: 'bg-yellow-500' },
  low: { label: '低', color: 'bg-blue-100 text-blue-800 border-blue-200', dot: 'bg-blue-500' },
};

const statusConfig = {
  new: { label: '新建', color: 'bg-red-100 text-red-800 border-red-200' },
  investigating: { label: '调查中', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  resolved: { label: '已解决', color: 'bg-green-100 text-green-800 border-green-200' },
  dismissed: { label: '已忽略', color: 'bg-gray-100 text-gray-800 border-gray-200' },
};

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const updateAlertStatus = (alertId: string, newStatus: Alert['status']) => {
    setAlerts(alerts.map(a => a.id === alertId ? { ...a, status: newStatus } : a));
  };

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    if (filterStatus !== 'all' && a.status !== filterStatus) return false;
    return true;
  });

  const counts = {
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    low: alerts.filter(a => a.severity === 'low').length,
    new: alerts.filter(a => a.status === 'new').length,
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
            <a href="/alerts" className="group w-full flex items-center px-2 py-3 text-sm font-medium rounded-lg mb-1 bg-blue-50 text-blue-700 border border-blue-200">
              <span className="mr-3 text-lg">🚨</span>异常警报
            </a>
            <a href="/audit" className="group w-full flex items-center px-2 py-3 text-sm font-medium rounded-lg mb-1 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              <span className="mr-3 text-lg">📋</span>审计日志
            </a>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">异常行为警报</h1>
                <p className="mt-1 text-sm text-slate-600">检测和响应数据库异常访问行为</p>
              </div>
            </div>

            {/* Severity Summary */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {(['critical', 'high', 'medium', 'low'] as const).map(sev => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(filterSeverity === sev ? 'all' : sev)}
                  className={`p-4 rounded-xl border text-left transition-colors ${
                    filterSeverity === sev ? 'ring-2 ring-blue-500' : ''
                  } bg-white border-slate-200 shadow-sm`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full ${severityConfig[sev].dot}`}></div>
                      <span className="text-sm font-medium text-slate-700">{severityConfig[sev].label}</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900">{counts[sev]}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Filter Bar */}
            <div className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
              <span className="text-sm text-slate-500">筛选:</span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">所有状态</option>
                <option value="new">新建</option>
                <option value="investigating">调查中</option>
                <option value="resolved">已解决</option>
                <option value="dismissed">已忽略</option>
              </select>
              <span className="text-sm text-slate-400">|</span>
              <span className="text-sm text-slate-500">共 {filteredAlerts.length} 条警报</span>
            </div>

            {/* Alert Cards */}
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`bg-white rounded-xl shadow-sm border p-6 ${
                    alert.severity === 'critical' ? 'border-red-300 border-l-4 border-l-red-500' :
                    alert.severity === 'high' ? 'border-orange-300 border-l-4 border-l-orange-500' :
                    'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${severityConfig[alert.severity].color}`}>
                          {severityConfig[alert.severity].label}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[alert.status].color}`}>
                          {statusConfig[alert.status].label}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{alert.id}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900">{alert.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{alert.description}</p>
                      <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-slate-500">用户: </span>
                          <span className="text-slate-900">{alert.user}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">数据库: </span>
                          <span className="text-slate-900">{alert.database}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">时间: </span>
                          <span className="font-mono text-slate-900">{alert.timestamp}</span>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">自动响应: </span>{alert.action}
                        </p>
                      </div>
                    </div>
                  </div>

                  {alert.status === 'new' && (
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'investigating')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-yellow-600 hover:bg-yellow-700"
                      >
                        开始调查
                      </button>
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'resolved')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700"
                      >
                        标记已解决
                      </button>
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'dismissed')}
                        className="inline-flex items-center px-3 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50"
                      >
                        忽略
                      </button>
                    </div>
                  )}
                  {alert.status === 'investigating' && (
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => updateAlertStatus(alert.id, 'resolved')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-green-600 hover:bg-green-700"
                      >
                        标记已解决
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
