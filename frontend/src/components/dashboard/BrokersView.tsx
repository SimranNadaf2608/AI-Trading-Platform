import React, { useState, useEffect } from 'react';
import { Link2, Trash2, CheckCircle, Loader2 } from 'lucide-react';

const BrokersView: React.FC = () => {
  const [brokers, setBrokers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBrokers = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard/brokers', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      if (response.ok) {
        const data = await response.json();
        setBrokers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrokers();
  }, []);

  const connectBroker = async (broker_name: string) => {
    try {
      await fetch('http://localhost:8000/api/dashboard/brokers/connect', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` 
        },
        body: JSON.stringify({ broker_name, api_key: 'mock_key_123' })
      });
      fetchBrokers();
    } catch (e) {}
  };

  const disconnectBroker = async (id: number) => {
    try {
      await fetch(`http://localhost:8000/api/dashboard/brokers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      fetchBrokers();
    } catch (e) {}
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <div className="section-container">
        <h3 className="section-title">Connected Brokers</h3>
        {loading ? <div style={{ padding: '20px' }}><Loader2 className="spinner" /></div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginTop: '15px' }}>
            {brokers.length === 0 ? <p style={{ color: '#64748B' }}>No brokers connected.</p> : brokers.map((b, i) => (
              <div key={i} className="strategy-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
                      {b.broker_name.charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: '#1E293B', fontSize: '16px' }}>{b.broker_name}</h4>
                      <p style={{ margin: 0, color: '#10B981', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={12}/> Connected</p>
                    </div>
                  </div>
                  <button onClick={() => disconnectBroker(b.id)} style={{ background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer' }}><Trash2 size={18}/></button>
                </div>
                <div style={{ background: '#F8FAFC', padding: '15px', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#64748B', fontSize: '13px' }}>Asset Balance</span>
                    <span style={{ color: '#0F172A', fontWeight: 'bold' }}>${b.balance.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="section-container" style={{ marginTop: '30px' }}>
        <h3 className="section-title">Available Integrations</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '15px' }}>
          {['Binance', 'Kraken', 'Coinbase Pro'].map(name => (
            <div key={name} className="strategy-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>{name.charAt(0)}</div>
                  <span style={{ fontWeight: '500', color: '#1E293B' }}>{name}</span>
               </div>
               <button onClick={() => connectBroker(name)} style={{ background: '#EEF2FF', color: '#3B82F6', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '6px' }}>
                 <Link2 size={16}/> Connect
               </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrokersView;
