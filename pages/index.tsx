import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <div>
        <p className="mt-8">Recording all the good you do, every day.</p>
      </div>
      <div className="mt-24">
        <h2>Good board</h2>
        <p>Get inspiration from all the good that others have done</p>
        <ul>
          <li>good thing </li>
        </ul>
      </div>
    </>
  )
}
