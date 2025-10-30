// src/components/dashboard/panels/ProfileTab.jsx
import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';
import { MdLocationOn } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { capitalizeWords } from '../../utils/capitalize';

export default function ProfileTab({ user, fetchUserData }) {
  const profile = user.artisanProfile;
  const [editMode, setEditMode] = useState(false);
  const [locations, setLocations] = useState([]);
  const [currentLocation, setCurrentLocation] = useState("")
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    skills: [],
    yearsOfExperience: '',
    address: "",
    location: '',
    available: false,
  });
  const [newSkill, setNewSkill] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    const profile = user.artisanProfile || {};
    setFormData({
      name: user.name || '',
      phone: user.phone || '',
      bio: profile.bio || '',
      skills: profile.skills || [],
      yearsOfExperience: profile.yearsOfExperience || '',
      address: profile.address || "",
      location: profile.location?.name || '',
      available: profile.available || false,
    });
  }, [user]);

  useEffect(() => {
    axiosInstance.get('/locations')
      .then(res => setLocations(res.data))
      .catch(() => console.error('Failed to load locations'));
    axiosInstance.get(`/locations/${user?.artisanProfile?.location}`)
      .then(res => setCurrentLocation(res.data.name))
      .catch(() => console.error('Failed to load locations'));

  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddSkill = () => {
    if (newSkill && formData.skills.length < 5) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim().toLowerCase()],
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const toggleAvailability = async () => {
    setToggling(true);
    try {
      await axiosInstance.patch('/artisans/me/toggle-availability');
      toast.success('Availability toggled');
      fetchUserData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error toggling availability');
    } finally {
      setToggling(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.put('/artisans/me/profile', formData);
      toast.success('Profile updated');
      fetchUserData();
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <section className="bg-white p-6 rounded shadow flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt="Avatar"
            className="w-16 h-16 rounded-full object-cover border"
          />
          <div>
            <h2 className="text-xl font-semibold text-charcoal">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            <p className="text-gray-600">{user.phone}</p>
            <p className={`text-sm font-medium ${user.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
            {user.isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
            </p>

          </div>
        </div>
      {profile &&   <div className="text-right">
          <p className="text-sm">
            Status:{" "}
            <span
              className={`font-medium ${
                profile?.available ? "text-green-600" : "text-red-600"
              }`}
            >
              {profile?.available ? "Available for work" : "Not available"}
            </span>
          </p>
          <button
            onClick={toggleAvailability}
            disabled={toggling}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            {toggling ? "Toggling..." : "Toggle Availability"}
          </button>
        </div>}
      </section>

      {/* Edit Form */}
      <section className="bg-white p-6 rounded shadow">
        <div className="flex justify-between items-start">
  <h3 className="text-lg font-semibold text-charcoal">Artisan Profile</h3>

  {!user.isEmailVerified ? (
    <button
      disabled
      className="text-sm text-gray-400 cursor-not-allowed flex items-center gap-1"
      title="Verify your email to edit your profile"
    >
      <span>🔒 Verify Email to Edit</span>
    </button>
  ) : (
    <button
      className="text-sm text-blue-600 hover:underline"
      onClick={() => setEditMode(!editMode)}
    >
      {editMode ? "Cancel" : "Edit Profile"}
    </button>
  )}
</div>


        {!editMode ? (
          <div className="mt-4 space-y-1">
            <p><strong>Bio:</strong> {profile?.bio || "—"}</p>
            <p><strong>Years of Experience:</strong> {profile?.yearsOfExperience || "—"}</p>
            <p><strong>Skills:</strong> {profile?.skills?.join(", ") || "—"}</p>
            <p><strong>Address:</strong> {profile?.address || "—"}</p>

            <p className="flex items-center gap-1">
              <MdLocationOn className="text-gray-500" />
              {capitalizeWords(currentLocation) || "No location"}
            </p>
            <p>
              Profile Status:{" "}
              <span className={`font-medium ${profile?.isApproved ? "text-green-600" : "text-yellow-600"}`}>
                {profile?.isApproved ? "Approved" : "Pending Approval"}
              </span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <input name="name" value={formData.name} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Name" />
            <input name="phone" value={formData.phone} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Phone" />
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows="3" className="w-full border p-2 rounded" placeholder="Bio" />
            <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Years of Experience" />
            <input name="address" value={formData.address} onChange={handleChange} className="w-full border p-2 rounded" placeholder="Address" />

            <div>
              <label className="block text-sm font-medium">Skills</label>
              <div className="flex items-center gap-2 mb-2">
                <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} className="border p-2 flex-1 rounded" />
                <button type="button" onClick={handleAddSkill} className="bg-gray-200 px-2 py-1 rounded text-sm">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.skills.map(skill => (
                  <span key={skill} className="bg-gray-200 px-2 py-1 rounded text-sm">
                    {skill}
                    <button type="button" className="ml-2 text-red-600" onClick={() => handleRemoveSkill(skill)}>×</button>
                  </span>
                ))}
              </div>
            </div>

            <select name="location" value={formData.location} onChange={handleChange} className="w-full border p-2 rounded">
              <option value="">Select location(Please Pick One Close to your address)</option>
              {locations.map(loc => (
                <option key={loc._id || loc} value={loc.name || loc}>{loc.name || loc}</option>
              ))}
            </select>

            <div className="flex items-center gap-2">
              <input type="checkbox" name="available" checked={formData.available} onChange={handleChange} id="available" />
              <label htmlFor="available">Available for work</label>
            </div>

            <button type="submit" disabled={submitting} className="bg-emerald-600 text-white px-4 py-2 rounded">
              {submitting ? "Saving..." : "Update Profile"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
