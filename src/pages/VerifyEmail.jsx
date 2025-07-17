import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'react-hot-toast';

export default function VerifyEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('Verifying email...');

  const { verifyEmail } = useAuthStore();

  useEffect(() => {
    const verify = async () => {
      const result = await verifyEmail(token);

      if (result.success || result.alreadyVerified) {
        toast.success(result.message);
        setStatus('✅ ' + result.message);
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(result.message);
        setStatus('⚠️ Verification failed or token is invalid.');
      }
      
    };

    if (token) verify();
  }, [token, verifyEmail, navigate]);

  return (
    <div className="max-w-md mx-auto mt-16 text-center">
      <p className="text-lg text-charcoal font-medium">{status}</p>
    </div>
  );
}
