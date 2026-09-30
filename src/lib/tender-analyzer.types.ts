export const NOT_SPECIFIED = "Not specified in the document";

export type Req = { requirement: string; value: string; source: string };

export type TenderAnalysis = {
  overview: {
    title: string;
    organization: string;
    tender_id: string;
    category: string;
    estimated_value: string;
    emd: string;
    location: string;
    submission_deadline: string;
  };
  eligibility: Req[];
  financial_requirements: Req[];
  technical_requirements: Req[];
  required_documents: { document: string; source: string }[];
  important_dates: { event: string; date: string; source: string }[];
  summary: string[];
};

export const DATE_EVENTS = [
  "Tender Publication Date",
  "Pre-Bid Meeting Date",
  "Query Submission Deadline",
  "Bid Submission Deadline",
  "Technical Bid Opening",
  "Financial Bid Opening",
];
