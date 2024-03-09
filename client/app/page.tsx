"use client";

import { useCallback, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { categories } from "@/constants";
import { useAuth } from "@/context/authContext";
import { useCurrency } from "@/context/currencyContext";
import { GeneratedIdea } from "@/interfaces";
import { AxiosError } from "axios";
import { RefreshCcw } from "lucide-react";

import { generateProjectIdeas, incrementCounterOfGeneratedIdea } from "@/lib/api-helper";
import useURLState from "@/hooks/useUrlState";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import CategoryFilter from "@/components/generate/category-filter";
import DifficultyFilter from "@/components/generate/difficulty-filter";
import MaterialInput from "@/components/generate/material-input";
import SafetyCheck from "@/components/generate/safety-check";

const TimeAvailabilityFilter = dynamic(() => import("@/components/generate/time-availability-filter"));
const ToolsAvailableInput = dynamic(() => import("@/components/generate/tools-available-input"));
const PurposeFilter = dynamic(() => import("@/components/generate/purpose-filter"));
const BudgetFilter = dynamic(() => import("@/components/generate/budget-filter"));

const GenerateLoading = dynamic(() => import("@/components/generate/generate-loading"));
const ProjectTabs = dynamic(() => import("@/components/generate/project-tabs"));

export default function Home() {
  const [materials, setMaterials] = useURLState<string[]>("materials", [""]);
  const [onlySpecified, setOnlySpecified] = useURLState<boolean>("only_specified", false);
  const [selectedDifficulty, setSelectedDifficulty] = useURLState<string>("selected_difficulty", "any difficulty");
  const [selectedCategory, setSelectedCategory] = useURLState<string>("selected_category", "Anything");
  const [timeValue, setTimeValue] = useURLState<number>("time_value", 0);
  const [timeUnit, setTimeUnit] = useURLState<string | null>("time_unit", null);
  const [budget, setBudget] = useURLState<string>("budget", "0");
  const [tools, setTools] = useURLState<string[]>("tools", [""]);
  const [purpose, setPurpose] = useURLState<string>("purpose", "Personal Use");
  const [showAdvancedOptions, setShowAdvancedOptions] = useURLState<boolean>("show_advanced_options", false);
  const [isSafe, setIsSafe] = useURLState<boolean>("is_safe", false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);

  const [projects, setProjects] = useState<GeneratedIdea[] | never[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const { toast } = useToast();

  const { isAuthenticated, accessToken } = useAuth();
  const { currency } = useCurrency();

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  const handleGenerateProjects = useCallback(async () => {
    try {
      if (!isAuthenticated) {
        const queryString: string = new URLSearchParams(searchParams).toString();
        const redirectPath = queryString ? `/login?${queryString}` : "/login";
        router.push(redirectPath);
        return;
      }

      if (!isSafe) throw new Error("Please check the safety checkbox");

      setIsGenerating(true);

      const response = await generateProjectIdeas(
        {
          materials,
          onlySpecified,
          difficulty: selectedDifficulty,
          category: selectedCategory,
          tools,
          timeValue,
          timeUnit,
          budget,
          currency,
          endPurpose: purpose,
        },
        accessToken!,
      );

      if (response.data?.ideas) {
        setProjects(response.data.ideas);
        await incrementCounterOfGeneratedIdea(accessToken!);
        setIsGenerated(true);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast({
          title: `API ERROR - ${error.code}`,
          description: error.response?.data.error || "An error occurred while fetching data from the API.",
        });
      } else {
        toast({
          title: "Unexpected Error!",
          description: "An unexpected error occurred. Please try again later.",
        });
      }
    } finally {
      setIsGenerating(false);
    }
  }, [isAuthenticated, isSafe, materials, onlySpecified, selectedDifficulty, selectedCategory, tools, timeValue, timeUnit, budget, currency, purpose, accessToken, searchParams, router, toast]);

  const advancedOptions = useMemo(
    () => (
      <>
        <div className="mb-4">
          <BudgetFilter currency={currency} budget={budget} onBudgetChange={setBudget} />
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
    [budget, currency, purpose, setBudget, setPurpose, setTimeUnit, setTimeValue, setTools, timeUnit, timeValue, tools],
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
            <Button className="mt-4 w-full px-4 py-2" onClick={() => setIsGenerated(false)}>
              <RefreshCcw className="mr-2 size-5" />
              <span>Generate Again</span>
            </Button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="mb-4">
          <CategoryFilter categories={categories} initialCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
        </div>
        <div className="mb-4">
          <DifficultyFilter initialDifficulty={selectedDifficulty} onDifficultyChange={setSelectedDifficulty} />
        </div>
        <div className="mb-4">
          <MaterialInput materials={materials} setMaterials={setMaterials} onlySpecified={onlySpecified} setOnlySpecified={setOnlySpecified} />
        </div>
        {showAdvancedOptions && advancedOptions}
        <div className="mb-4">
          <SafetyCheck isSafe={isSafe} onSafetyConfirmation={setIsSafe} />
        </div>
        <div className="mb-4 flex flex-col space-y-4 lg:flex-row lg:space-x-4 lg:space-y-0">
          <Button className="w-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 lg:w-1/2" onClick={toggleAdvancedOptions}>
            {showAdvancedOptions ? "Hide" : "Show"} Advanced Options
          </Button>
          <Button className="flex w-full items-center justify-center space-x-2 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-opacity-50 lg:w-1/2" onClick={handleGenerateProjects}>
            <RefreshCcw className="size-5" />
            <span>Generate Projects</span>
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-12 text-center">
        <h1 className="mb-3 text-3xl font-semibold lg:text-4xl">&ldquo;MakeMeDIYspire&rdquo; DIY Ideas Generator</h1>
        <Label className="sm:text-md mt-2 inline-block text-sm">Explore our detailed guides and unleash your creativity with the MakeMeDIYspire DIY Ideas Generator.</Label>
      </div>
      {renderContent()}
    </div>
  );
}
