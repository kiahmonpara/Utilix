"use client"
import Stripe from "@/components/stripe.jsx"
import { useRouter } from 'next/navigation'

export default function PaymentPage() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="payment-container">
      <div className="back-navigation">
        <button 
          onClick={handleBack}
          className="back-button"
          aria-label="Go back"
        >
          ← Back
        </button>
      </div>
      <Stripe />
    </div>
  )
}