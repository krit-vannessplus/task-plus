"use client";

import { useLiffProfile } from "@/components/liffContext";
import { CreateTaskCard } from "@/components/createTaskCard";

export default function CreateTaskPage() {
  const user = useLiffProfile();

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 mt-16 md:mt-20 max-w-2xl space-y-6">
      {/* your form/UI here */}
      <CreateTaskCard user={user} />
    </div>
  );
}
