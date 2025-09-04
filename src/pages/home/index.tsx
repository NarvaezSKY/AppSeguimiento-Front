import DefaultLayout from "@/layouts/default";
import useHome from "./hooks/useHome";
import { Button } from "@heroui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EvidenceModal from "./components/Modal";
import { EvidenceCard } from "@/shared/components/EvidenceCard";
import { Card } from "@heroui/react";
import { useTasksStore } from "@/store/tasks.store";

export default function IndexPage() {

  const navigate = useNavigate();
  const [selected, setSelected] = useState<any | null>(null);
  const {getComponents} = useTasksStore();
  useEffect(() => {
    getComponents();
  }, [])
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center gap-6 py-8 md:py-10 w-full">
        {/* <Card className="w-full max-w-2xl mx-auto shadow-medium hover:shadow-large transition-shadow duration-200">

        </Card> */}
      </section>
    </DefaultLayout>
  );
}
