import Image from "next/image";
import { ProjectImages } from "@/interfaces";
import { Info, Share } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectImageProps {
  isLoading: boolean;
  isLoaded: boolean;
  projectTitle: string;
  relatedImages: ProjectImages | null;
  onOpen: () => void;
}

const UNSPLASH_PROJECT_NAME = process.env.NEXT_PUBLIC_UNSPLASH_PROJECT_NAME;

const ProjectImage: React.FC<ProjectImageProps> = ({ isLoading, isLoaded, projectTitle, relatedImages, onOpen }) => {
  const { urls, alt_description, user } = relatedImages ?? {};
  const { name: photographerName, link: photographerLink } = user ?? {};

  const imageUrl = urls ? urls.regular : "https://via.placeholder.com/500";

  const googleSearchLink = `https://www.google.com/search?q=${projectTitle}`;
  const youtubeSearchLink = `https://www.youtube.com/results?search_query=${projectTitle} Tutorial`;

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Skeleton className="h-[500px] lg:h-[500px]" />
        <div className="mt-4 space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Image
        src={imageUrl}
        alt={alt_description ?? "Image related to the project"}
        layout="responsive"
        objectFit="cover"
        objectPosition="center"
        draggable={false}
        width={200}
        height={300}
        onContextMenu={(e) => e.preventDefault()}
        loading="eager"
      />

      <div className="mt-2 flex w-full flex-col items-center">
        {photographerName && (
          <Label className="text-center text-sm">
            Photo by
            <a className="mx-1 underline" href={`${photographerLink}?utm_source=${UNSPLASH_PROJECT_NAME}&utm_medium=referral`} target="_blank" rel="noopener noreferrer">
              {`${photographerName}`}
            </a>
            on
            <a className="ml-1 underline" href={`https://unsplash.com/?utm_source=${UNSPLASH_PROJECT_NAME}&utm_medium=referral`} target="_blank" rel="noopener noreferrer">
              Unsplash
            </a>
          </Label>
        )}
      </div>

      <div className="mt-2 flex flex-col items-center md:flex-row md:items-center">
        <Info className="mb-2 sm:mb-0 sm:mr-2" />
        <p className="text-center text-sm sm:text-left">
          Note: The image may not accurately represent the project title. For more specific results, you can click to{" "}
          <a className="mx-1 underline" href={googleSearchLink} target="_blank" rel="nofollow noopener noreferrer">
            search on Google
          </a>
          or watch tutorials on
          <a className="ml-1 underline" href={youtubeSearchLink} target="_blank" rel="nofollow noopener noreferrer">
            YouTube
          </a>
          .
        </p>
      </div>

      <Button className="mt-4 px-4 py-2" onClick={onOpen} disabled={isLoaded}>
        <Share className="mr-2 h-5 w-5" />
        <span>Share</span>
      </Button>
    </div>
  );
};

export default ProjectImage;
