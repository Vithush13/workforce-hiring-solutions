import { useMemo, useState } from "react";
import { 
   Filter, ChevronDown, XCircle, Calendar, Briefcase,  Clock, 
} from 'lucide-react';

type SalaryFilters = {
  field: string;
  experience: string;
  fromDate: string;
  toDate: string;
};

type SalaryDistribution = {
  field: string;
  experience: string;
  minimum: number;
  maximum: number;
  count: number;
  updatedAt: string;
};

const initialFilters: SalaryFilters = {
  field: "All Fields",
  experience: "All Experience",
  fromDate: "2026-04-01",
  toDate: "2026-05-19",
};

const salaryMockData: SalaryDistribution[] = [
  { field: "Web Development", experience: "0-2 Years", minimum: 62000, maximum: 92000, count: 386, updatedAt: "2026-05-16" },
  { field: "Web Development", experience: "3-5 Years", minimum: 82000, maximum: 132000, count: 512, updatedAt: "2026-05-18" },
  { field: "Web Development", experience: "6-8 Years", minimum: 108000, maximum: 168000, count: 284, updatedAt: "2026-05-12" },
  { field: "Data Science", experience: "0-2 Years", minimum: 56000, maximum: 86000, count: 232, updatedAt: "2026-05-11" },
  { field: "Data Science", experience: "3-5 Years", minimum: 74000, maximum: 118000, count: 296, updatedAt: "2026-05-09" },
  { field: "UI/UX Design", experience: "3-5 Years", minimum: 70000, maximum: 116000, count: 218, updatedAt: "2026-04-28" },
  { field: "Quality Assurance", experience: "0-2 Years", minimum: 50000, maximum: 78000, count: 178, updatedAt: "2026-05-07" },
  { field: "DevOps", experience: "6-8 Years", minimum: 114000, maximum: 182000, count: 196, updatedAt: "2026-05-17" },
  { field: "HR & Recruitment", experience: "9+ Years", minimum: 84000, maximum: 134000, count: 156, updatedAt: "2026-04-20" },
];

const fieldOptions = ["All Fields", "Web Development", "Data Science", "UI/UX Design", "DevOps", "HR & Recruitment", "Quality Assurance"];
const experienceOptions = ["All Experience", "0-2 Years", "3-5 Years", "6-8 Years", "9+ Years"];

const isDateRangeValid = (fromDate: string, toDate: string) => {
  return fromDate && toDate && new Date(fromDate) <= new Date(toDate);
};


export default function SalaryInsights() {
  const [searchTerm, setSearchTerm] = useState('');
  const [draftFilters, setDraftFilters] = useState<SalaryFilters>(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState<SalaryFilters>(initialFilters);
  const dateRangeValid = isDateRangeValid(draftFilters.fromDate, draftFilters.toDate);

  const filteredSalaryData = useMemo(
    () =>
      salaryMockData.filter((item) => {
        const updatedTime = new Date(item.updatedAt).getTime();
        const fromTime = appliedFilters.fromDate
          ? new Date(appliedFilters.fromDate).getTime()
          : Number.NEGATIVE_INFINITY;
        const toTime = appliedFilters.toDate ? new Date(appliedFilters.toDate).getTime() : Number.POSITIVE_INFINITY;

        return (
          (appliedFilters.field === "All Fields" || item.field === appliedFilters.field) &&
          (appliedFilters.experience === "All Experience" || item.experience === appliedFilters.experience) &&
          updatedTime >= fromTime &&
          updatedTime <= toTime
        );
      }),
    [appliedFilters],
  );

  // Static salary range data matching the image
  const salaryRangeStaticData = [
    { range: "0 - 40K", count: 96, percentage: 0.8 },
    { range: "40K - 60K", count: 248, percentage: 10.1 },
    { range: "60K - 80K", count: 412, percentage: 16.4 },
    { range: "80K - 100K", count: 548, percentage: 23.1 },
    { range: "100K - 120K", count: 674, percentage: 27.4 },
    { range: "120K - 200K", count: 312, percentage: 12.7 },
    { range: "200K+", count: 148, percentage: 6.0 },
  ];

  // Salary distribution by field data matching the image concept
  const salaryDistributionFields = [
    { field: "Web Dev", minSalary: 62000, maxSalary: 168000, count: 1182 },
    { field: "Data Sci", minSalary: 56000, maxSalary: 118000, count: 528 },
    { field: "UI/UX", minSalary: 70000, maxSalary: 116000, count: 218 },
    { field: "DevOps", minSalary: 114000, maxSalary: 182000, count: 196 },
    { field: "HR", minSalary: 84000, maxSalary: 134000, count: 156 },
    { field: "QA", minSalary: 50000, maxSalary: 78000, count: 178 },
  ];

  const totalCandidates = 2458;
  const avgMinSalary = 72500;
  const avgMaxSalary = 125300;
  const highestRange = "$200K+";

  const hasActiveFilters = draftFilters.field !== "All Fields" || 
                          draftFilters.experience !== "All Experience" ||
                          draftFilters.fromDate !== initialFilters.fromDate ||
                          draftFilters.toDate !== initialFilters.toDate;

  const clearAllFilters = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  const maxSalary = Math.max(...salaryDistributionFields.map(d => d.maxSalary), 1);
  const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Salary Insights</h1>
          <p className="text-sm text-gray-500">Insights about salary ranges</p>
        </div>
        
      </div>



      {/* Search and Filters Section */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 mb-6 flex flex-wrap items-center gap-4">
       
        
        <div className="relative">
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white">
            <Briefcase size={16} className="text-gray-400" />
            <select 
              className="bg-transparent focus:outline-none cursor-pointer"
              value={draftFilters.field}
              onChange={(e) => setDraftFilters({ ...draftFilters, field: e.target.value })}
            >
              {fieldOptions.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white">
            <Clock size={16} className="text-gray-400" />
            <select 
              className="bg-transparent focus:outline-none cursor-pointer"
              value={draftFilters.experience}
              onChange={(e) => setDraftFilters({ ...draftFilters, experience: e.target.value })}
            >
              {experienceOptions.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
            <ChevronDown size={14} className="text-gray-400" />
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 bg-white">
            <Calendar size={16} className="text-gray-400" />
            <input 
              type="date" 
              className="bg-transparent focus:outline-none w-32"
              value={draftFilters.fromDate}
              onChange={(e) => setDraftFilters({ ...draftFilters, fromDate: e.target.value })}
            />
            <span className="text-gray-400">to</span>
            <input 
              type="date" 
              className="bg-transparent focus:outline-none w-32"
              value={draftFilters.toDate}
              onChange={(e) => setDraftFilters({ ...draftFilters, toDate: e.target.value })}
            />
          </div>
        </div>

        <button 
          className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => setAppliedFilters(draftFilters)}
          disabled={!dateRangeValid}
        >
          <Filter size={16} /> Apply Filters
        </button>

        {hasActiveFilters && (
          <button 
            className="bg-white text-red-500 px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors border border-gray-200 flex items-center gap-2"
            onClick={clearAllFilters}
          >
            <XCircle size={16} /> Clear Filters
          </button>
        )}
      </div>

      {/* Salary Distribution and Overview Side by Side - 2/3 and 1/3 width */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Salary Distribution Section - Left Side (2/3 width) */}
        <div className="col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-900">Salary Distribution (Next 3 Years)</h2>
            <span className="text-xs text-gray-400">Minimum to Beyond</span>
          </div>
          <p className="text-sm text-gray-500 mb-6">Salary Range (YTD)</p>
          
          <div className="h-80">
            <div className="flex items-end gap-3 h-64">
              {salaryDistributionFields.map((item, idx) => {
                const height = (item.maxSalary / maxSalary) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500 cursor-pointer relative group"
                      style={{ height: `${Math.max(height, 10)}%`, minHeight: '30px' }}
                    >
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {item.count} candidates
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 text-center">{item.field}</span>
                    <span className="text-xs font-medium text-gray-700">${(item.minSalary / 1000).toFixed(0)}K - ${(item.maxSalary / 1000).toFixed(0)}K</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Overview Section - Right Side (1/3 width) */}
        <div className="col-span-1 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Overview</h2>
          <div className="space-y-4">
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Average Minimum Salary</p>
              <p className="text-xl font-bold text-gray-900">${avgMinSalary.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">per year</p>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Average Maximum Salary</p>
              <p className="text-xl font-bold text-green-600">${avgMaxSalary.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">per year</p>
            </div>
            <div className="border-b border-gray-100 pb-3">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Highest Salary Range</p>
              <p className="text-xl font-bold text-purple-600">{highestRange}</p>
              <p className="text-xs text-gray-400 mt-1">per year</p>
            </div>
            <div className="pb-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Candidates</p>
              <p className="text-xl font-bold text-orange-600">{totalCandidates.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-1">across all ranges</p>
            </div>
          </div>
        </div>
      </div>

      {/* Candidates by Salary Range and Salary Range by Experience in same row */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Candidates by Salary Range - Donut Chart (Left Side) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Candidates by Salary Range</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative flex justify-center">
              <div className="w-48 h-48">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {(() => {
                    let currentAngle = 0;
                    const total = salaryRangeStaticData.reduce((sum, d) => sum + d.count, 0);
                    return salaryRangeStaticData.map((item, idx) => {
                      const percentage = (item.count / total) * 100;
                      const angle = (percentage / 100) * 360;
                      const startAngle = currentAngle;
                      const endAngle = currentAngle + angle;
                      currentAngle = endAngle;
                      
                      const startRad = (startAngle * Math.PI) / 180;
                      const endRad = (endAngle * Math.PI) / 180;
                      
                      const x1 = 50 + 40 * Math.cos(startRad);
                      const y1 = 50 + 40 * Math.sin(startRad);
                      const x2 = 50 + 40 * Math.cos(endRad);
                      const y2 = 50 + 40 * Math.sin(endRad);
                      
                      const largeArc = angle > 180 ? 1 : 0;
                      
                      return (
                        <path
                          key={idx}
                          d={`M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`}
                          fill={colors[idx % colors.length]}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        />
                      );
                    });
                  })()}
                  <circle cx="50" cy="50" r="25" fill="white" />
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {salaryRangeStaticData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded" style={{ backgroundColor: colors[idx % colors.length] }} />
                    <span className="text-gray-600">{item.range}</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-medium text-gray-700">{item.count.toLocaleString()}</span>
                    <span className="text-gray-400">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Salary Range by Experience Table (Right Side) */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Salary Range by Experience</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-gray-400 text-xs uppercase border-b border-gray-100 bg-gray-50">
                  <th className="p-4">Experience</th>
                  <th className="p-4 text-center">Avg. Min Salary</th>
                  <th className="p-4 text-center">Avg. Max Salary</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">0 - 2 Years</td>
                  <td className="p-4 text-center text-green-600 font-medium">$45,200</td>
                  <td className="p-4 text-center text-blue-600 font-medium">$72,300</td>
                </tr>
                <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">2 - 4 Years</td>
                  <td className="p-4 text-center text-green-600 font-medium">$60,300</td>
                  <td className="p-4 text-center text-blue-600 font-medium">$99,400</td>
                </tr>
                <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">4 - 6 Years</td>
                  <td className="p-4 text-center text-green-600 font-medium">$80,100</td>
                  <td className="p-4 text-center text-blue-600 font-medium">$132,600</td>
                </tr>
                <tr className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-medium text-gray-900">6+ Years</td>
                  <td className="p-4 text-center text-green-600 font-medium">$110,500</td>
                  <td className="p-4 text-center text-blue-600 font-medium">$165,700</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500 bg-gray-50">
            <p>Showing 1 to 4 of 4 experience levels</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-white transition-colors disabled:opacity-50" disabled>Previous</button>
              <button className="px-3 py-1 bg-blue-600 text-white rounded-md">1</button>
              <button className="px-3 py-1 border border-gray-200 rounded-md hover:bg-white transition-colors">Next</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}