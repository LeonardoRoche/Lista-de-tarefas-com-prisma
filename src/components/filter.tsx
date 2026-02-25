import React from "react";
import { Badge } from "./ui/badge";
import { ArrowDownRight, Check, List } from "lucide-react";

export type filterType = "all" | "pending" | "completed";

interface FilterProps {
  currentFielter: filterType;
  setCurrentFilter: (filter: filterType) => void;
}

const Filter = ({ currentFielter, setCurrentFilter }: FilterProps) => {
  return (
    <div className="flex gap-2">
      <Badge
        variant={`${currentFielter === "all" ? "default" : "outline"}`}
        className="cursor-pointer"
        onClick={() => setCurrentFilter("all")}
      >
        <List />
        Todas
      </Badge>
      <Badge
        variant={`${currentFielter === "pending" ? "default" : "outline"}`}
        className="cursor-pointer"
        onClick={() => setCurrentFilter("pending")}
      >
        <ArrowDownRight />
        Não finalizadas
      </Badge>
      <Badge
        variant={`${currentFielter === "completed" ? "default" : "outline"}`}
        className="cursor-pointer"
        onClick={() => setCurrentFilter("completed")}
      >
        <Check />
        Concluídas
      </Badge>
    </div>
  );
};

export default Filter;
