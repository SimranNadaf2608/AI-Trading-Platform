import React, { useState, useEffect } from 'react';
import { Download, FileText, Filter, Loader2 } from 'lucide-react';

const ReportsView: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/dashboard/reports/transactions', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (response.ok) {
          const data = await response.json();
          setLogs(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div style={{ marginTop: '20px' }}>
      <div className="section-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
          <h3 className="section-title" style={{ margin: 0 }}>Transaction Reports</h3>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{ padding: '8px 16px', background: '#FFF', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#475569', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
               <Filter size={16} /> Filter
            </button>
            <button style={{ padding: '8px 16px', background: '#3B82F6', border: 'none', borderRadius: '8px', color: '#FFF', fontSize: '14px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(59, 130, 246, 0.2)' }}>
               <Download size={16} /> Export CSV
            </button>
          </div>
        </div>

        {loading ? <div style={{ padding: '20px' }}><Loader2 className="spinner" /></div> : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '15px 10px', color: '#64748B', fontWeight: '500', fontSize: '13px' }}>Transaction ID</th>
                  <th style={{ padding: '15px 10px', color: '#64748B', fontWeight: '500', fontSize: '13px' }}>Date</th>
                  <th style={{ padding: '15px 10px', color: '#64748B', fontWeight: '500', fontSize: '13px' }}>Asset Pair</th>
                  <th style={{ padding: '15px 10px', color: '#64748B', fontWeight: '500', fontSize: '13px' }}>Type</th>
                  <th style={{ padding: '15px 10px', color: '#64748B', fontWeight: '500', fontSize: '13px' }}>Amount</th>
                  <th style={{ padding: '15px 10px', color: '#64748B', fontWeight: '500', fontSize: '13px' }}>Status</th>
                  <th style={{ padding: '15px 10px', color: '#64748B', fontWeight: '500', fontSize: '13px', textAlign: 'right' }}>Realized PnL</th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: '#64748B' }}>No historical transactions. Deploy a bot to generate transactions.</td></tr>
                ) : logs.map((log, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.background = '#F8FAFC'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '15px 10px', color: '#0F172A', fontSize: '14px', fontWeight: '500' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FileText size={16} color="#94A3B8" /> {log.tx_id}
                      </div>
                    </td>
                    <td style={{ padding: '15px 10px', color: '#475569', fontSize: '14px' }}>{log.date}</td>
                    <td style={{ padding: '15px 10px', color: '#0F172A', fontSize: '14px', fontWeight: '500' }}>{log.asset_pair}</td>
                    <td style={{ padding: '15px 10px', fontSize: '14px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', background: log.type === 'Buy' ? '#EFF6FF' : log.type === 'Sell' ? '#FEF2F2' : '#F1F5F9', color: log.type === 'Buy' ? '#3B82F6' : log.type === 'Sell' ? '#EF4444' : '#64748B', fontSize: '12px', fontWeight: '600' }}>
                        {log.type}
                      </span>
                    </td>
                    <td style={{ padding: '15px 10px', color: '#0F172A', fontSize: '14px', fontWeight: '500' }}>{log.amount}</td>
                    <td style={{ padding: '15px 10px', fontSize: '14px' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: log.status === 'Completed' ? '#10B981' : '#64748B' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: log.status === 'Completed' ? '#10B981' : '#CBD5E1' }}></div>
                        {log.status}
                      </div>
                    </td>
                    <td style={{ padding: '15px 10px', fontSize: '14px', fontWeight: '600', textAlign: 'right', color: log.profit.startsWith('+') ? '#10B981' : log.profit.startsWith('-') && log.profit !== '-' ? '#EF4444' : '#94A3B8' }}>
                      {log.profit}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsView;
