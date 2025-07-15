import UpdateProfileForm from "../updateProfileForm"
import ChangePasswordForm from "../ChangePasswordForm"

const ArtisanUpdateProfileTab = () => {
  return (
    <>
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
    </>
  )
}

export default ArtisanUpdateProfileTab