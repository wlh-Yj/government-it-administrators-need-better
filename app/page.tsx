'use client';

import { useState, useEffect } from 'react';

interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'warning' | 'critical' | 'info';
  user: string;
  action: string;
  database: string;
  status: 'active' | 'resolved' | 'investigating';
}

interface User {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'active' | 'terminated' | 'suspended';
  lastAccess: string;
}

const initialEvents: SecurityEvent[] = [
  {
    id: 'EVT-001',
    timestamp: '2026-06-03 11:45:23',
    type: 'critical',
    user: '张三 (IT部门-已离职)',
    action: '批量删除操作',
    database: '公民信息数据库',
    status: 'active',
  },
  {
    id: 'EVT-002',
    timestamp: '2026-06-03 11:30:15',
    type: 'warning',
    user: '李四 (安全团队)',
    action: '权限提升申请',
    database: '财务系统',
    status: 'investigating',
  },
  {
    id: 'EVT-003',
    timestamp: '2026-06-03 10:15:00',
    type: 'info',
    user: '王五 (数据管理员)',
    action: '常规数据备份',
    database: '档案管理系统',
    status: 'resolved',
  },
];

const initialUsers: User[] = [
  {
    id: 'U001',
    name: '张三',
    role: '数据库管理员',
    department: 'IT部门',
    status: 'terminated',
    lastAccess: '2026-06-03 11:45',
  },
  {
    id: 'U002',
    name: '李四',
    role: '安全分析师',
    department: '安全团队',
    status: 'active',
    lastAccess: '2026-06-03 11:30',
  },
  {
    id: 'U003',
    name: '王五',
    role: '数据管理员',
    department: '数据管理部',
    status: 'active',
    lastAccess: '2026-06-03 10:15',
  },
];

export default function Home() {
  const [events, setEvents] = useState<SecurityEvent[]>(initialEvents);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'access' | 'monitor' | 'alerts' | 'audit'>('dashboard');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical':
      case 'terminated':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
      case 'suspended':
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'resolved':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const revokeAccess = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'terminated' as const } : user
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Top Navigation */}
      <header className="bg-slate-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-xl font-bold">🛡</span>
                  </div>
                  <span className="text-xl font-semibold">GovDB Shield</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button className="p-1 rounded-full text-gray-300 hover:text-white focus:outline-none">
                  <span className="text-2xl">🔔</span>
                </button>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs flex items-center justify-center">2</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center">
                  <span className="text-sm">管</span>
                </div>
                <span className="text-sm">系统管理员</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-5 px-2">
            {[
              { key: 'dashboard', label: '系统概览', icon: '📊' },
              { key: 'access', label: '访问控制', icon: '🔐' },
              { key: 'monitor', label: '实时监控', icon: '👁' },
              { key: 'alerts', label: '异常警报', icon: '🚨' },
              { key: 'audit', label: '审计日志', icon: '📋' },
            ].map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key as any)}
                className={`group w-full flex items-center px-2 py-3 text-sm font-medium rounded-lg mb-1 transition-colors ${
                  activeTab === item.key
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
          
          <div className="mt-8 px-4">
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">系统状态</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">安全等级</span>
                  <span className="text-yellow-600 font-medium">中</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">活跃用户</span>
                  <span className="text-slate-900">47</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">待处理警报</span>
                  <span className="text-red-600 font-medium">2</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">系统概览</h1>
                <p className="mt-1 text-sm text-slate-600">实时监控数据库访问安全状态</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">✅</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-500">正常访问</p>
                      <p className="text-2xl font-semibold text-slate-900">1,247</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">⚠️</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-500">异常检测</p>
                      <p className="text-2xl font-semibold text-yellow-600">12</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🚨</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-500">严重警报</p>
                      <p className="text-2xl font-semibold text-red-600">2</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🔄</span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-slate-500">已回收权限</p>
                      <p className="text-2xl font-semibold text-blue-600">5</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Demo Section - Live Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Security Events */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">最近安全事件</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <div className={`w-3 h-3 rounded-full mt-2 ${
                            event.type === 'critical' ? 'bg-red-500' :
                            event.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                          }`}></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-slate-900">{event.id}</p>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(event.type)}`}>
                                {event.type === 'critical' ? '严重' : event.type === 'warning' ? '警告' : '信息'}
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-slate-600">{event.user}</p>
                            <p className="mt-1 text-sm text-slate-700">{event.action} - {event.database}</p>
                            <p className="mt-1 text-xs text-slate-500">{event.timestamp}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* User Access Management - Demo Moment */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                  <div className="p-6 border-b border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-900">离职员工权限自动回收</h2>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                              <span className="text-lg">{user.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.role} · {user.department}</p>
                              <p className="text-xs text-slate-400">最后访问: {user.lastAccess}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(user.status)}`}>
                              {user.status === 'active' ? '在职' : user.status === 'terminated' ? '已离职' : '已暂停'}
                            </span>
                            {user.status !== 'terminated' && (
                              <button
                                onClick={() => revokeAccess(user.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                              >
                                回收权限
                              </button>
                            )}
                            {user.status === 'terminated' && (
                              <span className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-slate-500">
                                ✓ 权限已回收
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="bg-gradient-to-r from-blue-600 to-slate-800 rounded-xl shadow-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-white">保护政府数据安全</h2>
                <p className="mt-3 text-lg text-blue-100">实时监控 · 自动响应 · 完整审计</p>
                <div className="mt-6 flex justify-center space-x-4">
                  <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-blue-900 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors">
                    配置安全策略
                  </button>
                  <button className="inline-flex items-center px-6 py-3 border border-white text-base font-medium rounded-lg text-white bg-transparent hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white transition-colors">
                    查看完整报告
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && (
            <div className="flex items-center justify-center h-96 bg-white rounded-xl shadow-sm border border-slate-200 border-dashed">
              <div className="text-center">
                <span className="text-6xl">🔨</span>
                <p className="mt-4 text-lg text-slate-600">功能开发中...</p>
                <p className="text-sm text-slate-400">此模块正在建设中</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
