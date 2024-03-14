import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import CustomMarkdown from "../custom-markdown";

interface ProjectStepsProps {
  isLoading: boolean;
  projectExplanation?: string | null;
}

const ProjectSteps: React.FC<ProjectStepsProps> = ({ isLoading, projectExplanation }) => {
  return (
    <div className="mt-10">
      {isLoading ? (
        <>
          <Skeleton className="mt-5 h-7 w-full" aria-hidden="true" />
          <div className="mt-5 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" aria-hidden="true" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <Label className="mb-6 text-base font-medium uppercase lg:text-lg">Detailed Steps to Follow</Label>
          <div className="text-md w-full leading-relaxed sm:text-lg">
            <CustomMarkdown content={projectExplanation as string} />
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectSteps;
