import Link from "next/link";
import { BookOpen, FlaskConical } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Project {
  title: string;
  materials: string[];
  tools: string[];
  time: string;
  budget: string;
  tags: string[];
  description: string;
}

interface ProjectTabsProps {
  projects: Project[];
  className?: string;
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ projects, className }) => {
  return (
    <Tabs defaultValue={projects[0]?.title} className={`${className}`}>
      <TabsList className="mb-4 flex space-x-4 overflow-x-auto">
        {projects.map((project) => (
          <TabsTrigger key={project.title} value={project.title} aria-label={`Switch to ${project.title} project`}>
            {project.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {projects.map((project) => (
        <TabsContent key={project.title} value={project.title} className="p-4">
          <div className="mb-4 md:flex md:flex-row md:items-center md:space-x-4">
            <h3 className="overflow-hidden whitespace-nowrap text-lg">{project.title}</h3>
            <Separator orientation="vertical" className="mx-2 hidden h-6 md:block" />
            <div className="flex space-x-2">
              {project.tags.map((tag, tagIndex) => (
                <Badge key={tagIndex} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <Separator className="my-2 md:hidden" />
          <p className="mb-2 max-w-full truncate text-sm">{project.description}</p>
          <div className="flex flex-col space-y-1">
            <Label className="mb-2 text-sm">
              <b>Materials:</b> {project.materials.join(", ")}
            </Label>
            <Label className="mb-2 text-sm">
              <b>Tools:</b> {project.tools.join(", ")}
            </Label>
            <Label className="mb-2 text-sm">
              <b>Time Required:</b> {project.time}
            </Label>
            <Label className="mb-2 text-sm">
              <b>Budget:</b> {project.budget}
            </Label>
          </div>
          <Separator className="my-2 md:block" />
          <div className="mt-3 flex items-center space-x-2">
            <Label className="text-md">Like this idea?</Label>
            <Link href={{ pathname: "/project-detail", query: { project: JSON.stringify(project) } }} passHref>
              <Button>
                <BookOpen className="mr-2 h-4 w-4" aria-label="Book icon" />
                Provide Detailed Steps
              </Button>
            </Link>
            <Link href={{ pathname: "/project-detail", query: { project: JSON.stringify(project) } }} passHref>
              <Button disabled>
                <FlaskConical className="mr-2 h-4 w-4" aria-label="Book icon" />
                Generate Ideas Using this Tools/Materials
              </Button>
            </Link>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ProjectTabs;
