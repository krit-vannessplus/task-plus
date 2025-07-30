"use client";

import { useLiffProfile } from "@/components/liffContext";
import { CreateTaskCard } from "@/components/createTaskCard";

export default function CreateTaskPage() {
  const user = useLiffProfile();

  return (
    <div className="container px-4 sm:px-6 py-8 m-auto max-w-2xl space-y-6">
      {/* your form/UI here */}
      <CreateTaskCard user={user} />
    </div>
  );
}
