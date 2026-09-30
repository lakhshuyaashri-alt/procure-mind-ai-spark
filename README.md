# ProcureMind AI Assistant

Build a clean, professional web application called:

PROCUREMIND AI

Tagline:

AI-Powered Public Procurement Assistant for MSMEs

This is a final-year B.Tech Computer Science and Business Systems project.

IMPORTANT:

For this first prototype, implement ONLY TWO CORE MODULES:

1. AI Tender Summarizer

2. Tender Eligibility Checker

Do NOT build:

- MCP

- Live government portal integration

- Advanced RAG

- Vector database

- Competitor analysis

- Proposal generator

- Bid prediction

- Payment system

- Complex authentication

The goal is to create a functional, visually impressive prototype for a project review tomorrow.

==================================================

DESIGN

==================================================

Create a modern SaaS-style dashboard.

Style:

- Professional

- Minimal

- Clean

- Modern

- Suitable for a government/procurement technology startup

- White/light background

- Blue/navy professional accents

- Rounded cards

- Good spacing

- Clear typography

- Responsive design

Application name:

ProcureMind AI

Navigation sidebar:

Dashboard

Tender Summarizer

Eligibility Checker

How It Works

Top-right:

User profile placeholder

==================================================

DASHBOARD

==================================================

Show:

Welcome to ProcureMind AI

Subtitle:

Simplifying government tender analysis for MSMEs.

Create 3 summary cards:

Active Tenders

12

Tenders Analyzed

8

Eligibility Checks

5

Then create two large feature cards:

CARD 1

AI Tender Summarizer

Description:

Upload a government tender document and get a simplified summary of important requirements, deadlines and documents.

Button:

Analyze Tender

CARD 2

Eligibility Checker

Description:

Compare your company profile against tender requirements and identify eligibility gaps.

Button:

Check Eligibility

Also add a section:

How ProcureMind Works

Upload Tender

↓

Analyze Requirements

↓

Check Eligibility

↓

Make Better Bid Decisions

==================================================

MODULE 1 – TENDER SUMMARIZER

==================================================

Create a page:

/tender-summarizer

Header:

AI Tender Summarizer

Description:

Convert lengthy government tender documents into clear, actionable information.

Main upload card:

Upload Tender PDF

Drag and drop area

Text:

"Drag & drop your tender PDF here"

Button:

Browse File

Accept:

PDF only

After upload, show selected file.

Button:

Analyze Tender

For this prototype, if backend AI is not available, use realistic sample data after clicking Analyze Tender so the feature can still be demonstrated.

Show loading state:

Analyzing Tender...

Extracting requirements...

Generating summary...

After analysis display:

Tender Overview

Tender Title:

Development of AI-Powered Citizen Service Platform

Organization:

Department of Information Technology

Tender Value:

₹40,00,000

Submission Deadline:

18 September 2026

EMD:

₹80,000

Work Completion Period:

12 Months

Then show sections:

1. Tender Summary

A concise paragraph explaining the tender.

2. Eligibility Requirements

Show as bullet points.

Example:

- Minimum annual turnover of ₹1 crore

- Minimum 3 years of relevant experience

- Valid ISO certification

- At least 3 similar completed projects

3. Required Documents

Show checklist:

✓ GST Certificate

✓ PAN

✓ Company Registration

✓ Audited Financial Statements

✓ Experience Certificates

✓ ISO Certificate

○ EMD Proof

4. Scope of Work

Show a concise description.

5. Important Dates

Publication Date

Submission Deadline

Technical Opening

6. Important Conditions

Show 3–5 important conditions.

7. AI Insights

Show cards:

High Priority

Submission deadline is approaching.

Eligibility Risk

Check similar-project experience.

Document Risk

EMD proof is missing.

Add a button:

Download Summary

==================================================

MODULE 2 – ELIGIBILITY CHECKER

==================================================

Create a page:

/eligibility-checker

Header:

Tender Eligibility Checker

Description:

Compare your company profile with the selected tender requirements.

SECTION 1:

Company Profile

Create form fields:

Company Name

Company Type

Years in Business

Annual Turnover

Relevant Experience

Number of Similar Projects

Certifications

Location

Number of Employees

Use example values:

Company Name:

ABC Technologies Pvt Ltd

Company Type:

MSME

Years in Business:

5

Annual Turnover:

₹1.8 Crore

Relevant Experience:

Software Development

Similar Projects:

2

Certifications:

ISO 9001

Location:

Chennai

Employees:

42

SECTION 2:

Tender Requirements

Display:

Minimum Turnover:

₹1 Crore

Experience:

3 Years

Certification:

ISO 9001

Similar Projects:

3

SECTION 3:

Button:

Check Eligibility

After clicking, display:

Eligibility Result

Score:

75%

Status:

PARTIALLY ELIGIBLE

Use a professional circular progress indicator.

Then create a comparison table:

Requirement | Required | Company | Status

Annual Turnover | ₹1 Cr | ₹1.8 Cr | PASS

Experience | 3 Years | 5 Years | PASS

ISO 9001 | Required | Available | PASS

Similar Projects | 3 | 2 | FAIL

Use:

Green = PASS

Yellow = PARTIAL

Red = FAIL

Then show:

Eligibility Insights

✓ Financial requirement satisfied

✓ Experience requirement satisfied

✓ Required certification available

✗ Similar project requirement not satisfied

Recommendation:

"Review the similar-project requirement before proceeding with the tender."

IMPORTANT:

This is an AI-assisted decision-support prototype.

Do not claim that the result is legally binding or guarantees tender qualification.

==================================================

HOW IT WORKS PAGE

==================================================

Create a simple visual workflow:

1. Upload Tender

2. Extract Information

3. Analyze Requirements

4. Compare Company Profile

5. Generate Eligibility Result

Add a technology section:

Technologies:

React

FastAPI

Python

LLM

RAG

PostgreSQL

For this prototype, only the frontend needs to be functional.

==================================================

SAMPLE DATA

==================================================

Include realistic sample tender data so the application can be demonstrated without connecting to a government portal.

Use the following sample tender:

Title:

Development of AI-Powered Citizen Service Platform

Organization:

Department of Information Technology

Value:

₹40,00,000

EMD:

₹80,000

Deadline:

18 September 2026

Experience:

Minimum 3 years

Turnover:

Minimum ₹1 Crore

Certification:

ISO 9001

Similar Projects:

Minimum 3

Required Documents:

GST, PAN, Registration Certificate, Audited Financial Statements, Experience Certificates, ISO Certificate, EMD Proof

==================================================

USER EXPERIENCE

==================================================

The application should feel like a real SaaS product.

Add:

- Hover effects

- Smooth transitions

- Clear success/failure badges

- Loading animations

- Empty states

- Error messages

- Responsive layout

Do not overload the UI.

Focus on making these TWO modules polished and functional.

==================================================

IMPORTANT

==================================================

Do not invent complex backend functionality.

For the current prototype, use mock/sample tender data where necessary.

Create clean reusable components.

Use realistic procurement terminology.

Make the final result presentation-ready for a college project review.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/def423a9-0f0f-4cdd-a10f-9c0766aebf99).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
