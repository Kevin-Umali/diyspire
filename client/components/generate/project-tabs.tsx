import Link from "next/link";
import { GeneratedIdea } from "@/interfaces";
import { BookOpen, FlaskConical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectTabsProps {
  projects: GeneratedIdea[];
  className?: string;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ projects, className }) => {
  return (
    <Tabs defaultValue={projects[0]?.title} className={`${className}`}>
      <TabsList className="grid h-full w-full grid-cols-1 sm:grid-cols-3">
        {projects.map((project) => (
          <TabsTrigger key={project.title} value={project.title} aria-label={`Switch to ${project.title} project`} className="text-sm md:text-base">
            {project.title}
          </TabsTrigger>
        ))}
      </TabsList>

      {projects.map((project) => (
        <TabsContent key={project.title} value={project.title} className="p-4">
          <div className="mb-4 md:flex md:items-center md:space-x-4">
            <h3 className="overflow-hidden whitespace-nowrap text-xl sm:text-lg">{project.title}</h3>
            <Separator orientation="vertical" className="mx-2 hidden h-6 md:block" />
            <div className="flex space-x-2">
              {project.tags.map((tag, tagIndex) => (
                <Badge key={tagIndex} variant="outline" className="text-xs md:text-sm">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <Separator className="my-2 md:hidden" />
          <p className="text-md mb-3 max-w-full">{project.description}</p>
          <div className="flex flex-col space-y-2">
            <Label className="text-md mb-2">
              <b>Materials:</b> {project.materials.join(", ")}
            </Label>
            <Label className="text-md mb-2">
              <b>Tools:</b> {project.tools.join(", ")}
            </Label>
            <Label className="text-md mb-2">
              <b>Time Required:</b> {project.time}
            </Label>
            <Label className="text-md mb-2">
              <b>Budget:</b> {project.budget}
            </Label>
          </div>
          <Separator className="my-2 md:block" />
          <div className="mt-3 flex flex-col items-start space-y-2 md:flex-row md:items-center md:space-x-2 md:space-y-0">
            <Label className="sm:text-md mb-2 text-lg md:mb-0">Like this idea?</Label>
            <Link href={{ pathname: "/project-detail", query: { project: JSON.stringify(project) } }} passHref>
              <Button className="flex w-full items-center justify-center space-x-1 text-xs md:w-auto md:text-sm">
                <BookOpen className="h-4 w-4" aria-label="Book icon" />
                <span>Provide Detailed Steps</span>
              </Button>
            </Link>
            <Link href={{ pathname: "/project-detail", query: { project: JSON.stringify(project) } }} passHref>
              <Button disabled className="mt-2 flex w-full items-center justify-center space-x-1 text-xs md:mt-0 md:w-auto md:text-sm">
                <FlaskConical className="h-4 w-4" aria-label="Flask icon" />
                <span>Generate Ideas Using this Tools/Materials</span>
              </Button>
            </Link>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ProjectTabs;
