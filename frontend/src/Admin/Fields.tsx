import  { useState } from 'react';
import { Search, Edit2, Trash2, MoreVertical, Plus, Briefcase, TrendingUp, Archive } from 'lucide-react';

// Sample fields data
const fieldsData = [
  { id: 1, name: 'Web Development', description: 'Development of websites and web apps', status: 'Active', candidates: 642 },
  { id: 2, name: 'UI/UX Design', description: 'Designing user interfaces and experiences', status: 'Active', candidates: 412 },
  { id: 3, name: 'Digital Marketing', description: 'Marketing & promotion of products/services', status: 'Active', candidates: 298 },
  { id: 4, name: 'Data Science', description: 'Working with data, ML, and analytics', status: 'Active', candidates: 256 },
  { id: 5, name: 'Mobile Development', description: 'Mobile app development (iOS & Android)', status: 'Active', candidates: 213 },
  { id: 6, name: 'DevOps', description: 'Deployment, CI/CD, and infrastructure', status: 'Active', candidates: 145 },
  { id: 7, name: 'AI / ML', description: 'Artificial Intelligence & Machine Learning', status: 'Active', candidates: 134 },
  { id: 8, name: 'HR & Recruitment', description: 'Hiring, talent management & HR operations', status: 'Active', candidates: 98 },
  { id: 9, name: 'Sales', description: 'Sales, business development & growth', status: 'Active', candidates: 87 },
  { id: 10, name: 'Content Writing', description: 'Content creation and copywriting', status: 'Inactive', candidates: 45 },
];

export default function Fields() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
 
  const activeFields = fieldsData.filter(f => f.status === 'Active').length;
  const inactiveFields = fieldsData.filter(f => f.status === 'Inactive').length;

  const filteredFields = fieldsData.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          field.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || field.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Fields</h1>
          <p className="text-sm text-gray-500">Manage candidate fields</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium flex items-center gap-2">
            <Plus size={16} /> Add Field
          </button>
        </div>
      </div>

      {/* Stats Cards with Icons on Left Side */}
      <div className="grid grid-cols-3 gap-8 mb-8">
        <StatCard 
          title="Total Fields" 
          value={fieldsData.length.toString()} 
          sub="100% of total" 
          icon={<Briefcase size={28} className="text-blue-500" />}
          bgColor="bg-blue-50"
          iconColor="text-blue-600"
        />
        <StatCard 
          title="Active Fields" 
          value={activeFields.toString()} 
          sub={`${Math.round(activeFields/fieldsData.length*100)}% of total`} 
          color="text-green-600"
          icon={<TrendingUp size={28} className="text-green-500" />}
          bgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard 
          title="Inactive Fields" 
          value={inactiveFields.toString()} 
          sub={`${Math.round(inactiveFields/fieldsData.length*100)}% of total`} 
          color="text-orange-500"
          icon={<Archive size={28} className="text-orange-500" />}
          bgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
       
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 mb-6 flex flex-wrap items-center gap-4">
        <div className="relative flex-grow min-w-[200px]">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by field name or description..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Fields Table - Same style as Candidates table */}
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-xs uppercase border-b bg-gray-50">
              <th className="p-4 w-12 text-center">#</th>
              <th className="p-4">Field Name</th>
              <th className="p-4">Description</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Candidates</th>
              <th className="p-4 text-center">Actions</th>
             </tr>
          </thead>
          <tbody className="text-sm">
            {filteredFields.map((field, index) => (
              <tr key={field.id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 text-center text-gray-700 font-medium">{index + 1}</td>
                <td className="p-4 font-medium text-gray-900">{field.name}</td>
                <td className="p-4 text-gray-500">{field.description}</td>
                <td className="p-4 text-center">
                  <span className={`inline-flex px-2 py-1 rounded-full text-[10px] font-medium ${
                    field.status === 'Active' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    {field.status}
                  </span>
                </td>
                <td className="p-4 text-center font-medium">{field.candidates}</td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button className="p-1 text-blue-500 hover:bg-blue-50 rounded transition-colors" title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors" title="Delete">
                      <Trash2 size={16} />
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
        <div className="px-6 py-4 border-t flex items-center justify-between text-sm text-gray-500 bg-gray-50">
          <p>Showing 1 to {filteredFields.length} of {fieldsData.length} fields</p>
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
const StatCard = ({ title, value, sub, color = "text-gray-900", icon, bgColor = "bg-gray-50", }: { title: string; value: string; sub: string; color?: string; icon?: React.ReactNode; bgColor?: string; iconColor?: string }) => (
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