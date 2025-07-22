import React from 'react';
import Modal from './Modal';

export default function ContactModal({ isOpen, onClose, phone, email, address }) {
  if (!isOpen) return null;

  const whatsappLink = `https://wa.me/${phone?.replace(/^0/, '234')}` // Convert to intl format if needed

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-[90%] max-w-sm p-6">
        <h2 className="text-lg font-semibold mb-4 text-charcoal">Contact Artisan</h2>

        <div className="space-y-3 text-sm">
          <div>
            <span className="font-medium">Phone:</span>{' '}
            <a href={`tel:${phone}`} className="text-blue-600 hover:underline">
              {phone}
            </a>
          </div>

          {address && (
            <div>
              <span className="font-medium">Address:</span>{' '}
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
                >
                {address}
                </a>
            </div>
          )}

          {email && (
            <div>
              <span className="font-medium">Email:</span>{' '}
              <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
                {email}
              </a>
            </div>
          )}

          <div>
            <span className="font-medium">WhatsApp:</span>{' '}
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
     </Modal>
  );
}
