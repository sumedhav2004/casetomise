"use client"

import Phone from '@/components/Phone'
import { COLORS, FINISHES, MODELS } from '@/validators/option-validator'
import { Configuration } from '@prisma/client'
import { useEffect, useState } from 'react'
import Confetti from 'react-dom-confetti'
import { cn, formatPrice } from '@/lib/utils'
import { ArrowRight, Check } from 'lucide-react'
import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products'
import { Button } from '@/components/ui/button'
import { useMutation } from '@tanstack/react-query'
import { CreateCheckoutSession } from './actions'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import {useKindeBrowserClient} from "@kinde-oss/kinde-auth-nextjs"
import LoginModal from '@/components/LoginModal'

const DesignPreview = ({configuration}:{configuration : Configuration}) =>{
  const router = useRouter()
  const {toast} = useToast()
  const {id} = configuration
  const {user} = useKindeBrowserClient()
  const [isLoginModalOpen , setIsLoginModalOpen] = useState<boolean>(false)

  const [showConfetti,setShowConfetti] = useState(false)
  const {color,model,finish,material} = configuration


  const tw = COLORS.find((supportedColor)=>supportedColor.value === color)?.tw

  const {label: modelLabel} = MODELS.options.find(({value}) => value === model)!

  let totalPrice = BASE_PRICE
  if(material === "polycarbonate") totalPrice +=PRODUCT_PRICES.material.polycarbonate
  if(finish === "textured") totalPrice += PRODUCT_PRICES.finish.textured

  const {mutate: createPaymentSession} = useMutation({
    mutationKey: ["get-checkot-session"],
    mutationFn: CreateCheckoutSession,
    onSuccess:({url}) => {
      if(url) router.push(url)
        else throw new Error("Unable to retrieve payment URL")
    },
    onError:() =>{
      toast({
        title:"something went wrong",
        description:"There was an error at our end. Please try again",
        variant:"destructive",
      })
    },

  })

  const handleCheckout = () =>{
    if(user){
      createPaymentSession({configId: id})
    }else{
      localStorage.setItem('configurationId',id)
      setIsLoginModalOpen(true)
    }
  }

  useEffect(()=>setShowConfetti(true))

  return <>
    <div className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center">
      <Confetti active={showConfetti}
       config={{elementCount:200, spread:90}}
       />
    </div>

    <LoginModal isOpen={isLoginModalOpen} setIsOpen={setIsLoginModalOpen}/>

    <div className='mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12'>
      <div className='sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2'>
        <Phone className={cn(`bg-${tw}`)} imgSrc={configuration.croppedImageUrl!}  />
      </div>

      <div className='mt-6 sm:col-span-9 sm:mt-0 md:row-end-1'>
        <h3 className='text-3xl font-bold tracking-tight'>Your {modelLabel} case</h3>

        <div className='mt-3 flex items-center gap-1.5 text-base'>
          <Check className='h-4 w-4 text-green-500' />
          In stock and ready to ship.
        </div>
      </div>

      <div className='sm:col-span-12 md:col-span-9 text-base'>
        <div className='grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 smm:grid-cols-2 sm:gap-x-6 s:py-6 md:py-10'>
          <div>
            <p className='font-medium text-zinc-950'>Highlights</p>
            <ol className='mt-3 text-zinc-700 list-disc list-inside'>
              <li >Wireless Charging Compatible</li>
              <li>TPU shock absorption</li>
              <li>Packaging made from recycled material</li>
              <li>5 Year print Warranty</li>
            </ol>
          </div>
          <div>
            <p className='font-medium text-zinc-950'>Materials</p>
            <ol className='mt-3 text-zinc-700 list-disc list-inside'>
              <li >High Quality durable material</li>
              <li>Scratch and fingerprint resistant coating</li>
            </ol>
          </div>
        </div>

        <div className='mt-8 '>
          <div className='bg-gray-50 p-6 sm:rounded-lg sm:p-8'>
            <div className='flow-root text-sm'>
              <div className='flex items-center justify-between py-1 mt-2'>
                <p className='text-gray-600'>
                  Base Price
                </p>
                <p className='font-medium text-gray-900'>{formatPrice(BASE_PRICE/100)}</p>
              </div>

              {finish === "textured" ? (
                  <div className='flex items-center justify-between py-1 mt-2'>
                  <p className='text-gray-600'>
                    Textured Finish
                  </p>
                  <p className='font-medium text-gray-900'>{formatPrice(PRODUCT_PRICES.finish.textured/100)}</p>
                </div>
              ): null}

              {material === "polycarbonate" ? (
                  <div className='flex items-center justify-between py-1 mt-2'>
                  <p className='text-gray-600'>
                    Soft Polycarbonate Material
                  </p>
                  <p className='font-medium text-gray-900'>{formatPrice(PRODUCT_PRICES.material.polycarbonate/100)}</p>
                </div>
              ): null}

              <div className='my-2 h-px bg-gray-200' />

              <div className='flex items-center justify-between py-2'>

                <p className='font-semibold text-gray-900'>Order Total</p>
                <p className='font-semibold text-gray-900'>
                  {formatPrice(totalPrice/100)}
                </p>
              </div>
            </div>
          </div>

          <div className='mt-8 flex justify-end pb-12'>
            <Button onClick={() => handleCheckout()} loadingText='loading' className='px-4 sm:px-6 lg:px-8'>Check Out <ArrowRight className='h-4 w-4 ml-1.5 inline' /></Button>
          </div>
        </div>
      </div>
    </div>
  </>
}

export default DesignPreview