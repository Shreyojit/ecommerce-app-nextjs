'use client'
import CheckoutSteps from '@/components/CheckoutSteps'
import useCartService from '@/lib/hooks/useCartStore'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Form = () => {
  const router = useRouter()
  const { savePaymentMethod, paymentMethod, shippingAddress } = useCartService()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('PayPal')

  useEffect(() => {
    if (!shippingAddress.address) {
      router.push('/shipping')
    } else {
      setSelectedPaymentMethod(paymentMethod || 'PayPal')
    }
  }, [paymentMethod, router, shippingAddress.address])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    savePaymentMethod(selectedPaymentMethod)
    router.push('/place-order')
  }

  return (
    <div className="p-4">
      <CheckoutSteps current={2} />
      <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6 mt-4">
        <h1 className="text-2xl font-semibold mb-4">Payment Method</h1>
        <form onSubmit={handleSubmit}>
          {['PayPal', 'Stripe', 'CashOnDelivery'].map((payment) => (
            <div key={payment} className="mb-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value={payment}
                  checked={selectedPaymentMethod === payment}
                  onChange={() => setSelectedPaymentMethod(payment)}
                  className="form-radio h-4 w-4 text-indigo-600"
                />
                <span className="text-lg">{payment}</span>
              </label>
            </div>
          ))}
          <div className="mt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Next
            </button>
          </div>
          <div className="mt-2">
            <button
              type="button"
              className="w-full bg-gray-300 text-gray-800 py-2 px-4 rounded-md shadow-sm hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              onClick={() => router.back()}
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Form
