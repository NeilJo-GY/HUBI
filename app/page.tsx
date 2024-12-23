import { Button } from "antd";
import Image from 'next/image';
import Header from '@/app/src/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <Header />
      <main className="relative container mx-auto px-4 py-20 text-center z-10">
        <h1 className="text-5xl md:text-7xl font-bold  mt-6 mb-6 leading-tight text-gray-900">
          AI-Driven UBI Grants
        </h1>
        <p className="text-xl text-gray-600 mb-10">
          Work and Create Freely.
        </p>
        <Button href="/pre-grant/test" type="primary" size="large" className="bg-black hover:bg-gray-800">
          Apply for HUBI Grant
        </Button>
        <div className="mt-20 text-left max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Introducing HUBI</h2>
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">Human-AI Collaboration for an Inclusive Future</h3>
          <Image src="/image.png" alt="Logo" width={900} height={500} />
          <p className="text-lg text-gray-700 mt-4 mb-4">
            The rise of AI has sparked concerns about potential job losses and the widening gap between the rich and poor. Many fear that while AI increases productivity, it may not create enough new jobs to replace those displaced by AI. This could lead to mass unemployment, furthering inequality as the wealthy benefit while those who lose their jobs face increased poverty. Beyond economic worries, people also seek fulfillment and purpose in their work.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            In response to these challenges, HUBI envisions a human-centric, AI-driven future focused on promoting safety, freedom, and inclusion, ensuring that the benefits of technological progress are shared by all.
          </p>
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">Human-Centric</h3>
          <p className="text-lg text-gray-700 mb-4">
            At its core, HUBI emphasizes the importance of developing AI in ways that enhance personal growth and well-being. Rather than merely replacing jobs, AI should create opportunities for individuals to thrive, contributing to a future where technology supports humanity.
          </p>
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">Inclusiveness Through UBI</h3>
          <p className="text-lg text-gray-700 mb-4">
            One of the ways HUBI addresses the impact of AI on employment is through Universal Basic Income (UBI). UBI offers regular, unconditional payments to everyone, enabling individuals to focus on developing new skills and pursuing meaningful activities. This approach fosters a more inclusive society, where everyone has the financial security to engage in the changing job market and contribute meaningfully to their communities.
          </p>
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">HUBI Grant</h3>
          <p className="text-lg text-gray-700 mb-4">
            Empowering individuals to claim support through AI-driven systems, HUBI Grant provides financial security with regular, unconditional payments, enabling people to adapt, upskill, and thrive in the changing job landscape. HUBI is open to all verified individuals, with eligibility verified through HID.
          </p>
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">HID (Human Identity Digital)</h3>
          <p className="text-lg text-gray-700 mb-4">
            HID is HUBI’s secure digital identity solution, allowing individuals to prove they are real and unique while fully protecting their privacy. Through HID, people gain access to HUBI’s services, including UBI, without compromising personal data.
          </p>
          <p className="text-lg text-gray-700 mb-4">
            HUBI’s vision is to promote a balanced and inclusive future, where AI benefits all, and opportunities for growth and fulfillment are accessible to everyone.
          </p>
        </div>
      </main>
      <div className="absolute inset-0 z-0">
      </div>
    </div>
  )
}