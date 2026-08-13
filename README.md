# HealthPreCheck

HealthPreCheck is a Hack4Health 2026 prototype for AI-assisted patient pre-registration before the patient reaches the clinic counter.

The demo shows a patient-facing upload and verification flow, plus a staff portal where front desk teams can review prepared registrations, identify missing information, and escalate exceptions.

## Live Demo

Production deployment:

```text
https://flowpilot-demo-silk.vercel.app
```

## What It Demonstrates

- Patient pre-arrival document upload
- Browser/server assisted document text extraction
- Prepared patient, insurer, package and billing fields
- Staff dashboard for pre-registered queue review
- Missing-information and exception highlighting
- Mock staff sign-in for demo presentation

## Project Structure

```text
api/
  extract.py                Vercel Python endpoint for file text extraction
flowpilot-demo/
  index.html                HealthPreCheck frontend
  styles.css                HealthPreCheck styling
  app.js                    Demo data, interactions and upload logic
  server.py                 Local development server
vercel.json                 Vercel routing
pyproject.toml              Python runtime/dependencies for Vercel
requirements.txt            Python extraction dependencies
```

## Run Locally

```bash
cd flowpilot-demo
python3 server.py
```

Then open:

```text
http://127.0.0.1:4173
```

## Deploy

From the repository root:

```bash
vercel login
vercel deploy --prod
```

The current production alias is:

```text
https://flowpilot-demo-silk.vercel.app
```

## Prototype Scope

This is a stable hackathon prototype. The sign-in flow is a mock staff login for presentation purposes, not a real authentication system. Document parsing and coverage checks are simulated where needed so the demo remains reliable.
