import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectStepsProps {
  isLoading: boolean;
  projectExplanation: string | null;
}

const ProjectSteps: React.FC<ProjectStepsProps> = ({ isLoading, projectExplanation }) => {
  const explanationLines = projectExplanation ? projectExplanation.split("\n") : [];

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
          <div className="text-md leading-relaxed sm:text-lg">
            {explanationLines.length ? (
              explanationLines.map((line, index) => (
                <p key={index} className="text-md mb-2 last:mb-0">
                  {line}
                </p>
              ))
            ) : (
              <p>No detailed steps provided.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectSteps;
