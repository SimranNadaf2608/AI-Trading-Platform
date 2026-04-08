import React, { useState, useEffect } from 'react';
import { Play, Settings, AlertCircle, Loader2 } from 'lucide-react';

const StrategiesView: React.FC = () => {
  const [strategies, setStrategies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStrategies = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard/strategies', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStrategies(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStrategies();
  }, []);

  const toggleDeployment = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/api/dashboard/strategies/${id}/deploy`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      fetchStrategies();
    } catch (e) {}
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div className="section-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 className="section-title" style={{ margin: 0 }}>Strategy Library</h3>
          <span style={{ color: '#64748B', fontSize: '14px', background: '#F1F5F9', padding: '6px 12px', borderRadius: '20px' }}>{strategies.length} Algorithms</span>
        </div>

        {loading ? <div style={{ padding: '20px' }}><Loader2 className="spinner" /></div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {strategies.map((strat, idx) => (
              <div key={idx} className="strategy-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '18px', color: '#0F172A' }}>{strat.name}</h4>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', padding: '3px 8px', borderRadius: '4px', background: strat.risk_level === 'Low' ? '#DCFCE7' : strat.risk_level === 'High' ? '#FEE2E2' : '#FEF3C7', color: strat.risk_level === 'Low' ? '#166534' : strat.risk_level === 'High' ? '#991B1B' : '#92400E' }}>
                        {strat.risk_level} Risk
                      </span>
                      <span style={{ fontSize: '13px', color: '#10B981', fontWeight: 'bold' }}>{strat.expected_return}</span>
                    </div>
                  </div>
                  {strat.is_active ? (
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 0 4px #D1FAE5' }}></div>
                  ) : (
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#CBD5E1' }}></div>
                  )}
                </div>

                <p style={{ margin: 0, fontSize: '14px', color: '#64748B', lineHeight: '1.5' }}>
                  Automated algorithmic tracking deployed across volatile clusters ensuring precise entry and exits.
                </p>

                <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                  {strat.is_active ? (
                    <button onClick={() => toggleDeployment(strat.id)} style={{ flex: 1, padding: '10px', background: '#FEF2F2', color: '#EF4444', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
                      Stop Bot
                    </button>
                  ) : (
                    <button onClick={() => toggleDeployment(strat.id)} style={{ flex: 1, padding: '10px', background: '#3B82F6', color: '#FFF', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                      <Play size={16} /> Deploy
                    </button>
                  )}
                  <button style={{ width: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', color: '#475569', border: '1px solid #E2E8F0', borderRadius: '8px', cursor: 'pointer' }}>
                    <Settings size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="section-container" style={{ marginTop: '30px', background: '#F0F9FF', padding: '20px', borderRadius: '12px', display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
        <AlertCircle color="#0284C7" style={{ flexShrink: 0 }} />
        <div>
          <h4 style={{ color: '#0369A1', margin: '0 0 5px 0' }}>Pro Tip: Strategy Allocation</h4>
          <p style={{ color: '#0C4A6E', margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
            We recommend not exceeding 30% of your total margin on high-risk strategies. Ensure your connected brokers allow algorithmic trading API access.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StrategiesView;
