import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  BriefcaseBusiness,
  CalendarDays,
  Download,
  FileSpreadsheet,
  FileText,
  Users,
} from 'lucide-react';
import { supabase } from '../supabaseClient'; // Adjust path as needed
import type { User } from '@supabase/supabase-js';

// Types
type ReportFormat = 'PDF' | 'Excel';
type ReportType = 'candidate_summary' | 'salary_insights';

interface ReportDefinition {
  name: string;
  description: string;
  type: ReportType;
}

interface GeneratedReport {
  id?: string;
  name: string;
  type: string;
  generated_on: string;
  generated_by: string;
  file_url?: string;
}

interface SummaryMetric {
  label: string;
  value: number | string;
  tone: 'blue' | 'green' | 'orange' | 'purple';
}

const reportDefinitions: ReportDefinition[] = [
  {
    name: 'Candidate Summary',
    description: 'Complete overview of all candidates and their status',
    type: 'candidate_summary',
  },
  {
    name: 'Salary Insights',
    description: 'Salary distribution and market analysis',
    type: 'salary_insights',
  },
];

const summaryIcons: Record<string, ReactNode> = {
  blue: <Users size={26} />,
  green: <Users size={26} />,
  orange: <BriefcaseBusiness size={26} />,
  purple: <CalendarDays size={26} />,
};

function Reports() {
  const [reportType, setReportType] = useState<string>('Select Report');
  const [field, setField] = useState<string>('All Fields');
  const [status, setStatus] = useState<string>('All Status');
  const [availability, setAvailability] = useState<string>('All Availability');
  const [fromDate, setFromDate] = useState<string>('2026-05-20');
  const [toDate, setToDate] = useState<string>('2026-06-20');
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [summaryMetrics, setSummaryMetrics] = useState<SummaryMetric[]>([
    { label: 'Total Candidates', value: 0, tone: 'blue' },
    { label: 'Actively Looking', value: 0, tone: 'green' },
    { label: 'Avg. Min Salary', value: '$0', tone: 'orange' },
    { label: 'Avg. Max Salary', value: '$0', tone: 'purple' },
  ]);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Get current user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setCurrentUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch summary metrics from Supabase
  const fetchSummaryMetrics = async () => {
    try {
      // Fetch total candidates
      const { count: totalCandidates, error: totalError } = await supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true });

      if (totalError) throw totalError;

      // Fetch actively looking candidates
      const { count: activelyLooking, error: lookingError } = await supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true })
        .eq('availability', 'immediate');

      if (lookingError) throw lookingError;

      // Fetch average salaries
      const { data: salaryData, error: salaryError } = await supabase
        .from('candidates')
        .select('min_salary, max_salary');

      if (salaryError) throw salaryError;

      const avgMinSalary = salaryData?.reduce((acc, curr) => acc + (curr.min_salary || 0), 0) / (salaryData?.length || 1);
      const avgMaxSalary = salaryData?.reduce((acc, curr) => acc + (curr.max_salary || 0), 0) / (salaryData?.length || 1);

      setSummaryMetrics([
        { label: 'Total Candidates', value: totalCandidates || 0, tone: 'blue' },
        { label: 'Actively Looking', value: activelyLooking || 0, tone: 'green' },
        { label: 'Avg. Min Salary', value: `$${Math.round(avgMinSalary).toLocaleString()}`, tone: 'orange' },
        { label: 'Avg. Max Salary', value: `$${Math.round(avgMaxSalary).toLocaleString()}`, tone: 'purple' },
      ]);
    } catch (error) {
      console.error('Error fetching summary metrics:', error);
    }
  };

  // Fetch generated reports from Supabase
  const fetchGeneratedReports = async () => {
    try {
      const { data, error } = await supabase
        .from('generated_reports')
        .select('*')
        .order('generated_on', { ascending: false })
        .limit(10);

      if (error) throw error;

      setGeneratedReports(data || []);
    } catch (error) {
      console.error('Error fetching generated reports:', error);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchSummaryMetrics();
    fetchGeneratedReports();
  }, []);

  // Date validation
  useEffect(() => {
    if (fromDate && toDate && toDate < fromDate) {
      const timeoutId = window.setTimeout(() => setToDate(fromDate), 0);
      return () => window.clearTimeout(timeoutId);
    }
  }, [fromDate, toDate]);

  const dateRangeLabel = useMemo(() => {
    const from = fromDate ? formatDateLabel(fromDate) : 'From Date';
    const to = toDate ? formatDateLabel(toDate) : 'To Date';
    return `${from} - ${to}`;
  }, [fromDate, toDate]);

  // Handle report download
  const handleDownload = async (reportName: string, format: ReportFormat, reportId?: string) => {
    if (reportId) {
      // Download from Supabase storage
      try {
        const { data, error } = await supabase.storage
          .from('reports')
          .download(`${reportId}/${reportName.toLowerCase().replace(/\s+/g, '-')}.${format.toLowerCase()}`);

        if (error) throw error;

        const url = URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${reportName.toLowerCase().replace(/\s+/g, '-')}.${format.toLowerCase()}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Error downloading report:', error);
        downloadMockReport(reportName, format);
      }
    } else {
      downloadMockReport(reportName, format);
    }
  };

  // Generate report and save to Supabase
  const handleGenerateReport = async () => {
    if (!currentUser) {
      alert('Please log in to generate reports');
      return;
    }

    const selectedReportName = reportType === 'Select Report' ? reportDefinitions[0].name : reportType;
    const selectedReport = reportDefinitions.find(r => r.name === selectedReportName);
    
    if (!selectedReport) {
      alert('Please select a valid report');
      return;
    }

    setLoading(true);

    try {
      // Generate report data based on type and filters
      const reportData = await generateReportData(selectedReport.type, {
        field,
        status,
        availability,
        fromDate,
        toDate,
      });

      // Save report metadata to Supabase
      const { data: reportRecord, error: insertError } = await supabase
        .from('generated_reports')
        .insert({
          name: selectedReportName,
          type: 'PDF',
          generated_on: new Date().toISOString(),
          generated_by: currentUser.email || currentUser.id,
          filters: { field, status, availability, fromDate, toDate },
          data: reportData,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Generate and upload PDF/Excel to storage
      const blob = generateReportBlob(selectedReportName, 'PDF', reportData);
      const fileName = `${reportRecord.id}/${selectedReportName.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      
      const { error: uploadError } = await supabase.storage
        .from('reports')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Update report with file URL
      const { error: updateError } = await supabase
        .from('generated_reports')
        .update({ file_url: fileName })
        .eq('id', reportRecord.id);

      if (updateError) throw updateError;

      // Update local state
      setGeneratedReports(prev => [{
        id: reportRecord.id,
        name: selectedReportName,
        type: 'PDF',
        generated_on: new Date().toLocaleString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }),
        generated_by: currentUser.email || 'Admin',
      }, ...prev]);

      alert('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to generate report data
  const generateReportData = async (reportType: ReportType, filters: any) => {
    let query = supabase.from('candidates').select('*');

    // Apply filters
    if (filters.field !== 'All Fields') {
      query = query.eq('field', filters.field);
    }
    if (filters.status !== 'All Status') {
      query = query.eq('status', filters.status.toLowerCase());
    }
    if (filters.availability !== 'All Availability') {
      query = query.eq('availability', filters.availability.toLowerCase());
    }
    if (filters.fromDate) {
      query = query.gte('created_at', filters.fromDate);
    }
    if (filters.toDate) {
      query = query.lte('created_at', filters.toDate);
    }

    const { data, error } = await query;
    if (error) throw error;

    if (reportType === 'salary_insights') {
      // Calculate salary insights
      const salaries = data?.map(c => ({ min: c.min_salary, max: c.max_salary })) || [];
      const avgMin = salaries.reduce((acc, curr) => acc + (curr.min || 0), 0) / (salaries.length || 1);
      const avgMax = salaries.reduce((acc, curr) => acc + (curr.max || 0), 0) / (salaries.length || 1);
      
      return {
        type: 'salary_insights',
        filters,
        data: {
          candidates: data,
          averageMinSalary: avgMin,
          averageMaxSalary: avgMax,
          totalCandidates: data?.length || 0,
        },
      };
    }

    return {
      type: 'candidate_summary',
      filters,
      data: {
        candidates: data,
        totalCandidates: data?.length || 0,
      },
    };
  };

  return (
    <main className="assigned-page reports-page">
      <section className="assigned-heading">
        <h1>Reports</h1>
        <p>Generate and view reports</p>
      </section>

      <section className="assigned-filter-panel reports-filter-panel" aria-label="Report filters">
        <FilterSelect
          label="Report Type"
          value={reportType}
          options={['Select Report', 'Candidate Summary', 'Salary Insights']}
          onChange={setReportType}
        />
        <FilterSelect
          label="Field"
          value={field}
          options={['All Fields', 'Engineering', 'Design', 'Marketing', 'Sales', 'Product']}
          onChange={setField}
        />
        <FilterSelect
          label="Status"
          value={status}
          options={['All Status', 'Active', 'Shortlisted', 'Rejected', 'Hired']}
          onChange={setStatus}
        />
        <FilterSelect
          label="Availability"
          value={availability}
          options={['All Availability', 'Immediate', 'Two Weeks', 'One Month']}
          onChange={setAvailability}
        />
        <div className="assigned-date-filter" aria-label={dateRangeLabel}>
          <CalendarDays size={15} />
          <input
            aria-label="From Date"
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
          <span>to</span>
          <input
            aria-label="To Date"
            type="date"
            value={toDate}
            min={fromDate}
            onChange={(event) => setToDate(event.target.value)}
          />
        </div>
        <button 
          className="assigned-primary-action" 
          type="button" 
          onClick={handleGenerateReport}
          disabled={loading}
        >
          <FileText size={14} />
          {loading ? 'Generating...' : 'Generate Report'}
        </button>
      </section>

      <section className="reports-summary-grid">
        {summaryMetrics.map((metric) => (
          <article className={`reports-summary-card ${metric.tone}`} key={metric.label}>
            <div className="reports-summary-icon">{summaryIcons[metric.tone] ?? <Users size={26} />}</div>
            <div>
              <span>{metric.label}</span>
              <strong>{metric.value}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="assigned-card reports-list-card">
        <h2>Reports</h2>
        <div className="reports-list">
          {reportDefinitions.map((report) => (
            <article className="reports-row" key={report.name}>
              <div className="reports-title-group">
                <div className="reports-row-icon">
                  <FileText size={19} />
                </div>
                <div>
                  <h3>{report.name}</h3>
                  <p>{report.description}</p>
                </div>
              </div>
              <div className="reports-actions">
                <button type="button" onClick={() => handleDownload(report.name, 'PDF')}>
                  <FileText size={14} />
                  PDF
                </button>
                <button type="button" onClick={() => handleDownload(report.name, 'Excel')}>
                  <FileSpreadsheet size={14} />
                  Excel
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="assigned-card reports-recent-card">
        <h2>Recent Generated Reports</h2>
        <div className="assigned-table-wrap">
          <table className="assigned-table">
            <thead>
              <tr>
                <th>Report Name</th>
                <th>Type</th>
                <th>Generated On</th>
                <th>Generated By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {generatedReports.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>
                    No reports generated yet
                  </td>
                </tr>
              ) : (
                generatedReports.map((report) => (
                  <tr key={report.id || `${report.name}-${report.generated_on}`}>
                    <td>{report.name}</td>
                    <td>{report.type}</td>
                    <td>{report.generated_on}</td>
                    <td>{report.generated_by}</td>
                    <td>
                      <button
                        className="reports-download-icon"
                        type="button"
                        aria-label={`Download ${report.name}`}
                        onClick={() => handleDownload(report.name, report.type as ReportFormat, report.id)}
                      >
                        <Download size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange?: (value: string) => void;
}) {
  return (
    <label className="assigned-filter-control">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange?.(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}

function downloadMockReport(reportName: string, format: ReportFormat) {
  const rows = [
    ['Report Name', 'Type', 'Generated On', 'Generated By'],
    [reportName, format, new Date().toLocaleString(), 'Admin'],
    ['Total Candidates', '2458', 'Actively Looking', '1245'],
    ['Average Minimum Salary', '$72,500', 'Average Maximum Salary', '$125,300'],
  ];
  const csvContent = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  const isPdf = format === 'PDF';
  const blob = new Blob([isPdf ? `Mock PDF Report\n\n${csvContent}` : csvContent], {
    type: isPdf ? 'application/pdf' : 'application/vnd.ms-excel',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${reportName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${isPdf ? 'pdf' : 'xls'}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function formatDateLabel(value: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(new Date(`${value}T00:00:00`));
}

function generateReportBlob(reportName: string, format: string, data: any): Blob {
  const rows = [
    ['Report Name', reportName],
    ['Generated On', new Date().toLocaleString()],
    ['Report Type', format],
    ['Filters', JSON.stringify(data.filters, null, 2)],
    [''],
    ['Report Data', ''],
    ...Object.entries(data.data).map(([key, value]) => [key, JSON.stringify(value, null, 2)]),
  ];
  
  const csvContent = rows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  
  if (format === 'PDF') {
    return new Blob([`PDF Report\n${'='.repeat(50)}\n\n${csvContent}`], {
      type: 'application/pdf',
    });
  }
  
  return new Blob([csvContent], {
    type: 'application/vnd.ms-excel',
  });
}

export default Reports;