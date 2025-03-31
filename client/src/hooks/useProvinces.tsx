import { useState, useMemo } from "react";

interface Province {
  value: string;
  label: string;
}

export function useProvinces() {
  // Core provinces
  const coreProvinces: Province[] = useMemo(() => [
    { value: "Ontario", label: "Ontario" },
    { value: "British Columbia", label: "British Columbia" },
    { value: "Alberta", label: "Alberta" },
    { value: "Quebec", label: "Quebec" },
  ], []);

  // All provinces and territories
  const allProvinces: Province[] = useMemo(() => [
    ...coreProvinces,
    { value: "Manitoba", label: "Manitoba" },
    { value: "Saskatchewan", label: "Saskatchewan" },
    { value: "Nova Scotia", label: "Nova Scotia" },
    { value: "New Brunswick", label: "New Brunswick" },
    { value: "Newfoundland and Labrador", label: "Newfoundland and Labrador" },
    { value: "Prince Edward Island", label: "Prince Edward Island" },
    { value: "Northwest Territories", label: "Northwest Territories" },
    { value: "Yukon", label: "Yukon" },
    { value: "Nunavut", label: "Nunavut" },
    { value: "General", label: "All of Canada (Federal)" },
  ], [coreProvinces]);

  return {
    provinces: allProvinces,
    coreProvinces
  };
}
