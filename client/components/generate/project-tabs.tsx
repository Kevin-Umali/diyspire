import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen } from "lucide-react";

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
      <TabsList className="flex overflow-x-auto space-x-4 mb-4">
        {projects.map((project) => (
          <TabsTrigger key={project.title} value={project.title} aria-label={`Switch to ${project.title} project`}>
            {project.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {projects.map((project) => (
        <TabsContent key={project.title} value={project.title} className="p-4">
          <div className="mb-4 md:flex md:flex-row md:items-center md:space-x-4">
            <h3 className="text-lg overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[200px] md:w-[200px]">{project.title}</h3>
            <Separator orientation="vertical" className="mx-2 h-6 hidden md:block" />
            <div className="flex space-x-2">
              {project.tags.map((tag, tagIndex) => (
                <Badge key={tagIndex} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <Separator className="my-2 md:hidden" /> {/* Hide the separator on small screens */}
          <p className="text-sm mb-2 overflow-hidden overflow-ellipsis whitespace-nowrap max-w-full">{project.description}</p>
          <div className="flex flex-col space-y-1">
            <Label className="text-sm mb-2">
              <b>Materials:</b> {project.materials.join(", ")}
            </Label>
            <Label className="text-sm mb-2">
              <b>Tools:</b> {project.tools.join(", ")}
            </Label>
            <Label className="text-sm mb-2">
              <b>Time Required:</b> {project.time}
            </Label>
            <Label className="text-sm mb-2">
              <b>Budget:</b> {project.budget}
            </Label>
          </div>
          <Separator className="my-2 md:block" /> {/* Display the separator on medium and larger screens */}
          <div className="flex space-x-2 items-center mt-3">
            <Label className="text-md">Like this idea?</Label>
            <Link href={{ pathname: "/project-detail", query: { project: JSON.stringify(project) } }} passHref>
              <Button>
                <BookOpen className="mr-2 h-4 w-4" aria-label="Book icon" />
                Provide Detailed Steps
              </Button>
            </Link>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default ProjectTabs;
