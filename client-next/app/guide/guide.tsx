"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllGuides } from "@/lib/index";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";

type Guide = {
  path: string;
  metadata: {
    title: string;
  };
};

export default function HowToGuidesList() {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const fetchedGuides = await getAllGuides();
        setGuides(fetchedGuides.data);
      } catch (error) {
        console.error(error);
        toast({
          title: "Oops!",
          description: "Failed to fetch guides. Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [toast]);

  return (
    <>
      <div className="container mx-auto px-5 sm:px-10 py-12">
        <div className="text-center mb-12">
          <h1 className="mb-3 text-3xl lg:text-4xl font-semibold">&ldquo;MakeMeDIYspire&rdquo; Guides</h1>
          <Label className="text-sm sm:text-md inline-block mt-2">From usage to troubleshooting, explore our detailed guides to get the most out of the DIY project generator.</Label>
        </div>

        {loading ? (
          [...Array(2)].map((_, i) => (
            <div key={i}>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              {i !== guides.length - 1 && <Separator className="my-4" />}
            </div>
          ))
        ) : (
          <ul>
            {guides.map((guide, index) => (
              <li key={index} className="py-1">
                <Link href={`/guide/${guide.path}`}>{guide.metadata.title}</Link>
                {index !== guides.length - 1 && <Separator className="my-4" />}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
