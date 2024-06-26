import Image from "next/image";
import Link from "next/link";
import { BookMarked } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface ProjectCardProps {
  id: string | number;
  slug: string;
  title: string;
  createdAt: string;
  description: string;
  imgUrl: string;
  badges: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, slug, title, createdAt, description, imgUrl, badges }) => {
  return (
    <Card className="mx-auto flex h-full max-w-md flex-col" role="article" aria-labelledby={`projectTitle-${id}`} aria-describedby={`projectDescription-${id}`}>
      <div className="relative h-64">
        <Image src={imgUrl} alt={title} layout="fill" objectFit="cover" className="absolute left-0 top-0 size-full" loading="eager" />
      </div>
      <CardHeader className="flex flex-grow flex-col">
        <h2 className="line-clamp-2 text-xl" role="heading" id={`projectTitle-${id}`}>
          How to make {title}
        </h2>
        <Label className="line-clamp-3 text-sm" id={`projectDescription-${id}`}>
          {description}
        </Label>
      </CardHeader>
      <CardContent role="contentinfo" aria-label="Additional information">
        <div className="mb-2 space-x-2" role="list" aria-label="Project badges">
          {badges?.slice(0, 3).map((badge) => (
            <Badge key={badge} className="mb-1 mr-1" role="listitem">
              {badge}
            </Badge>
          ))}
        </div>
        <Label aria-live="polite">
          Created at:{" "}
          {new Date(createdAt).toLocaleString("default", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </Label>
      </CardContent>
      <CardFooter className="mt-auto pt-2" role="contentinfo" aria-label="Footer section">
        <Link className="w-full" href={{ pathname: `/community/project-detail/${slug}` }} passHref>
          <Button className="w-full text-sm" aria-label={`Learn more - ${title}`}>
            <BookMarked className="mr-2 size-4" />
            <span>
              Learn more <span hidden>- {title}</span>
            </span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
