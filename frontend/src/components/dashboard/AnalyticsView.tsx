import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Target, TrendingUp, TrendingDown, Activity } from 'lucide-react';

const profitData = [
  { name: 'Mon', profit: 4000, loss: 2400 },
  { name: 'Tue', profit: 3000, loss: 1398 },
  { name: 'Wed', profit: 2000, loss: 9800 },
  { name: 'Thu', profit: 2780, loss: 3908 },
  { name: 'Fri', profit: 1890, loss: 4800 },
  { name: 'Sat', profit: 2390, loss: 3800 },
  { name: 'Sun', profit: 3490, loss: 4300 },
];

const performanceData = [
  { day: '1', score: 65 }, { day: '2', score: 59 }, { day: '3', score: 80 },
  { day: '4', score: 81 }, { day: '5', score: 56 }, { day: '6', score: 55 },
  { day: '7', score: 40 },
];

const AnalyticsView: React.FC = () => {
  return (
    <div style={{ marginTop: '20px' }}>
      
      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        <div className="strategy-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10B981' }}>
            <Target size={24} />
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#64748B', fontSize: '13px' }}>Win Rate</p>
            <h3 style={{ margin: 0, color: '#0F172A', fontSize: '22px' }}>74.2%</h3>
          </div>
        </div>

        <div className="strategy-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0EA5E9' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#64748B', fontSize: '13px' }}>Total Trades</p>
            <h3 style={{ margin: 0, color: '#0F172A', fontSize: '22px' }}>1,284</h3>
          </div>
        </div>

        <div className="strategy-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#F5F3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8B5CF6' }}>
            <Activity size={24} />
          </div>
          <div>
            <p style={{ margin: '0 0 4px 0', color: '#64748B', fontSize: '13px' }}>Alpha Generated</p>
            <h3 style={{ margin: 0, color: '#0F172A', fontSize: '22px' }}>+4.1%</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'reapeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
        <div className="section-container">
          <h3 className="section-title">Weekly Profit / Loss</h3>
          <div style={{ height: '300px', marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} dx={-10} />
                <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="profit" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="loss" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default AnalyticsView;
