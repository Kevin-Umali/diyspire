import { ProjectLocationState } from "@/interfaces";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { TimerIcon } from "lucide-react";

interface ProjectInfoProps {
  isLoading: boolean;
  project: ProjectLocationState;
}

const ProjectInfo: React.FC<ProjectInfoProps> = ({ isLoading, project }) => {
  if (isLoading) {
    return (
      <div className="space-y-6 md:space-y-5">
        <Skeleton className="h-5 w-full" aria-hidden="true" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" aria-hidden="true" />
          <Skeleton className="h-4 w-full" aria-hidden="true" />
          <Skeleton className="h-4 w-full" aria-hidden="true" />
          <Skeleton className="h-4 w-full" aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-5">
      <header>
        <h1 className="text-2xl sm:text-4xl lg:text-5xl leading-tight font-semibold">{project.title}</h1>
        <Label className="text-lg mt-2 font-light">
          {project.time} | {project.budget}
        </Label>
        <div className="flex items-center mt-2">
          <TimerIcon aria-label={`Complete in ${project.time}`} />
          <Label className="ml-2">Complete in {project.time}</Label>
        </div>
      </header>

      <div className="space-y-4 sm:space-y-6 flex flex-col divide-y">
        <div className="space-y-4 sm:space-y-6">
          <Label className="text-lg font-light lg:line-clamp-3">{project.description}</Label>
        </div>

        <div className="pt-4">
          <Label className="text-base lg:text-lg font-medium uppercase mb-4">Materials</Label>
          <ul className="space-y-2">
            {project.materials.map((material, index) => (
              <li key={index}>{material}</li>
            ))}
          </ul>
        </div>

        <div className="pt-4">
          <Label className="text-base lg:text-lg font-medium uppercase mb-4">Tools</Label>
          <ul className="space-y-2">{project.tools.length >= 1 ? project.tools.map((tool, index) => <li key={index}>{tool}</li>) : <li>Nothing</li>}</ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
