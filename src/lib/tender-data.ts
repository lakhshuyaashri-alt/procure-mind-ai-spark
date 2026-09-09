export const sampleTender = {
  title: "Development of AI-Powered Citizen Service Platform",
  organization: "Department of Information Technology",
  value: "₹40,00,000",
  emd: "₹80,000",
  deadline: "18 September 2026",
  completionPeriod: "12 Months",
  referenceNo: "DIT/ITS/2026/AI-CSP/0147",
  summary:
    "The Department of Information Technology invites sealed bids from eligible MSMEs and IT firms for the design, development, deployment and one-year maintenance of an AI-powered citizen service platform. The platform must consolidate 18 existing citizen-facing services into a single portal with multilingual support, an AI assistant for grievance routing, and dashboards for departmental monitoring. The contract is a fixed-price engagement of ₹40,00,000 to be executed over 12 months, with milestone-linked payments and a mandatory 6-month defect liability period after go-live.",
  eligibility: [
    "Minimum annual turnover of ₹1 crore in each of the last three financial years",
    "Minimum 3 years of relevant experience in software development",
    "Valid ISO 9001 certification at the time of bid submission",
    "At least 3 similar completed projects for government or PSU clients",
    "Registered MSME / company with valid GST and PAN",
  ],
  documents: [
    { name: "GST Certificate", available: true },
    { name: "PAN", available: true },
    { name: "Company Registration", available: true },
    { name: "Audited Financial Statements", available: true },
    { name: "Experience Certificates", available: true },
    { name: "ISO Certificate", available: true },
    { name: "EMD Proof", available: false },
  ],
  scope:
    "Requirement study and system design; development of a responsive citizen portal with unified login; integration of 18 departmental services through existing APIs; an AI assistant for grievance classification and routing; role-based administrative dashboards with analytics; security audit and CERT-In compliance clearance; user training for 120 departmental staff; and 12 months of operations support with defined SLAs.",
  dates: [
    { label: "Publication Date", value: "22 August 2026" },
    { label: "Pre-bid Meeting", value: "01 September 2026" },
    { label: "Submission Deadline", value: "18 September 2026" },
    { label: "Technical Bid Opening", value: "22 September 2026" },
  ],
  conditions: [
    "EMD of ₹80,000 must be submitted as a bank guarantee or online transfer before the deadline; bids without valid EMD proof will be rejected.",
    "Performance security of 5% of the contract value is payable within 15 days of the award letter.",
    "Bids are evaluated on a Quality-cum-Cost Based System with 70% technical and 30% financial weightage.",
    "Subcontracting of core development work is not permitted without prior written approval.",
    "Liquidated damages of 0.5% of contract value per week apply for delays, capped at 10%.",
  ],
  insights: [
    {
      level: "High Priority" as const,
      text: "Submission deadline is approaching — 9 working days remain after the pre-bid meeting.",
    },
    {
      level: "Eligibility Risk" as const,
      text: "Check similar-project experience: 3 comparable government projects are mandatory.",
    },
    {
      level: "Document Risk" as const,
      text: "EMD proof is missing from the document checklist and must be arranged.",
    },
  ],
  requirements: {
    turnover: "₹1 Crore",
    experience: "3 Years",
    certification: "ISO 9001",
    similarProjects: "3",
  },
};

export const sampleCompany = {
  companyName: "ABC Technologies Pvt Ltd",
  companyType: "MSME",
  yearsInBusiness: "5",
  annualTurnover: "₹1.8 Crore",
  relevantExperience: "Software Development",
  similarProjects: "2",
  certifications: "ISO 9001",
  location: "Chennai",
  employees: "42",
};

export type ComparisonStatus = "PASS" | "PARTIAL" | "FAIL";

export const comparisonRows: {
  requirement: string;
  required: string;
  company: string;
  status: ComparisonStatus;
}[] = [
  { requirement: "Annual Turnover", required: "₹1 Cr", company: "₹1.8 Cr", status: "PASS" },
  { requirement: "Experience", required: "3 Years", company: "5 Years", status: "PASS" },
  { requirement: "ISO 9001", required: "Required", company: "Available", status: "PASS" },
  { requirement: "Similar Projects", required: "3", company: "2", status: "FAIL" },
];

export const eligibilityInsights = [
  { ok: true, text: "Financial requirement satisfied" },
  { ok: true, text: "Experience requirement satisfied" },
  { ok: true, text: "Required certification available" },
  { ok: false, text: "Similar project requirement not satisfied" },
];
