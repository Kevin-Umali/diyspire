import Image from "next/image";
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Label } from "../ui/label";

interface ProjectCardProps {
  id: string | number;
  title: string;
  createdAt: string;
  description: string;
  imgUrl: string;
  badges: string[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({ id, title, createdAt, description, imgUrl, badges }) => {
  return (
    <Card className="mx-auto flex h-full max-w-md flex-col" role="article" aria-labelledby={`projectTitle-${id}`} aria-describedby={`projectDescription-${id}`}>
      <div className="relative h-64">
        <Image src={imgUrl} alt={title} layout="fill" objectFit="cover" className="absolute left-0 top-0 h-full w-full" loading="eager" />
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
        <Link className="w-full" href={{ pathname: `/project-detail/${id}` }} aria-label={`Read more about How to make ${title}`} passHref>
          <Button className="w-full" aria-label={`Read more about ${title}`}>
            <BookOpen className="mr-2 h-4 w-4" aria-label={`Read more about ${title}`} />
            <span>Read More</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;
