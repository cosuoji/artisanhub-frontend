import { useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axios';
import Modal from "./Modal"

export default function BookingModal({ artisanId, isOpen, onClose }) {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!description.trim()) return toast.error('Please enter a job description');

    setLoading(true);
    try {
      await axiosInstance.post('/jobs', {
        artisanId,
        description,
        date: date || undefined,
      });

      toast.success('Booking sent!');
      setDescription('');
      setDate('');
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
   <Modal isOpen={isOpen} onClose={onClose} className="w-[90%] max-w-md p-6">
        <h2 className="text-lg font-semibold text-charcoal mb-4">Book This Artisan</h2>

        <div className="space-y-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
            rows={4}
            placeholder="Describe the job you want done..."
          />

          <input
            type="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            {loading ? 'Sending...' : 'Book Now'}
          </button>
        </div>
      </Modal>
  );
}
