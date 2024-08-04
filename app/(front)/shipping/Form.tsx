'use client'
import CheckoutSteps from '@/components/CheckoutSteps'
import useCartService from '@/lib/hooks/useCartStore'
import { ShippingAddress } from '@/lib/models/OrderModel'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SubmitHandler, ValidationRule, useForm } from 'react-hook-form'

const Form = () => {
  const router = useRouter()
  const { saveShippingAddrress, shippingAddress } = useCartService()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ShippingAddress>({
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      postalCode: '',
      country: '',
    },
  })

  useEffect(() => {
    // Populate form fields with shipping address data
    setValue('fullName', shippingAddress.fullName)
    setValue('address', shippingAddress.address)
    setValue('city', shippingAddress.city)
    setValue('postalCode', shippingAddress.postalCode)
    setValue('country', shippingAddress.country)
  }, [setValue, shippingAddress])

  const formSubmit: SubmitHandler<ShippingAddress> = async (form) => {
    saveShippingAddrress(form)
    router.push('/payment')
  }

  const FormInput = ({
    id,
    label,
    required,
    pattern,
  }: {
    id: keyof ShippingAddress
    label: string
    required?: boolean
    pattern?: ValidationRule<RegExp>
  }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        type="text"
        id={id}
        {...register(id, {
          required: required && `${label} is required`,
          pattern,
        })}
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
      {errors[id]?.message && (
        <p className="mt-2 text-red-600 text-sm">{errors[id]?.message}</p>
      )}
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <CheckoutSteps current={1} />
      <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6 mt-4">
        <h1 className="text-xl font-semibold mb-4">Shipping Address</h1>
        <form onSubmit={handleSubmit(formSubmit)}>
          <FormInput label="Full Name" id="fullName" required />
          <FormInput label="Address" id="address" required />
          <FormInput label="City" id="city" required />
          <FormInput label="Postal Code" id="postalCode" required />
          <FormInput label="Country" id="country" required />
          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSubmitting ? (
                <span className="animate-spin inline-block w-5 h-5 border-4 border-t-transparent border-indigo-600 rounded-full"></span>
              ) : (
                'Next'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Form
