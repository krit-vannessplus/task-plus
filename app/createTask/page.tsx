"use client";

import { useLiffProfile } from "@/components/liffContext";
import { CreateTaskCard } from "@/components/createTaskCard";

export default function CreateTaskPage() {
  const user = useLiffProfile();

  return (
    <div>
      {/* your form/UI here */}
      <CreateTaskCard user={user} />
    </div>
  );
}
