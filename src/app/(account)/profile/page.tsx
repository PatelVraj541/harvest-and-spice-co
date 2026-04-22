import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your profile and addresses.",
};

export default function ProfilePage() {
  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-bark mb-6">Profile Settings</h1>
      <div className="bg-white rounded-2xl p-6 border border-cream-dark space-y-6">
        <form className="space-y-5 max-w-lg">
          <div>
            <label htmlFor="profile-name" className="block text-sm font-medium text-bark mb-1.5">
              Full Name
            </label>
            <input
              id="profile-name"
              type="text"
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-colors bg-cream/50"
            />
          </div>
          <div>
            <label htmlFor="profile-phone" className="block text-sm font-medium text-bark mb-1.5">
              Phone Number
            </label>
            <input
              id="profile-phone"
              type="tel"
              placeholder="+91 98765 43210"
              className="w-full px-4 py-3 rounded-xl border border-cream-dark focus:border-forest focus:ring-1 focus:ring-forest outline-none transition-colors bg-cream/50"
            />
          </div>
          <button
            type="submit"
            className="bg-forest hover:bg-forest-dark text-cream font-semibold px-6 py-3 rounded-xl transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
