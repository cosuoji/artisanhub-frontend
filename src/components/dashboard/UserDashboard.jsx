import { useAuthStore } from '../../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import MyBookings from '../MyBookings';
import MyReviews from "../MyReviews";
import UpdateProfileForm from '../updateProfileForm';
import ChangePasswordForm from '../ChangePasswordForm';




export default function UserDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-8">
      {/* Profile Summary */}
      <section className="bg-white p-6 rounded-md shadow">
        <h2 className="text-xl font-semibold text-charcoal">Welcome, {user?.name || 'User'}</h2>
        <p className="text-gray-600">Email: {user.email}</p>
        <p className="text-gray-600">Phone: {user.phone || ""}</p>
        <p className="text-gray-600">Address: {user.address || ""}</p>
        <p className={`text-sm font-medium ${user.isEmailVerified ? 'text-green-600' : 'text-red-600'}`}>
          {user.isEmailVerified ? 'Email Verified' : 'Email Not Verified'}
        </p>
          <Link to="/resend-verification">
          {!user.isEmailVerified && <span>Resend Verification </span> }
          </Link>
      </section>

      {/* Jobs Section */}
     <MyBookings />

      {/* Reviews Section */}
      <MyReviews />

      {/* Update Profile Section */}
      <section className="bg-white p-6 rounded-md shadow">
      <h2 className="text-lg font-semibold text-charcoal mb-4">Update Profile</h2>
      <UpdateProfileForm />
      </section>

      {/* Security Section */}
      <section className="bg-white p-6 rounded-md shadow">
        <h2 className="text-lg font-semibold text-charcoal mb-4">Account Security</h2>
        <ChangePasswordForm />
      </section>
    </div>
  );
}

