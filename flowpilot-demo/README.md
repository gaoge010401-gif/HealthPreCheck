# HealthPreCheck Demo

HealthPreCheck is a lightweight mock prototype for the Hack4Health technical
track. It demonstrates AI-assisted patient pre-registration before the patient
arrives at the clinic: document upload, information review, eligibility/package
preparation, billing preparation, missing-information tracking, and staff
review for exceptions.

## Run locally

Start the local demo server:

```bash
cd /Users/gabrielle/Documents/ChatGPT/Hack4Health/flowpilot-demo
python3 server.py
```

Then open:

```text
http://127.0.0.1:4173
```

Opening `index.html` directly still works for the fixed mock cases, but upload
extraction for DOCX/PDF files needs `server.py`.

## Demo flow

1. Use `Pre-Register` to show the patient-facing upload and verification flow.
2. Use `Staff Portal` to show the clinic dashboard and pre-registered queue.
3. Select `Loh Amir` to show a ready case.
4. Select `Devi Hui Min` to show missing information and generated follow-up
   tasks.
5. Select `Wong Siti` to show exception escalation and human-in-the-loop
   review.
6. Use `Approve`, `Request Info`, or `Review` to demonstrate staff control.
7. Upload a TXT/CSV/DOCX/PDF file, paste extracted text, or use the sample
   document buttons to generate a new uploaded case.

## Prototype scope

This version uses mock extraction results based on synthetic Hack4Health
materials. It now includes local text extraction for TXT/CSV/DOCX/PDF files.
Image OCR uses browser-side Tesseract.js when the CDN is available; a production
version should use a secured server-side OCR/LLM pipeline.

See `../HealthPreCheck_deployment_and_parser_notes.md` for the teammate-facing
deployment and parser plan, including possible Gemini 2.5 plus GLM-OCR /
cheap-ocr implementation choices.

## Vercel deployment

The repository root now contains Vercel-ready files:

- `vercel.json` maps `/` to this demo and keeps `/api/extract` available.
- `api/extract.py` provides the Vercel serverless extraction endpoint.
- `requirements.txt` installs `python-docx` and `pypdf` for DOCX/PDF text
  extraction.
- `.vercelignore` excludes local PPT/build artifacts.

Deploy from the repository root:

```bash
cd /Users/gabrielle/Documents/ChatGPT/Hack4Health
npm i -g vercel
vercel login
vercel
vercel --prod
```

For the hackathon prototype, document parsing and coverage checks are simulated
so the demo is stable. For a live integration, keep model, insurer portal, and
automation credentials in Vercel environment variables or secured automation
connections, never in `app.js`.
