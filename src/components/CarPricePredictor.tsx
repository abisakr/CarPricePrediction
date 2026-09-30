import { useState, FormEvent } from 'react';

interface CarData {
  Year: number | '';
  Present_Price: number | '';
  Kms_Driven: number | '';
  Owner: number | '';
  Fuel_Type: string;
  Seller_Type: string;
  Transmission: string;
}

export default function CarPricePredictor() {
  const [formData, setFormData] = useState<CarData>({
    Year: new Date().getFullYear(),
    Present_Price: '',
    Kms_Driven: '',
    Owner: 0,
    Fuel_Type: 'Petrol',
    Seller_Type: 'Dealer',
    Transmission: 'Manual'
  });

  const [prediction, setPrediction] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await fetch('http://localhost:5000/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setPrediction(data.predicted_price);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to connect to the server. Is Flask running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 transition-all">
      
      <div className="w-full max-w-xl mx-auto bg-white/95 backdrop-blur-xl rounded-3xl shadow-[0_0_40px_rgba(79,70,229,0.3)] border border-white/20 overflow-hidden p-8 sm:p-10 transform transition-all duration-500 hover:shadow-[0_0_60px_rgba(79,70,229,0.5)]">
        
        <div className="mb-10 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight mb-2">
            Value Your Vehicle
          </h2>
          <p className="text-gray-500 text-sm font-medium">Enter your car's details to get an instant AI valuation</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Year */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 group-focus-within:text-indigo-600 transition-colors">Mfg Year</label>
              <input 
                type="number" name="Year" required value={formData.Year} onChange={handleChange} 
                className="block w-full rounded-xl border-0 bg-gray-50/50 p-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 transition-all duration-200 ease-in-out hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none" 
              />
            </div>
            
            {/* Present Price */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 group-focus-within:text-indigo-600 transition-colors">Showroom Price (Lakhs)</label>
              <input 
                type="number" step="0.01" name="Present_Price" required value={formData.Present_Price} onChange={handleChange} 
                className="block w-full rounded-xl border-0 bg-gray-50/50 p-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 transition-all duration-200 ease-in-out hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none" 
              />
            </div>
            
            {/* Kms Driven */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 group-focus-within:text-indigo-600 transition-colors">Kilometers Driven</label>
              <input 
                type="number" name="Kms_Driven" required value={formData.Kms_Driven} onChange={handleChange} 
                className="block w-full rounded-xl border-0 bg-gray-50/50 p-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 transition-all duration-200 ease-in-out hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none" 
              />
            </div>
            
            {/* Owner */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 group-focus-within:text-indigo-600 transition-colors">Previous Owners</label>
              <input 
                type="number" name="Owner" min="0" max="5" required value={formData.Owner} onChange={handleChange} 
                className="block w-full rounded-xl border-0 bg-gray-50/50 p-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 transition-all duration-200 ease-in-out hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-3">
            {/* Fuel Type */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 group-focus-within:text-indigo-600 transition-colors">Fuel</label>
              <div className="relative">
                <select name="Fuel_Type" value={formData.Fuel_Type} onChange={handleChange} className="appearance-none block w-full rounded-xl border-0 bg-gray-50/50 p-3.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 transition-all duration-200 ease-in-out hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none cursor-pointer">
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                  <option value="CNG">CNG</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Seller Type */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 group-focus-within:text-indigo-600 transition-colors">Seller</label>
              <div className="relative">
                <select name="Seller_Type" value={formData.Seller_Type} onChange={handleChange} className="appearance-none block w-full rounded-xl border-0 bg-gray-50/50 p-3.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 transition-all duration-200 ease-in-out hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none cursor-pointer">
                  <option value="Dealer">Dealer</option>
                  <option value="Individual">Individual</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Transmission */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 group-focus-within:text-indigo-600 transition-colors">Transmission</label>
              <div className="relative">
                <select name="Transmission" value={formData.Transmission} onChange={handleChange} className="appearance-none block w-full rounded-xl border-0 bg-gray-50/50 p-3.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 transition-all duration-200 ease-in-out hover:bg-white focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 focus:outline-none cursor-pointer">
                  <option value="Manual">Manual</option>
                  <option value="Automatic">Automatic</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-4 px-4 rounded-xl shadow-lg hover:shadow-indigo-500/30 transform transition-all duration-200 hover:-translate-y-1 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex justify-center items-center group"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing Market...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Calculate Market Value
                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
              </span>
            )}
          </button>
        </form>

        {error && (
          <div className="mt-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 flex items-start gap-3 animate-pulse">
            <svg className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {prediction !== null && !loading && (
          <div className="mt-8 p-8 bg-gradient-to-br from-emerald-50 to-teal-100 rounded-2xl border border-emerald-200 text-center shadow-inner relative overflow-hidden group">
            {/* Decorative background circle */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-200 rounded-full opacity-20 transform group-hover:scale-150 transition-transform duration-700"></div>
            <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-teal-200 rounded-full opacity-20 transform group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="relative z-10">
              <p className="text-sm text-emerald-800 font-bold uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Estimated Value
              </p>
              <div className="flex items-baseline justify-center gap-1 text-emerald-700">
                <span className="text-3xl font-bold">NPR</span>
                <span className="text-6xl font-black tracking-tighter drop-shadow-sm">{prediction}</span>
                <span className="text-xl font-bold ml-1 text-emerald-600/80">Lakhs</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}