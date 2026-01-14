export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="text-center space-y-12 max-w-5xl">
        <h1 className="text-5xl font-bold text-green-800">Välkommen till AgriReg-demo</h1>
        <p className="text-2xl text-gray-700">Testa gratis – välj vy nedan</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <a href="/for-lantbrukare" className="bg-white p-12 rounded-2xl shadow-2xl hover:shadow-3xl transition transform hover:-translate-y-4 block">
            <h2 className="text-4xl font-bold mb-6 text-green-700">För lantbrukare</h2>
            <p className="text-xl text-gray-600 mb-8">Enkel vy för din gård – uppladdning, checklista, tillsynsunderlag och CAP-koll</p>
            <button className="bg-green-600 text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-green-700">
              Testa som lantbrukare →
            </button>
          </a>
          <a href="/for-radgivare" className="bg-white p-12 rounded-2xl shadow-2xl hover:shadow-3xl transition transform hover:-translate-y-4 block">
            <h2 className="text-4xl font-bold mb-6 text-blue-700">För rådgivare</h2>
            <p className="text-xl text-gray-600 mb-8">Portföljvy med alla gårdar, färgkodning och statistik</p>
            <button className="bg-blue-600 text-white px-10 py-5 rounded-xl font-bold text-xl hover:bg-blue-700">
              Testa som rådgivare →
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}