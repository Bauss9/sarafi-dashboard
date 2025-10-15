'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    refunded: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const bookings = await api.getBookings();
      setStats({
        total: bookings.length,
        completed: bookings.filter(b => b.payment_status === 'completed').length,
        pending: bookings.filter(b => b.payment_status === 'pending').length,
        refunded: bookings.filter(b => b.payment_status === 'refunded').length,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Gesamt Buchungen" 
          value={stats.total} 
          icon="📊"
          color="text-blue-600"
        />
        <StatCard 
          title="Abgeschlossen" 
          value={stats.completed} 
          icon="✅"
          color="text-green-600"
        />
        <StatCard 
          title="Ausstehend" 
          value={stats.pending} 
          icon="⏳"
          color="text-yellow-600"
        />
        <StatCard 
          title="Storniert" 
          value={stats.refunded} 
          icon="❌"
          color="text-red-600"
        />
      </div>
    </div>
  );
}