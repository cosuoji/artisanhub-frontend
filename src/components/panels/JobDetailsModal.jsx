// src/components/dashboard/panels/JobDetailsModal.jsx

import Modal from "../Modal";


export default function JobDetailsModal({ job, onClose }) {
 console.log(job)
    return (
    <Modal isOpen={!!job} onClose={onClose} className="max-w-lg w-full p-6">
  
          <h2 className="text-lg font-semibold mb-4 text-charcoal">Job Details</h2>
  
          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>User:</strong> {job.user.name || 'Unknown'}</p>
            <p><strong>Description:</strong> {job.description}</p>
            <p><strong>Status:</strong> {job.status}</p>
            <p><strong>Created:</strong> {new Date(job.createdAt).toLocaleString()}</p>
          </div>
    </Modal>
    );
  }
  