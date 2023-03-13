import GoodBoard from '@/components/GoodBoard'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <div>
        <p className="mt-8">Recording all the good you do, every day.</p>
      </div>
      <div className="mt-24 grid grid-cols-2 gap-16">
        <div className="">
          <p>Get inspiration from all the good that others have done</p>
          <ul>
            <li>good thing </li>
          </ul>
        </div>

        <GoodBoard />
      </div>
    </>
  )
}
