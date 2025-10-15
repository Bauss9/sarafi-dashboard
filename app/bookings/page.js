'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const data = await api.getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error loading bookings:', error);
      alert('Fehler beim Laden der Buchungen');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Sind Sie sicher, dass Sie diese Buchung stornieren möchten?')) {
      return;
    }

    try {
      await api.cancelBooking(id);
      alert('Buchung erfolgreich storniert');
      loadBookings();
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert(error.response?.data?.message || 'Fehler beim Stornieren');
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true;
    return b.payment_status === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      refunded: 'bg-red-100 text-red-800',
    };
    const labels = {
      completed: 'Abgeschlossen',
      pending: 'Ausstehend',
      refunded: 'Storniert',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (loading) {
    return <div className="text-center py-20">Lade Buchungen...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Buchungen</h1>
        
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded ${filter === 'all' ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            Alle ({bookings.length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            Abgeschlossen
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            Ausstehend
          </button>
          <button
            onClick={() => setFilter('refunded')}
            className={`px-4 py-2 rounded ${filter === 'refunded' ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            Storniert
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kunde</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Datum & Zeit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dauer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">#{booking.id}</td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {booking.vorname} {booking.name}
                  </div>
                  <div className="text-sm text-gray-500">{booking.email}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{booking.booking_date}</div>
                  <div className="text-sm text-gray-500">{booking.booking_time}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{booking.duration} min</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">€ {booking.price}</td>
                <td className="px-6 py-4">{getStatusBadge(booking.payment_status)}</td>
                <td className="px-6 py-4">
                  {booking.payment_status === 'completed' && (
                    <button
                      onClick={() => handleCancel(booking.id)}
                      className="text-red-600 hover:text-red-800 font-medium text-sm"
                    >
                      Stornieren
                    </button>
                  )}
                  {booking.payment_status === 'refunded' && (
                    <span className="text-gray-400 text-sm">Storniert</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Keine Buchungen gefunden
          </div>
        )}
      </div>
    </div>
  );
}