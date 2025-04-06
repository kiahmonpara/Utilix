'use client';

const StripePaymentPlans = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#141d30] p-6">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Choose Your Plan
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="bg-[#1e2a45] rounded-lg overflow-hidden shadow-lg border border-[#2a3854] transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white text-center mb-4">Free</h2>

              <div className="bg-[#263351] rounded-full py-3 px-6 mb-6 mx-auto text-center">
                <span className="text-xl font-bold text-white">0 GBP/month</span>
              </div>

              <button className="w-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-bold py-3 px-4 rounded-full mb-6 transition duration-300 transform hover:shadow-lg">
                Current Plan
              </button>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white text-center mb-2">Current data</h3>
                <p className="text-gray-300 text-center flex items-center justify-center">
                  <span className="text-[#3b82f6] mr-2">→</span> 200 API calls/minute
                </p>
                <p className="text-gray-300 text-center flex items-center justify-center">
                  <span className="text-[#3b82f6] mr-2">→</span> 5,000,000 calls/month
                </p>
                <p className="text-gray-300 text-center flex items-center justify-center">
                  <span className="text-[#3b82f6] mr-2">→</span> Basic features
                </p>
              </div>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="bg-[#1e2a45] rounded-lg overflow-hidden shadow-lg border border-[#3b82f6] transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl relative">
            <div className="absolute top-0 right-0 bg-[#3b82f6] text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              RECOMMENDED
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold text-white text-center mb-4">Pro</h2>

              <div className="bg-[#263351] rounded-full py-3 px-6 mb-6 mx-auto text-center">
                <span className="text-xl font-bold text-white">120 GBP/month</span>
              </div>

              <button className="w-full bg-gradient-to-r from-[#2563eb] to-[#3b82f6] hover:from-[#1d4ed8] hover:to-[#2563eb] text-white font-bold py-3 px-4 rounded-full mb-6 transition duration-300 transform hover:shadow-lg hover:translate-y-[-2px]">
                <a href="https://buy.stripe.com/test_00g14bgMi2qkabKbII" className="block w-full h-full">
                  Subscribe Now
                </a>
              </button>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white text-center mb-2">Premium Features</h3>
                <p className="text-gray-300 text-center flex items-center justify-center">
                  <span className="text-[#3b82f6] mr-2">→</span> 3,000 API calls/minute
                </p>
                <p className="text-gray-300 text-center flex items-center justify-center">
                  <span className="text-[#3b82f6] mr-2">→</span> 100,000,000 calls/month
                </p>
                <p className="text-gray-300 text-center flex items-center justify-center">
                  <span className="text-[#3b82f6] mr-2">→</span> All premium features
                </p>
                <p className="text-gray-300 text-center flex items-center justify-center">
                  <span className="text-[#3b82f6] mr-2">→</span> Priority support
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 text-gray-400 text-sm">
          By subscribing, you agree to our <a href="#" className="text-[#3b82f6] hover:underline">Terms of Service</a> and <a href="#" className="text-[#3b82f6] hover:underline">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentPlans;