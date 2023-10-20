"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GuideData } from "@/interfaces";
import { AxiosError } from "axios";

import { getAllGuides } from "@/lib/index";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

export default function HowToGuidesList() {
  const [guides, setGuides] = useState<GuideData[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const fetchedGuides = await getAllGuides();
        setGuides(fetchedGuides.data);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast({
            title: `API ERROR - ${error.code}`,
            description: error.response?.data.error || "An error occurred while fetching data from the API.",
          });
        } else {
          toast({
            title: "Unexpected Error!",
            description: "An unexpected error occurred. Please try again later.",
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGuides();
  }, [toast]);

  return (
    <>
      <div className="container mx-auto px-5 py-12 sm:px-10">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-3xl font-semibold lg:text-4xl">&ldquo;MakeMeDIYspire&rdquo; Guides</h1>
          <Label className="sm:text-md mt-2 inline-block text-sm">From usage to troubleshooting, explore our detailed guides to get the most out of the DIY project generator.</Label>
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
