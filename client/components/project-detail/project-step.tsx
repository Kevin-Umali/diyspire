import React from "react";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface ProjectStepsProps {
  isLoading: boolean;
  projectExplanation: string | null;
}

const ProjectSteps: React.FC<ProjectStepsProps> = ({ isLoading, projectExplanation }) => {
  return (
    <div className="mt-10">
      {isLoading ? (
        <>
          <Skeleton className="h-7 mt-5 w-full" />
          <div className="mt-5 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <Label className="text-base lg:text-lg font-medium uppercase mb-4">Detailed Steps to Follow</Label>
          <Label className="text-md sm:text-lg leading-relaxed">
            {projectExplanation
              ? projectExplanation.split("\n").map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < projectExplanation.split("\n").length - 1 && <br />}
                  </React.Fragment>
                ))
              : "No detailed steps provided."}
          </Label>
        </>
      )}
    </div>
  );
};

export default ProjectSteps;
