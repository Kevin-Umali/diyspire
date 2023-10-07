"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

import CategoryFilter from "@/components/generate/category-filter";
import DifficultyFilter from "@/components/generate/difficulty-filter";
import MaterialInput from "@/components/generate/material-input";
import SafetyCheck from "@/components/generate/safety-check";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Info, RefreshCcw } from "lucide-react";

import { categories } from "@/constants";
import { generateProjectIdeas, getTotalCountOfGeneratedIdea, incrementCounterOfGeneratedIdea } from "@/lib";

const TimeAvailabilityFilter = dynamic(() => import("@/components/generate/time-availability-filter"));
const ToolsAvailableInput = dynamic(() => import("@/components/generate/tools-available-input"));
const PurposeFilter = dynamic(() => import("@/components/generate/purpose-filter"));
const BudgetFilter = dynamic(() => import("@/components/generate/budget-filter"));

const GenerateLoading = dynamic(() => import("@/components/generate/generate-loading"));
const ProjectTabs = dynamic(() => import("@/components/generate/project-tabs"));

export default function Home() {
  const [materials, setMaterials] = useState([""]);
  const [onlySpecified, setOnlySpecified] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("Anything");
  const [timeValue, setTimeValue] = useState<number>(0);
  const [timeUnit, setTimeUnit] = useState<string | null>(null);
  const [budget, setBudget] = useState(0);
  const [tools, setTools] = useState([""]);
  const [purpose, setPurpose] = useState("Personal Use");
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [isSafe, setIsSafe] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const [projects, setProjects] = useState([]);

  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoadingCount, setIsLoadingCount] = useState(false);

  const { toast } = useToast();

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  useEffect(() => {
    const fetchTotalCount = async () => {
      setIsLoadingCount(true);
      try {
        const response = await getTotalCountOfGeneratedIdea();
        if (response?.data?.totalCount) {
          setTotalCount(response.data.totalCount);
        }
      } catch (error) {
        console.error(error);
        toast({
          title: "Oops!",
          description: "Failed to fetch the total count of generated ideas. Please try again later.",
        });
      } finally {
        setIsLoadingCount(false);
      }
    };

    fetchTotalCount();
  }, [toast]);

  const handleGenerateProjects = useCallback(async () => {
    try {
      if (!isSafe) throw new Error("Please check the safety checkbox");

      setIsGenerating(true);

      const response = await generateProjectIdeas(materials, onlySpecified, selectedDifficulty, selectedCategory, tools, timeValue, timeUnit, budget, purpose);

      if (response.data?.ideas) {
        setProjects(response.data.ideas);
        await incrementCounterOfGeneratedIdea();
        setTotalCount((count) => count + 1);
        setIsGenerated(true);
      }
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error",
        description: error.message,
      });
    } finally {
      setIsGenerating(false);
    }
  }, [budget, isSafe, materials, onlySpecified, purpose, selectedCategory, selectedDifficulty, timeUnit, timeValue, tools, toast]);

  const advancedOptions = useMemo(
    () => (
      <>
        <div className="mb-4">
          <BudgetFilter onBudgetChange={setBudget} />
        </div>

        <div className="mb-4">
          <TimeAvailabilityFilter timeValue={timeValue} timeUnit={timeUnit} onValueChange={setTimeValue} onUnitChange={setTimeUnit} />
        </div>

        <div className="mb-4">
          <ToolsAvailableInput tools={tools} setTools={setTools} />
        </div>

        <div className="mb-4">
          <PurposeFilter purpose={purpose} onPurposeChange={setPurpose} />
        </div>
      </>
    ),
    [purpose, timeUnit, timeValue, tools],
  );

  const renderContent = () => {
    if (isGenerating) {
      return <GenerateLoading />;
    }

    if (isGenerated) {
      return (
        <div className="mb-4">
          <ProjectTabs projects={projects} />
          <div className="flex justify-center space-x-2">
            <Button className="mt-4 px-4 py-2 w-full" onClick={() => setIsGenerated(false)}>
              <RefreshCcw className="w-5 h-5" />
              <span>Generate Again</span>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="mb-4">
          <MaterialInput materials={materials} setMaterials={setMaterials} onlySpecified={onlySpecified} setOnlySpecified={setOnlySpecified} />
        </div>
        <div className="mb-4">
          <DifficultyFilter onDifficultyChange={setSelectedDifficulty} />
        </div>
        <div className="mb-4">
          <CategoryFilter categories={categories} onCategoryChange={setSelectedCategory} />
        </div>
        <Button className="mb-4 px-4 py-2 w-full lg:w-auto focus:outline-none focus:ring-2 focus:ring-opacity-50" onClick={toggleAdvancedOptions}>
          {showAdvancedOptions ? "Hide" : "Show"} Advanced Options
        </Button>
        {showAdvancedOptions && advancedOptions}
        <div className="flex justify-between items-center mb-4">
          <div>
            <SafetyCheck onSafetyConfirmation={setIsSafe} />
          </div>
          <Button className="px-4 py-2 w-full lg:w-auto focus:outline-none focus:ring-2 focus:ring-opacity-50 flex items-center justify-center space-x-2" onClick={handleGenerateProjects}>
            <RefreshCcw className="w-5 h-5" />
            <span>Generate Projects</span>
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl mb-6 font-bold">DIY Project Ideas</h1>
        <Separator orientation="vertical" className="mx-4 h-8 md:hidden" />
        <div className="flex items-center">
          <span className="ml-2 mr-2 flex items-center">
            <Info size={24} />
          </span>
          <Label className="text-md lg:text-lg">
            <span role="img" aria-label="party popper">
              Total generated ideas so far: {!isLoadingCount ? totalCount : "Loading..."}
            </span>
          </Label>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}
