export type FactsColumn = {
  key: string;
  label: string;
  badge?: string;
};

export type FactsRow = {
  label: string;
  values: Record<string, string>;
};

export const businessComparisonColumns: FactsColumn[] = [
  { key: "sole_individual", label: "Sole proprietor", badge: "Individual" },
  { key: "sole_dba", label: "Sole proprietor", badge: "DBA / FBN" },
  { key: "llc", label: "LLC" },
  { key: "s_corp", label: "S corporation", badge: "TBA" },
  { key: "c_corp", label: "C corporation", badge: "TBA" }
];

export const businessComparisonRows: FactsRow[] = [
  {
    label: "Best for",
    values: {
      sole_individual: "Fastest path when you are selling under your own legal name.",
      sole_dba: "Solo business with a public brand name that differs from your legal name.",
      llc: "Founder who wants liability separation and a cleaner business identity.",
      s_corp: "Later-stage tax optimization once payroll and profit structure matter more.",
      c_corp: "Venture-scale structure, fundraising, stock plans, and board governance."
    }
  },
  {
    label: "Setup speed",
    values: {
      sole_individual: "Fastest",
      sole_dba: "Fast, but county filing adds time",
      llc: "Moderate",
      s_corp: "TBA",
      c_corp: "TBA"
    }
  },
  {
    label: "Liability separation",
    values: {
      sole_individual: "No separation",
      sole_dba: "No separation",
      llc: "Yes",
      s_corp: "Yes",
      c_corp: "Yes"
    }
  },
  {
    label: "Business name flexibility",
    values: {
      sole_individual: "Low, because you are using your own legal name",
      sole_dba: "Higher, because the DBA/FBN gives you a public brand name",
      llc: "High, legal entity plus optional DBA if needed",
      s_corp: "TBA",
      c_corp: "TBA"
    }
  },
  {
    label: "Ongoing formalities",
    values: {
      sole_individual: "Low",
      sole_dba: "Low to moderate",
      llc: "Moderate",
      s_corp: "Higher",
      c_corp: "Highest"
    }
  },
  {
    label: "Tax complexity",
    values: {
      sole_individual: "Low",
      sole_dba: "Low",
      llc: "Moderate",
      s_corp: "Higher",
      c_corp: "Higher"
    }
  }
];

export const businessBudgetRows: FactsRow[] = [
  {
    label: "Core filing cost",
    values: {
      sole_individual: "$0 if you use your legal name",
      sole_dba: "County DBA / FBN filing fee",
      llc: "State formation filing fee",
      s_corp: "TBA",
      c_corp: "TBA"
    }
  },
  {
    label: "Name-related cost",
    values: {
      sole_individual: "$0",
      sole_dba: "Possible newspaper publication and county name-filing costs",
      llc: "Usually included in formation unless you also need a DBA",
      s_corp: "TBA",
      c_corp: "TBA"
    }
  },
  {
    label: "Tax and ID cost",
    values: {
      sole_individual: "Usually EIN only if needed",
      sole_dba: "Usually EIN plus any local registrations",
      llc: "EIN plus state or local registrations as needed",
      s_corp: "TBA",
      c_corp: "TBA"
    }
  },
  {
    label: "Banking and software",
    values: {
      sole_individual: "Low but still worth separating accounts when possible",
      sole_dba: "Low to moderate",
      llc: "Moderate, because separate banking is expected",
      s_corp: "TBA",
      c_corp: "TBA"
    }
  },
  {
    label: "Ongoing admin budget",
    values: {
      sole_individual: "Lowest",
      sole_dba: "Low, with some renewal costs",
      llc: "Moderate ongoing compliance budget",
      s_corp: "Higher ongoing tax and payroll budget",
      c_corp: "Highest ongoing legal, tax, and governance budget"
    }
  }
];

export const budgetingNotes = [
  "Sole proprietor as an individual is the cheapest path because there is usually no separate formation filing and no DBA if you use your own legal name publicly.",
  "Sole proprietor with a DBA / FBN is still cheaper than an LLC, but the public brand name adds filing and possibly publication costs depending on county rules.",
  "LLC usually costs more up front because you are paying for actual entity formation, then still may pay DBA costs if the public brand differs from the LLC legal name.",
  "Real totals vary by state, county, city, publication requirements, registered agent choices, and whether you use paid banking, bookkeeping, or legal tools."
];
