'use client';

import { useState } from 'react';

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

interface AccessPolicy {
  id: string;
  name: string;
  database: string;
  role: string;
  condition: string;
  status: 'active' | 'inactive';
}

const initialRoles: Role[] = [
  {
    id: 'R001',
    name: '数据库管理员',
    description: '完全访问所有数据库功能',
    permissions: ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER'],
    userCount: 3,
  },
  {
    id: 'R002',
    name: '数据分析师',
    description: '只读访问用于数据分析',
    permissions: ['SELECT'],
    userCount: 12,
  },
  {
    id: 'R003',
    name: '应用系统',
    description: '应用程序标准访问',
    permissions: ['SELECT', 'INSERT', 'UPDATE'],
    userCount: 8,
  },
  {
    id: 'R004',
    name: '审计员',
    description: '只读访问审计日志',
    permissions: ['SELECT'],
    userCount: 5,
  },
];

const initialPolicies: AccessPolicy[] = [
  {
    id: 'P001',
    name: '工作时间访问',
    database: '公民信息数据库',
    role: '数据分析师',
    condition: '时间: 08:00-18:00, 周一至周五',
    status: 'active',
  },
  {
    id: 'P002',
    name: '敏感数据保护',
    database: '财务系统',
    role: '应用系统',
    condition: 'IP白名单: 10.0.0.0/24',
    status: 'active',
  },
  {
    id: 'P003',
    name: '离职员工限制',
    database: '所有数据库',
    role: '所有离职用户',
    condition: '立即撤销所有权限',
    status: 'active',
  },
];

export default function AccessControlPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [policies, setPolicies] = useState<AccessPolicy[]>(initialPolicies);
  const [activeTab, setActiveTab] = useState<'roles' | 'policies'>('roles');

  const togglePolicyStatus = (policyId: string) => {
    setPolicies(policies.map(policy => 
      policy.id === policyId 
        ? { ...policy, status: policy.status === 'active' ? 'inactive' : 'active' }
        : policy
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header (simplified for page) */}
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
            <a href="/access" className="group w-full flex items-center px-2 py-3 text-sm font-medium rounded-lg mb-1 bg-blue-50 text-blue-700 border border-blue-200">
              <span className="mr-3 text-lg">🔐</span>
              访问控制
            </a>
            <a href="/monitor" className="group w-full flex items-center px-2 py-3 text-sm font-medium rounded-lg mb-1 text-gray-700 hover:bg-gray-50 hover:text-gray-900">
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
                <h1 className="text-2xl font-bold text-slate-900">访问控制策略</h1>
                <p className="mt-1 text-sm text-slate-600">基于角色的动态访问控制管理</p>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                + 创建新策略
              </button>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('roles')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'roles'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  角色管理
                </button>
                <button
                  onClick={() => setActiveTab('policies')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'policies'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                  }`}
                >
                  访问策略
                </button>
              </nav>
            </div>

            {activeTab === 'roles' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {roles.map((role) => (
                  <div key={role.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">{role.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">{role.description}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                        {role.userCount} 用户
                      </span>
                    </div>
                    <div className="mt-4">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">权限</p>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((perm, idx) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700">
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 flex space-x-3">
                      <button className="inline-flex items-center px-3 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        编辑
                      </button>
                      <button className="inline-flex items-center px-3 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        管理用户
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'policies' && (
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">策略名称</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">数据库</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">适用角色</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">条件</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">状态</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">操作</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {policies.map((policy) => (
                        <tr key={policy.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-slate-900">{policy.name}</div>
                            <div className="text-xs text-slate-500">ID: {policy.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {policy.database}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {policy.role}
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                            {policy.condition}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                              policy.status === 'active'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                            }`}>
                              {policy.status === 'active' ? '启用' : '禁用'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-3">
                              <button className="text-blue-600 hover:text-blue-900">编辑</button>
                              <button 
                                onClick={() => togglePolicyStatus(policy.id)}
                                className={policy.status === 'active' ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                              >
                                {policy.status === 'active' ? '禁用' : '启用'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
