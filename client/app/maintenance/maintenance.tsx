"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Maintenance: React.FC = () => {
  const { refresh } = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center py-5 sm:py-10">
      <div className="p-6 text-center">
        <Label className="mb-2 block text-2xl font-bold">Under Maintenance</Label>
        <Label className="text-md my-4 block">You can try to refresh the page to see if the issue is resolved.</Label>
        <div className="mt-4 flex flex-col space-y-2">
          <Button onClick={refresh} className="w-full border px-4 py-2">
            Refresh
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
