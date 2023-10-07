import { RelatedImages } from "@/interfaces";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Info, Share } from "lucide-react";

interface ProjectImageProps {
  isLoading: boolean;
  projectTitle: string;
  relatedImages: RelatedImages | null;
  onOpen: () => void;
}

const UNSPLASH_PROJECT_NAME = process.env.NEXT_PUBLIC_UNSPLASH_PROJECT_NAME;

const ProjectImage: React.FC<ProjectImageProps> = ({ isLoading, projectTitle, relatedImages, onOpen }) => {
  const imageUrl = relatedImages?.urls ? relatedImages.urls.regular : "https://via.placeholder.com/500";
  const photographerName = relatedImages?.user?.name;
  const photographerLink = relatedImages?.user?.link;

  const googleSearchLink = `https://www.google.com/search?q=${projectTitle}`;
  const youtubeSearchLink = `https://www.youtube.com/results?search_query=${projectTitle} Tutorial`;

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <Skeleton className="h-[500px] lg:h-[500px]" />
        <div className="space-y-4 mt-4">
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
        alt={relatedImages?.alt_description ?? "Image related to the project"}
        layout="responsive"
        objectFit="cover"
        objectPosition="center"
        draggable={false}
        width={200}
        height={300}
        onContextMenu={(e) => e.preventDefault()}
        loading="eager"
      />

      <div className="flex flex-col items-center w-full mt-2">
        {photographerName && (
          <Label className="text-sm text-center">
            Photo by{" "}
            <a className="mx-1 underline" href={`${photographerLink}?utm_source=${UNSPLASH_PROJECT_NAME}&utm_medium=referral`} target="_blank" rel="noopener noreferrer">
              {`${photographerName}`}
            </a>{" "}
            on{" "}
            <a className="ml-1 underline" href={`https://unsplash.com/?utm_source=${UNSPLASH_PROJECT_NAME}&utm_medium=referral`} target="_blank" rel="noopener noreferrer">
              Unsplash
            </a>
          </Label>
        )}
      </div>

      <div className="flex items-center mt-2">
        <Info className="mr-2" />
        <p className="text-sm">
          Note: The image may not accurately represent the project title. For more specific results, you can click to{" "}
          <a className="mx-1 underline" href={googleSearchLink} target="_blank" rel="nofollow noopener noreferrer">
            search on Google
          </a>{" "}
          or watch tutorials on{" "}
          <a className="ml-1 underline" href={youtubeSearchLink} target="_blank" rel="nofollow noopener noreferrer">
            YouTube
          </a>
          .
        </p>
      </div>

      <Button className="mt-4 px-4 py-2" onClick={onOpen}>
        <Share className="w-5 h-5" />
        <span>Share</span>
      </Button>
    </div>
  );
};

export default ProjectImage;
