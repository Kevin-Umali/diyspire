"use client";

import { useCallback, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useGenerateProjectIdeas, useIncrementCounterOfGeneratedIdea } from "@/api/queries";
import { categories } from "@/constants";
import { useAuth } from "@/context/authContext";
import { useCurrency } from "@/context/currencyContext";
import { AxiosError } from "axios";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import useURLState from "@/hooks/useUrlState";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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

export default function Generate() {
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

  const searchParams = useSearchParams();
  const router = useRouter();

  const { isAuthenticated, accessToken } = useAuth();
  const { currency } = useCurrency();

  const { mutate, data: projects, isPending, isSuccess, reset } = useGenerateProjectIdeas();
  const incrementCounterMutation = useIncrementCounterOfGeneratedIdea();

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };

  const incrementCounter = useCallback(
    (accessToken: string) => {
      incrementCounterMutation.mutate(accessToken, {
        onError: (error) => {
          if (error instanceof AxiosError) {
            toast.error(`Increment Counter Error - ${error.code}`, {
              description: error.response?.data.error || "An error occurred while incrementing the idea generation counter.",
            });
          } else {
            toast.error("Unexpected Error!", {
              description: "An unexpected error occurred during the counter increment. Please try again later.",
            });
          }
        },
      });
    },
    [incrementCounterMutation],
  );

  const handleGenerateProjects = useCallback(async () => {
    if (!isAuthenticated) {
      const queryString: string = new URLSearchParams(searchParams).toString();
      const redirectPath = queryString ? `/login?${queryString}` : "/login";
      router.push(redirectPath);
      return;
    }

    if (!isSafe) throw new Error("Please check the safety checkbox");

    mutate(
      {
        params: {
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
        accessToken: accessToken!,
      },
      {
        onSuccess: async (response, _variables, _context) => {
          if (response.data?.ideas) {
            incrementCounter(accessToken!);
          }
        },
        onError: (error) => {
          if (error && error instanceof AxiosError) {
            const errorMessage = error.response?.data.error || "An error occurred while fetching data from the API.";

            toast.error(`API ERROR - ${error.code}`, {
              description: errorMessage,
            });
          } else if (error) {
            toast.error("Unexpected Error!", {
              description: "An unexpected error occurred. Please try again later.",
            });
          }
        },
      },
    );
  }, [
    isAuthenticated,
    isSafe,
    mutate,
    materials,
    onlySpecified,
    selectedDifficulty,
    selectedCategory,
    tools,
    timeValue,
    timeUnit,
    budget,
    currency,
    purpose,
    accessToken,
    searchParams,
    router,
    incrementCounter,
  ]);

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
    if (isPending) {
      return <GenerateLoading />;
    }

    if (isSuccess) {
      return (
        <div className="mb-4">
          <ProjectTabs projects={projects.data.ideas} />
          <div className="flex justify-center space-x-2">
            <Button className="mt-4 w-full px-4 py-2" onClick={() => reset()}>
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
        <h1 className="mb-3 text-3xl font-semibold lg:text-4xl">&ldquo;DIYspire&rdquo; DIY Ideas Generator</h1>
        <Label className="sm:text-md mt-2 inline-block text-sm">Explore our detailed guides and unleash your creativity with the DIYspire DIY Ideas Generator.</Label>
      </div>
      {renderContent()}
    </div>
  );
}
