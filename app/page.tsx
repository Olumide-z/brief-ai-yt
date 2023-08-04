import Image from 'next/image'
import HeroSection from './components/HeroSection'
import Content from './components/Content'
import './globals.css';

export default function Home() {
  return (
    <main className='backGround min-h-screen padding pt-20'>
      <HeroSection />
      <Content />
    </main>
  )
}
