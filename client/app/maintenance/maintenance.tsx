"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const Maintenance: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center py-5 sm:py-10">
      <div className="p-6 text-center">
        <Label className="mb-2 block text-2xl font-bold">Project Archived</Label>
        <Label className="text-md my-4 block">This project is archived and will no longer receive updates or new features. However, you can still explore the existing code on GitHub.</Label>
        <div className="mt-4 flex flex-col space-y-2">
          <a href="https://github.com/Kevin-Umali/diyspire" target="_blank" rel="noopener noreferrer">
            <Button className="w-full border px-4 py-2">View on GitHub</Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
