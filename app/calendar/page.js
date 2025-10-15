'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { de } from 'date-fns/locale';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [duration, setDuration] = useState(30);
  const [slots, setSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      loadSlots();
    }
  }, [selectedDate, duration]);

  const loadSlots = async () => {
    setLoading(true);
    try {
      const dateStr = format(selectedDate, 'dd.MM.yyyy');
      const data = await api.getAvailableSlots(dateStr, duration);
      setSlots(data);
      setSelectedSlots([]);
    } catch (error) {
      console.error('Error loading slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockSlots = async () => {
    if (selectedSlots.length === 0) {
      alert('Bitte wählen Sie mindestens einen Zeitslot aus');
      return;
    }

    const reason = prompt('Grund für die Blockierung:', 'Nicht verfügbar');
    if (!reason) return;

    try {
      await api.blockSlots(selectedSlots, reason);
      alert(`${selectedSlots.length} Zeitslots erfolgreich blockiert`);
      loadSlots();
    } catch (error) {
      console.error('Error blocking slots:', error);
      alert('Fehler beim Blockieren der Slots');
    }
  };

  const handleUnblockSlots = async () => {
    if (selectedSlots.length === 0) {
      alert('Bitte wählen Sie mindestens einen Zeitslot aus');
      return;
    }

    try {
      await api.unblockSlots(selectedSlots);
      alert(`${selectedSlots.length} Zeitslots erfolgreich freigegeben`);
      loadSlots();
    } catch (error) {
      console.error('Error unblocking slots:', error);
      alert('Fehler beim Freigeben der Slots');
    }
  };

  const toggleSlot = (slotId) => {
    setSelectedSlots(prev =>
      prev.includes(slotId)
        ? prev.filter(id => id !== slotId)
        : [...prev, slotId]
    );
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Kalender & Verfügbarkeit</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Calendar */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setCurrentDate(subMonths(currentDate, 1))}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              ←
            </button>
            <h2 className="text-xl font-bold">
              {format(currentDate, 'MMMM yyyy', { locale: de })}
            </h2>
            <button
              onClick={() => setCurrentDate(addMonths(currentDate, 1))}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center font-semibold text-sm text-gray-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells for days before month starts */}
            {Array.from({ length: (monthStart.getDay() + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {daysInMonth.map(day => {
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              const isWeekend = day.getDay() === 0 || day.getDay() === 6;

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  disabled={isWeekend}
                  className={`
                    aspect-square p-2 rounded text-sm font-medium transition
                    ${isSelected ? 'bg-black text-white' : 'bg-gray-50 hover:bg-gray-100'}
                    ${isWeekend ? 'opacity-30 cursor-not-allowed line-through' : ''}
                  `}
                >
                  {format(day, 'd')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Slots */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Zeitslots verwalten</h2>

          {!selectedDate ? (
            <p className="text-gray-500 text-center py-12">
              Wählen Sie ein Datum aus dem Kalender
            </p>
          ) : (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Dauer</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDuration(30)}
                    className={`px-4 py-2 rounded ${duration === 30 ? 'bg-black text-white' : 'bg-gray-200'}`}
                  >
                    30 Min
                  </button>
                  <button
                    onClick={() => setDuration(45)}
                    className={`px-4 py-2 rounded ${duration === 45 ? 'bg-black text-white' : 'bg-gray-200'}`}
                  >
                    45 Min
                  </button>
                </div>
              </div>

              {loading ? (
                <p className="text-center py-8">Lade Zeitslots...</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-2 mb-4 max-h-96 overflow-y-auto">
                    {slots.map(slot => (
                      <button
                        key={slot.id}
                        onClick={() => toggleSlot(slot.id)}
                        className={`
                          p-3 rounded border-2 text-sm font-medium transition
                          ${selectedSlots.includes(slot.id) ? 'border-black bg-gray-100' : 'border-gray-200'}
                          ${!slot.is_available ? 'bg-red-50 border-red-300 text-red-700' : 'hover:border-gray-400'}
                        `}
                      >
                        {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                        {!slot.is_available && (
                          <div className="text-xs mt-1">
                            {slot.blocked_reason === 'booked' ? '(Gebucht)' : '(Blockiert)'}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleBlockSlots}
                      disabled={selectedSlots.length === 0}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Blockieren ({selectedSlots.length})
                    </button>
                    <button
                      onClick={handleUnblockSlots}
                      disabled={selectedSlots.length === 0}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Freigeben ({selectedSlots.length})
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}