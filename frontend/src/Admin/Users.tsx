import { useState } from 'react';
import { Search, Edit2, Trash2, MoreVertical, Plus, Users as UsersIcon, UserCheck, UserX, Clock, Shield, Lock, Mail } from 'lucide-react';

// Sample users data
const usersData = [
  { id: 1, name: 'Admin User', email: 'admin@workforcehs.com', role: 'Super Admin', status: 'Active', lastLogin: 'Jun 20, 2024 10:30 AM', avatar: 'https://i.pravatar.cc/150?u=admin' },
  { id: 2, name: 'Recruiter One', email: 'recruiter1@workforcehs.com', role: 'Recruiter', status: 'Active', lastLogin: 'Jun 20, 2024 09:15 AM', avatar: 'https://i.pravatar.cc/150?u=rec1' },
  { id: 3, name: 'Recruiter Two', email: 'recruiter2@workforcehs.com', role: 'Recruiter', status: 'Active', lastLogin: 'Jun 19, 2024 04:45 PM', avatar: 'https://i.pravatar.cc/150?u=rec2' },
  { id: 4, name: 'HR Manager', email: 'hr@workforcehs.com', role: 'HR Manager', status: 'Active', lastLogin: 'Jun 19, 2024 11:20 AM', avatar: 'https://i.pravatar.cc/150?u=hr' },
  { id: 5, name: 'Viewer User', email: 'viewer@workforcehs.com', role: 'Viewer', status: 'Inactive', lastLogin: 'Jun 18, 2024 02:10 PM', avatar: 'https://i.pravatar.cc/150?u=viewer' },
  { id: 6, name: 'Data Analyst', email: 'analyst@workforcehs.com', role: 'Analyst', status: 'Active', lastLogin: 'Jun 18, 2024 10:05 AM', avatar: 'https://i.pravatar.cc/150?u=analyst' },
  { id: 7, name: 'Sarah Johnson', email: 'sarah.j@workforcehs.com', role: 'Recruiter', status: 'Active', lastLogin: 'Jun 17, 2024 03:30 PM', avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: 8, name: 'Michael Chen', email: 'michael.c@workforcehs.com', role: 'Analyst', status: 'Active', lastLogin: 'Jun 16, 2024 01:45 PM', avatar: 'https://i.pravatar.cc/150?u=michael' },
  { id: 9, name: 'Lisa Wong', email: 'lisa.w@workforcehs.com', role: 'HR Manager', status: 'Inactive', lastLogin: 'Jun 15, 2024 11:00 AM', avatar: 'https://i.pravatar.cc/150?u=lisa' },
  { id: 10, name: 'David Kumar', email: 'david.k@workforcehs.com', role: 'Viewer', status: 'Active', lastLogin: 'Jun 14, 2024 09:30 AM', avatar: 'https://i.pravatar.cc/150?u=david' },
  { id: 11, name: 'Emma Wilson', email: 'emma.w@workforcehs.com', role: 'Recruiter', status: 'Active', lastLogin: 'Jun 13, 2024 02:15 PM', avatar: 'https://i.pravatar.cc/150?u=emma' },
  { id: 12, name: 'James Brown', email: 'james.b@workforcehs.com', role: 'Analyst', status: 'Active', lastLogin: 'Jun 12, 2024 10:45 AM', avatar: 'https://i.pravatar.cc/150?u=james' },
];

export default function Users() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const activeUsers = usersData.filter(u => u.status === 'Active').length;
  const inactiveUsers = usersData.filter(u => u.status === 'Inactive').length;

  // Get unique roles for filter
  const uniqueRoles = ['All', ...new Set(usersData.map(user => user.role))];

  const filteredUsers = usersData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Convert number to string for StatCard value prop
  const totalRolesValue = (uniqueRoles.length - 1).toString();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-gray-500">Manage system users and their permission</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <Plus size={16} /> Add User
          </button>
        </div>
      </div>

      {/* Stats Cards with Icons on Left Side */}
      <div className="grid grid-cols-4 gap-8 mb-8">
        <StatCard
          title="Total Users" 
          value={usersData.length.toString()} 
          sub="100% of total" 
          icon={<UsersIcon size={28} className="text-blue-500" />}
          bgColor="bg-blue-50"
        />
        <StatCard 
          title="Active Users" 
          value={activeUsers.toString()} 
          sub={`${Math.round(activeUsers/usersData.length*100)}% of total`} 
          color="text-green-600"
          icon={<UserCheck size={28} className="text-green-500" />}
          bgColor="bg-green-50"
        />
        <StatCard 
          title="Inactive Users" 
          value={inactiveUsers.toString()} 
          sub={`${Math.round(inactiveUsers/usersData.length*100)}% of total`} 
          color="text-orange-500"
          icon={<UserX size={28} className="text-orange-500" />}
          bgColor="bg-orange-50"
        />
        <StatCard 
          title="Total Roles" 
          value={totalRolesValue} 
          sub="Different user roles" 
          color="text-purple-600"
          icon={<Shield size={28} className="text-purple-500" />}
          bgColor="bg-purple-50"
        />
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-grow min-w-[250px]">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name, email or role..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="text-gray-600 text-xs uppercase border-b bg-gray-50">
              <th className="p-4 w-12 text-center">#</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Role</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4">Last Login</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredUsers.map((user, index) => (
              <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 text-center text-gray-700 font-medium">{index + 1}</td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} className="w-8 h-8 rounded-full object-cover" alt="" />
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Mail size={14} className="text-gray-400" />
                    <span>{user.email}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium ${
                    user.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' :
                    user.role === 'HR Manager' ? 'bg-blue-100 text-blue-700' :
                    user.role === 'Recruiter' ? 'bg-green-100 text-green-700' :
                    user.role === 'Analyst' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium ${
                    user.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} className="text-gray-400" />
                    <span>{user.lastLogin}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </button>
                    <button className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors" title="Reset Password">
                      <Lock size={16} />
                    </button>
                    <button className="p-1 text-gray-400 hover:bg-gray-100 rounded transition-colors" title="More">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between text-sm text-gray-500 bg-gray-50 flex-wrap gap-4">
          <p>Showing 1 to {filteredUsers.length} of {usersData.length} users</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded-md hover:bg-white transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
            <button className="px-3 py-1 border rounded-md hover:bg-white transition-colors">2</button>
            <button className="px-3 py-1 border rounded-md hover:bg-white transition-colors">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Stat Card component with icon on left side
const StatCard = ({ title, value, sub, color = "text-gray-900", icon, bgColor = "bg-gray-50" }: { title: string; value: string; sub: string; color?: string; icon?: React.ReactNode; bgColor?: string }) => (
  <div className="bg-white p-6 rounded-2xl border shadow-sm transition-all hover:shadow-md">
    <div className="flex items-start gap-4">
      {icon && (
        <div className={`p-3 rounded-xl ${bgColor}`}>
          {icon}
        </div>
      )}
      <div className="flex-1">
        <p className="text-gray-400 text-xs uppercase tracking-wider">{title}</p>
        <h3 className={`text-3xl font-bold ${color} mt-2`}>{value}</h3>
        <p className="text-xs text-gray-400 mt-1">{sub}</p>
      </div>
    </div>
  </div>
);
