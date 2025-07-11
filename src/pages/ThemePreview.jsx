export default function ThemePreview() {
    const colors = [
      { name: 'Primary (Blue)', hex: '#1E3A8A' },
      { name: 'Accent (Gold)', hex: '#FFD700' },
      { name: 'Accent (Emerald)', hex: '#10B981' },
      { name: 'Light Gray', hex: '#F5F5F5', textColor: 'text-black', border: true },
      { name: 'Charcoal', hex: '#1F2937' },
    ];
  
    return (
      <div className="p-6 bg-white min-h-screen">
        <h1 className="text-3xl font-bold text-[#1F2937] mb-6">Tailwind Theme Preview</h1>
  
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4 text-[#1F2937]">Color Palette</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {colors.map(({ name, hex, textColor = 'text-white', border }) => (
              <div
                key={name}
                className={`rounded shadow p-4 text-sm flex flex-col items-center ${
                  textColor
                } ${border ? 'border border-gray-300' : ''}`}
              >
                <div
                  className="w-20 h-20 rounded-full"
                  style={{ backgroundColor: hex }}
                />
                <p className="mt-2 text-center text-[#1F2937]">{name}</p>
              </div>
            ))}
          </div>
        </section>
  
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[#1F2937]">Buttons</h2>
          <div className="space-x-4">
            <button className="px-4 py-2 rounded text-white" style={{ backgroundColor: '#1E3A8A' }}>
              Primary
            </button>
            <button className="px-4 py-2 rounded text-[#1F2937]" style={{ backgroundColor: '#FFD700' }}>
              Accent
            </button>
            <button className="px-4 py-2 rounded text-white" style={{ backgroundColor: '#10B981' }}>
              Available
            </button>
          </div>
        </section>
      </div>
    );
  }
  