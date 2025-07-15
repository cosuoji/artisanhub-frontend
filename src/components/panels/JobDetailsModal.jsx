// src/components/dashboard/panels/JobDetailsModal.jsx
import { useEffect, useState } from "react";
import axiosInstance from "../../api/axios";



export default function JobDetailsModal({ job, onClose }) {

  const [user, setUser] = useState("")

  useEffect(() => {
    const getUserName = async () => {
      try {
        const res = await axiosInstance.get(`/users/${job.user}`)
        setUser(res.data.name)
      } catch (error) {
        console.log(error)
      }
    }
   getUserName()
  }, [])
  
 
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            ✕
          </button>
  
          <h2 className="text-lg font-semibold mb-4 text-charcoal">Job Details</h2>
  
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>User:</strong> {user || 'Unknown'}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Status:</strong> {job.status}</p>
            <p><strong>Created:</strong> {new Date(job.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>
    );
  }
  