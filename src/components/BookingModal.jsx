import { useState } from 'react';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axios';

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
    <div className="fixed inset-0 bg-black/40 z-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-[90%] max-w-md relative z-50">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✖
        </button>

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
      </div>
    </div>
  );
}
