export default function AdminSeasonalRulesPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-bark">Seasonal Rules</h1>
        <button className="bg-forest hover:bg-forest-dark text-cream text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
          + Add Rule
        </button>
      </div>
      <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-cream-dark bg-cream/50">
              <th className="text-left px-4 py-3 font-medium text-bark-light">Product</th>
              <th className="text-left px-4 py-3 font-medium text-bark-light">Season</th>
              <th className="text-left px-4 py-3 font-medium text-bark-light">Months</th>
              <th className="text-left px-4 py-3 font-medium text-bark-light">Status</th>
              <th className="text-left px-4 py-3 font-medium text-bark-light">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-cream-dark">
              <td className="px-4 py-3 text-bark">Alphonso Mangoes</td>
              <td className="px-4 py-3 text-bark-light">Mango Season</td>
              <td className="px-4 py-3 text-bark-light">Apr – Jul</td>
              <td className="px-4 py-3">
                <span className="bg-forest/10 text-forest px-2 py-0.5 rounded-full text-xs font-medium">Active</span>
              </td>
              <td className="px-4 py-3">
                <button className="text-forest hover:underline text-xs mr-3">Edit</button>
                <button className="text-spice-red hover:underline text-xs">Delete</button>
              </td>
            </tr>
            <tr className="border-b border-cream-dark">
              <td className="px-4 py-3 text-bark">Nagpur Oranges</td>
              <td className="px-4 py-3 text-bark-light">Orange Season</td>
              <td className="px-4 py-3 text-bark-light">Nov – Feb</td>
              <td className="px-4 py-3">
                <span className="bg-forest/10 text-forest px-2 py-0.5 rounded-full text-xs font-medium">Active</span>
              </td>
              <td className="px-4 py-3">
                <button className="text-forest hover:underline text-xs mr-3">Edit</button>
                <button className="text-spice-red hover:underline text-xs">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
