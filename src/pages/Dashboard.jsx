
import AdminDashboard from '../components/dashboard/AdminDashboard';
import UserDashboard from '../components/dashboard/UserDashboard';
import ArtisanDashboard from '../components/dashboard/ArtisanDashboard';
import { useAuthStore } from '../store/useAuthStore';

export default function Dashboard() {
  const { user } = useAuthStore();

  if (!user) return <p className="p-6 text-charcoal">Loading...</p>;
 
  return (
    <div className="p-6">
      {user.role === 'user' && <UserDashboard />}
      {user.role === 'artisan' && <ArtisanDashboard />}
      {user.role === 'admin' && <AdminDashboard />}
    </div>
  );
}
