'use client';

import { useState, useEffect } from 'react';

interface Activity {
  id: string;
  timestamp: string;
  user: string;
  database: string;
  operation: string;
  table: string;
  rows: number;
  duration: string;
  status: 'success' | 'warning' | 'failed';
}

interface Database {
  id: string;
  name: string;
  status: 'online' | 'warning' | 'offline';
  activeConnections: number;
  qps: number;
  avgLatency: string;
  size: string;
}

const initialDatabases: Database[] = [
  {
    id: 'DB001',
    name: '公民信息数据库',
    status: 'online',
    activeConnections: 47,
    qps: 1247,
    avgLatency: '12ms',
    size: '2.4TB',
  },
  {
    id: 'DB002',
    name: '财务系统',
    status: 'online',
    activeConnections: 23,
    qps: 589,
    avgLatency: '8ms',
    size: '876GB',
  },
  {
    id: 'DB003',
    name: '档案管理系统',
    status: 'warning',
    activeConnections: 15,
    qps: 234,
    avgLatency: '45ms',
    size: '1.2TB',
  },
  {
    id: 'DB004',
    name: '人事管理系统',
    status: 'online',
    activeConnections: 31,
    qps: 678,
    avgLatency: '15ms',
    size: '432GB',
  },
];

const generateActivity = (): Activity => {
  const users = ['张三', '李四', '王五', '赵六', '系统用户'];
  const databases = ['公民信息数据库', '财务系统', '档案管理系统', '人事管理系统'];
  const operations = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
  const tables = ['users', 'records', 'transactions', 'logs', 'profiles'];
  const statuses: Array<'success' | 'warning' | 'failed'> = ['success', 'success', 'success', 'warning', 'success'];
  
  return {
    id: `ACT-${Date.now()}`,
    timestamp: new Date().toLocaleTimeString('zh-CN'),
    user: users[Math.floor(Math.random() * users.length)],
    database: databases[Math.floor(Math.random() * databases.length)],
    operation: operations[Math.floor(Math.random() * operations.length)],
    table: tables[Math.floor(Math.random() * tables.length)],
    rows: Math.floor(Math.random() * 1000),
    duration: `${Math.floor(Math.random() * 50)}ms`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
  };
};

export default function MonitorPage() {
  const [databases, setDatabases] = useState<Database[]>(initialDatabases);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const newActivity = generateActivity();
      setActivities(prev => [newActivity, ...prev].slice(0, 20));
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'offline':
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
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
        {/* Sidebar */}
        <aside className="w-64 bg-white shadow-sm min-h-screen">
          <nav className="mt-5 px-2">
            <a href="/" className="group w-full flex items-center px-2 py-3 text-sm font-medium rounded-lg mb-1 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              <span className="mr-3 text-lg">📊</span>
              系统概览
            </a>
            <a href="/access" className="group w-full flex items-center px-2 py-3 text-sm font-medium rounded-lg mb-1 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              <span className="mr-3 text-lg">🔐</span>
              访问控制
            </a>
            <a href="/monitor" className="group w-full flex items-center px-2 py-3 text-sm font-medium rounded-lg mb-1 bg-blue-50 text-blue-700 border border-blue-200">
              <span className="mr-3 text-lg">👁</span>
              实时监控
            </a>
            <a href="/alerts" className="group w-full flex items-center px-2 py-3 text-sm font-medium rounded-lg mb-1 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              <span className="mr-3 text-lg">🚨</span>
              异常警报
            </a>
            <a href="/audit" className="group w-full flex items-center px-2 py-3 text-sm font-medium rounded-lg mb-1 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
              <span className="mr-3 text-lg">📋</span>
              审计日志
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">实时数据库监控</h1>
                <p className="mt-1 text-sm text-slate-600">监控所有数据库访问活动和性能指标</p>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setIsLive(!isLive)}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg ${
                    isLive
                      ? 'text-white bg-green-600 hover:bg-green-700'
                      : 'text-slate-700 bg-slate-200 hover:bg-slate-300'
                  }`}
                >
                  {isLive ? '● 实时监控中' : '○ 已暂停'}
                </button>
              </div>
            </div>

            {/* Database Status Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {databases.map((db) => (
                <div key={db.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-slate-900">{db.name}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(db.status)}`}>
                      {db.status === 'online' ? '在线' : db.status === 'warning' ? '警告' : '离线'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">活跃连接</span>
                      <span className="font-medium text-slate-900">{db.activeConnections}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">QPS</span>
                      <span className="font-medium text-slate-900">{db.qps}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">平均延迟</span>
                      <span className="font-medium text-slate-900">{db.avgLatency}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">数据大小</span>
                      <span className="font-medium text-slate-900">{db.size}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Live Activity Feed */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">实时活动日志</h2>
              </div>
              <div className="p-6">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-4 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-pulse"
                      style={{ animationDuration: '1s' }}
                    >
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        activity.status === 'success' ? 'bg-green-500' :
                        activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500 text-xs">时间</p>
                            <p className="font-mono text-slate-900">{activity.timestamp}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">用户</p>
                            <p className="text-slate-900">{activity.user}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">数据库</p>
                            <p className="text-slate-900">{activity.database}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">操作</p>
                            <p className="font-mono font-medium text-slate-900">{activity.operation}</p>
                          </div>
                        </div>
                        <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500 text-xs">表</p>
                            <p className="font-mono text-slate-700">{activity.table}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">影响行数</p>
                            <p className="text-slate-700">{activity.rows}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">耗时</p>
                            <p className="font-mono text-slate-700">{activity.duration}</p>
                          </div>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        activity.status === 'success' ? 'bg-green-100 text-green-800' :
                        activity.status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {activity.status === 'success' ? '成功' : activity.status === 'warning' ? '警告' : '失败'}
                      </span>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                      <span className="text-4xl">📡</span>
                      <p className="mt-4">等待实时数据...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
