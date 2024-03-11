import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function Home() {
  return (
    <div>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#6ee7b7] to-[#3f6212] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath: "polygon(36% 87%, 87% 79%, 62% 44%, 17% 52%, 92% 31%, 40% 13%, 23% 72%, 98% 55%, 21% 22%, 87% 90%, 10% 83%, 84% 14%, 10% 25%, 51% 79%, 63% 100%, 92% 40%)", // An example of a diamond shape
            }}
          />
        </div>
        <div className="mx-auto max-w-2xl py-8">
          <div className="text-center">
            <Image src="/android-chrome-192x192.png" alt="MakeMeDIYSpire logo" className="mb-8 inline-block w-1/3 sm:w-1/5 md:w-1/4 lg:w-1/3" width={200} height={200} layout="intrinsic" />
            <Label className="block text-4xl font-bold tracking-tight sm:text-6xl">MakeMeDIYspire - Unleash Your Creativity</Label>
            <Label className="mt-6 block text-lg leading-8">Discover unique DIY project ideas with personalized step-by-step guides, powered by OpenAI.</Label>
            <div className="mt-10 flex items-center justify-center gap-x-1">
              <Link href="/generate" className="rounded-md py-2.5 text-sm  ">
                <Button>Get started</Button>
              </Link>
              <Link href="/guide" className="text-sm leading-6 ">
                <Button variant="ghost">
                  Learn more <span aria-hidden="true"> →</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div
            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#6ee7b7] to-[#3f6212] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
            style={{
              clipPath: "polygon(67% 63%, 5% 88%, 86% 49%, 45% 15%, 32% 57%, 97% 81%, 80% 91%, 56% 99%, 18% 100%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
