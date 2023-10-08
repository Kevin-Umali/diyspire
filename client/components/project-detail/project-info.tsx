import { ProjectLocationState } from "@/interfaces";
import { TimerIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

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
        <h1 className="text-2xl font-semibold leading-tight sm:text-4xl lg:text-5xl">{project.title}</h1>
        <Label className="mt-2 text-lg font-light">
          {project.time} | {project.budget}
        </Label>
        <div className="mt-2 flex items-center">
          <TimerIcon aria-label={`Complete in ${project.time}`} />
          <Label className="ml-2">Complete in {project.time}</Label>
        </div>
      </header>

      <div className="flex flex-col space-y-4 divide-y sm:space-y-6">
        <div className="space-y-4 sm:space-y-6">
          <Label className="text-lg font-light lg:line-clamp-3">{project.description}</Label>
        </div>

        <div className="pt-4">
          <Label className="mb-6 text-base font-medium uppercase lg:text-lg">Materials</Label>
          <ul className="space-y-2">
            {project.materials.map((material, index) => (
              <li key={index}>{material}</li>
            ))}
          </ul>
        </div>

        <div className="pt-4">
          <Label className="mb-6 text-base font-medium uppercase lg:text-lg">Tools</Label>
          <ul className="space-y-2">{project.tools.length >= 1 ? project.tools.map((tool, index) => <li key={index}>{tool}</li>) : <li>Nothing</li>}</ul>
        </div>
      </div>
    </div>
  );
};

export default ProjectInfo;
