# HealthPreCheck Deployment and Parser Notes

## What appears in the demo UI

The visible app name is HealthPreCheck. The staff dashboard should stay
operational and simple. Staff should see the patient queue, case status, missing
fields, prepared registration fields, and next actions.

The staff dashboard should not show raw JSON, audit logs, model names, API
payloads, or automation internals. Technical architecture details should stay in
notes, slides, code, or speaker explanation rather than the main product UI.

## Local demo

Run the prototype locally from the project folder:

```bash
cd /Users/gabrielle/Documents/ChatGPT/Hack4Health/flowpilot-demo
python3 server.py
```

Then open:

```text
http://127.0.0.1:4173
```

The current local server supports static demo cases plus upload-based text
extraction for TXT, CSV, DOCX, and selectable-text PDF files. Image OCR is
handled in the browser through Tesseract.js when the CDN is available.

## Vercel deployment

The repository root already has deployment files:

- `vercel.json` routes the deployed homepage to `flowpilot-demo/index.html`.
- `api/extract.py` provides a Python serverless extraction endpoint.
- `requirements.txt` installs DOCX and PDF extraction dependencies.
- `.vercelignore` keeps local presentation/build artifacts out of deployment.

Deploy from the repository root:

```bash
cd /Users/gabrielle/Documents/ChatGPT/Hack4Health
npm i -g vercel
vercel login
vercel
vercel --prod
```

Actual deployment needs a Vercel account session, so it should be done by the
team member who owns the Vercel account or GitHub repository.

## Recommended document parser architecture

For the hackathon demo:

1. Keep the current upload flow as the visible prototype.
2. Simulate structured parsing in the front end so the demo is stable.
3. Explain the real implementation path in the system architecture slide.

For a real implementation:

1. OCR layer: use GLM-OCR or `cheap-ocr` for scanned PDFs/images and complex
   layouts.
2. Structured extraction layer: use Gemini 2.5 to convert OCR/document text
   into a strict JSON schema.
3. Validation layer: check required fields, confidence thresholds, package
   mapping, billing route, consent, and validity dates.
4. Automation layer: Power Automate queries the insurer/TPA portal and returns
   coverage, co-pay, and billing route.
5. Staff review layer: only safe, staff-facing outcomes are shown in the
   dashboard.

Suggested JSON fields:

```json
{
  "nric": "",
  "patient_name": "",
  "company_tpa_code": "",
  "insurance_policy_code": "",
  "insurer": "",
  "package_code": "",
  "required_tests": [],
  "validity": "",
  "billing_route": "",
  "coverage_status": "",
  "copay_estimate": "",
  "missing_fields": [],
  "escalation_reason": ""
}
```

## Parser choice

Gemini 2.5 is the better choice for structured reasoning and JSON extraction.
GLM-OCR or `cheap-ocr` is the better choice for OCR-heavy scanned PDFs,
multi-column layouts, and table-heavy documents.

Best pitch framing:

> HealthPreCheck reads uploaded documents, prepares structured registration
> fields, validates coverage and billing where possible, and routes unresolved
> cases to staff before the patient reaches the counter.
