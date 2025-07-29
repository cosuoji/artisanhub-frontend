import { useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import axiosInstance from '../../api/axios';

export default function AvailabilityEditor() {
  const [slots, setSlots] = useState([]);
  const { user } = useAuthStore();

  const addSlot = () => {
    const now = new Date();
    setSlots([...slots, { start: now.toISOString(), end: new Date(now.getTime() + 60 * 60 * 1000).toISOString() }]);
  };

  const save = async () => {
    await axiosInstance.patch('/artisans/me/availability', { slots });
    toast.success('Availability saved!');
  };

  return (
    <div className="space-y-4">
      {slots.map((slot, i) => (
        <div key={i} className="flex gap-2">
          <input type="datetime-local" value={slot.start.slice(0, 16)} onChange={e => setSlots(s => s.map((x, j) => j === i ? { ...x, start: e.target.value } : x))} />
          <input type="datetime-local" value={slot.end.slice(0, 16)} onChange={e => setSlots(s => s.map((x, j) => j === i ? { ...x, end: e.target.value } : x))} />
        </div>
      ))}
      <button onClick={addSlot} className="bg-emerald-600 text-white px-3 py-1 rounded">Add Slot</button>
      <button onClick={save} className="bg-blue-600 text-white px-3 py-1 rounded">Save</button>
    </div>
  );
}