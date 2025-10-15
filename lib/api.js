import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  // Bookings
  getBookings: async () => {
    const { data } = await axios.get(`${API_URL}/api/bookings`);
    return data.bookings;
  },

  getBooking: async (id) => {
    const { data } = await axios.get(`${API_URL}/api/booking/${id}`);
    return data.booking;
  },

  cancelBooking: async (id) => {
    const { data } = await axios.post(`${API_URL}/api/cancel-booking/${id}`);
    return data;
  },

  // Time Slots
  getAvailableSlots: async (date, duration) => {
    const { data } = await axios.get(`${API_URL}/api/available-slots`, {
      params: { date, duration, attorney: 'DR. NIK SARAFI' }
    });
    return data.slots;
  },

  getSlotsRange: async (startDate, endDate) => {
    const { data } = await axios.get(`${API_URL}/api/slots-range`, {
      params: { 
        start_date: startDate, 
        end_date: endDate,
        attorney: 'DR. NIK SARAFI'
      }
    });
    return data.slots;
  },

  blockSlots: async (slotIds, reason) => {
    const { data } = await axios.post(`${API_URL}/api/block-slots`, {
      slot_ids: slotIds,
      reason
    });
    return data;
  },

  unblockSlots: async (slotIds) => {
    const { data } = await axios.post(`${API_URL}/api/unblock-slots`, {
      slot_ids: slotIds
    });
    return data;
  }
};