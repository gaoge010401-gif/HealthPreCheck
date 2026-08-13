const patients = [
  {
    id: 'S8536477Z',
    time: '08:42',
    name: 'Loh Amir',
    type: 'Corporate health screening',
    doc: 'Bluepeak Wellness Voucher',
    status: 'ready',
    summary: 'Corporate screening - Bluepeak Wellness Voucher',
    issueTitle: '',
    issues: [],
    fields: {
      'Date of birth': '14/02/1988',
      Mobile: '9234 1188',
      Email: 'amir.loh@example.com',
      Allergy: 'Nil',
      'Uploaded doc': 'Bluepeak Wellness Voucher'
    },
    checklist: [
      ['Registration data matched', 'ok'],
      ['Document fields extracted', 'ok'],
      ['Coverage active', 'ok'],
      ['Registration can be pre-filled', 'ok'],
      ['Counter ID check required', 'ok']
    ],
    extraction: [
      ['NRIC / ID', 'S8536477Z', '98%', false],
      ['Company / TPA', 'BLUEPEAK', '93%', false],
      ['Package', 'WELL2 - Comprehensive', '91%', false],
      ['Billing route', 'Direct insurer billing', '89%', false]
    ],
    actions: ['Approve for counter ID check.', 'Keep QR code ready at reception.']
  },
  {
    id: 'T0291441B',
    time: '09:04',
    name: 'Devi Hui Min',
    type: 'Insurance medical examination',
    doc: 'Everwell Insurance Medical Test Letter',
    status: 'missing',
    summary: 'Insurance medical exam - missing questionnaire section',
    issueTitle: 'Information needed before counter approval',
    issues: ['Questionnaire not completed', 'Patient consent checkbox is empty', 'Package code not stated'],
    fields: {
      'Date of birth': '22/11/1979',
      Mobile: '8122 4470',
      Email: 'devi.hm@example.com',
      Allergy: 'Penicillin',
      'Uploaded doc': 'Everwell Insurance Medical Test Letter'
    },
    checklist: [
      ['Patient profile found, questionnaire incomplete', 'warning'],
      ['Insurer and policy number extracted', 'ok'],
      ['Coverage query cannot finish without billing code', 'warning'],
      ['Registration can be pre-filled except billing fields', 'warning'],
      ['Case waits for missing information', 'warning']
    ],
    extraction: [
      ['NRIC / ID', 'T0291441B', '97%', false],
      ['Policy', 'EWL-77821', '86%', false],
      ['Package', 'Not stated', '35%', true],
      ['Consent', 'Missing', '0%', true]
    ],
    actions: ['Request missing questionnaire information.', 'Confirm package code before approval.', 'Do not submit billing yet.']
  },
  {
    id: 'S5782670A',
    time: '09:17',
    name: 'Wong Siti',
    type: 'Medical requirement follow-up',
    doc: 'Northstar Life Assurance Letter',
    status: 'exception',
    summary: 'Follow-up letter - package mapping needs human review',
    issueTitle: 'Manual review required',
    issues: ['No safe package match found', 'Billing route needs manual confirmation', 'Latex allergy should be visible to staff'],
    fields: {
      'Date of birth': '07/09/1981',
      Mobile: '95055688',
      Email: 'siti.wong91@hotmail.com',
      Allergy: 'Latex',
      'Uploaded doc': 'Northstar Life Assurance Letter'
    },
    checklist: [
      ['Registration data matched', 'ok'],
      ['Insurer and requested test extracted', 'ok'],
      ['Eligibility check has no safe package match', 'danger'],
      ['Billing route needs manual confirmation', 'danger'],
      ['AI stops and escalates for human decision', 'danger']
    ],
    extraction: [
      ['Insurer', 'Northstar Life Assurance', '90%', false],
      ['Policy / code', 'NSTNBU', '82%', false],
      ['Package', 'No standard package match', '31%', true],
      ['Required tests', 'Repeat urine examination and microscopy', '88%', false],
      ['Validity', 'Deadline 13/08/2026', '87%', false]
    ],
    actions: ['Verify package mapping with insurer.', 'Confirm billing route before registration.', 'Escalate before completing registration.']
  }
];

let selectedIndex = 2;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function showToast(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => { toast.hidden = true; }, 2600);
}

function switchView(view) {
  $$('.view').forEach((section) => section.classList.toggle('active', section.dataset.page === view));
  if (view === 'staff') renderDashboard();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function statusLabel(status) {
  if (status === 'ready') return 'Ready';
  if (status === 'missing') return 'Missing Info';
  return 'Needs Review';
}

function statusClass(status) {
  if (status === 'ready') return 'ready';
  if (status === 'missing') return 'missing';
  return 'exception';
}

function renderDashboard() {
  const list = $('#case-list');
  list.innerHTML = patients.map((patient, index) => `
    <button class="case-row ${statusClass(patient.status)} ${index === selectedIndex ? 'active' : ''} ${patient.status !== 'ready' ? 'problem' : ''}" data-index="${index}" type="button">
      <span>${patient.time}</span>
      <span><strong>${patient.name}</strong><small>${patient.type}<br>${patient.doc}</small></span>
      <span class="badge ${statusClass(patient.status)}">${statusLabel(patient.status)}</span>
    </button>
  `).join('');

  $$('.case-row').forEach((row) => {
    row.addEventListener('click', () => {
      selectedIndex = Number(row.dataset.index);
      renderDashboard();
    });
  });

  renderCase(patients[selectedIndex]);
}

function renderCase(patient) {
  $('#case-type').textContent = patient.type;
  $('#case-name').textContent = patient.name;
  $('#case-summary').textContent = patient.summary;
  $('#case-status').className = `status-pill ${statusClass(patient.status)}`;
  $('#case-status').textContent = statusLabel(patient.status);

  const issuePanel = $('#issue-panel');
  if (patient.issues.length) {
    issuePanel.hidden = false;
    issuePanel.classList.toggle('danger', patient.status === 'exception');
    $('#issue-title').textContent = patient.issueTitle;
    $('#issue-list').innerHTML = patient.issues.map((issue) => `<li>${issue}</li>`).join('');
  } else {
    issuePanel.hidden = true;
  }

  $('#patient-fields').innerHTML = Object.entries(patient.fields)
    .map(([key, value]) => `<dt>${key}</dt><dd>${value}</dd>`)
    .join('');

  $('#checklist').innerHTML = patient.checklist
    .map(([text, level]) => `<li class="${level}">${text}</li>`)
    .join('');

  const average = Math.round(patient.extraction.reduce((sum, item) => sum + Number(item[2].replace('%', '')), 0) / patient.extraction.length);
  $('#confidence').textContent = `Avg ${average}%`;
  $('#field-table').innerHTML = patient.extraction
    .map(([field, value, confidence, issue]) => `
      <div class="field-row ${issue ? 'issue' : ''}">
        <strong>${field}</strong>
        <span>${value}</span>
        <b>${confidence}</b>
      </div>
    `).join('');

  $('#actions').innerHTML = patient.actions.map((action) => `<li>${action}</li>`).join('');
}

function fillPatientSample(patient) {
  $('#patient-name-input').value = patient.name;
  $('#patient-id-input').value = patient.id;
  $('#insurer-input').value = patient.doc.split(' ')[0] === 'Bluepeak' ? 'Bluepeak Prosperity Life' : patient.doc.replace(' Letter', '');
  $('#policy-input').value = patient.extraction.find((row) => row[0].includes('Policy'))?.[1] || 'BLP301158';
  $('#package-output').textContent = patient.extraction.find((row) => row[0] === 'Package')?.[1] || 'WELL2 - Comprehensive';
  $('#ocr-text').value = `${patient.name}\n${patient.id}\n${patient.doc}\n${patient.summary}`;
  $('#upload-status').textContent = patient.status === 'ready' ? 'Document analyzed. Ready for verification.' : 'Document analyzed. Staff review may be needed.';
  showToast(`${patient.name} sample loaded`);
}

async function analyzeUpload() {
  const file = $('#document-upload').files[0];
  const manualText = $('#ocr-text').value.trim();
  if (!file && !manualText) {
    showToast('Please upload a file or paste document text first.');
    return;
  }

  $('#upload-status').textContent = 'Analyzing document...';

  if (file) {
    const formData = new FormData();
    formData.append('document', file);
    try {
      const response = await fetch('/api/extract', { method: 'POST', body: formData });
      const data = await response.json();
      if (data.text) $('#ocr-text').value = data.text;
      $('#upload-status').textContent = data.warning || `Extracted text using ${data.method || 'prototype parser'}.`;
    } catch (error) {
      $('#upload-status').textContent = 'Local OCR fallback: file selected, using prototype sample fields.';
    }
  } else {
    $('#upload-status').textContent = 'Manual text analyzed with prototype parser.';
  }

  fillPatientSample(patients[0]);
}

function openSignin() {
  $('#signin-modal').hidden = false;
  $('#signin-staff').focus();
}

function closeSignin() {
  $('#signin-modal').hidden = true;
}

function completeSignin(message = 'Signed in as demo staff') {
  closeSignin();
  switchView('staff');
  showToast(message);
}

function init() {
  $$('[data-view]').forEach((button) => {
    button.addEventListener('click', () => switchView(button.dataset.view));
  });

  $('#document-upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    $('#file-name').textContent = file ? file.name : 'No file selected';
    if (file) $('#upload-status').textContent = 'File ready for analysis';
  });

  $('#analyze-upload').addEventListener('click', analyzeUpload);
  $('#sample-ready').addEventListener('click', () => fillPatientSample(patients[0]));
  $('#sample-missing').addEventListener('click', () => fillPatientSample(patients[1]));
  $('#sample-review').addEventListener('click', () => fillPatientSample(patients[2]));

  $('#signin-open').addEventListener('click', openSignin);
  $('#signin-close').addEventListener('click', closeSignin);
  $('#signin-demo').addEventListener('click', () => completeSignin());
  $('#signin-modal').addEventListener('click', (event) => {
    if (event.target.id === 'signin-modal') closeSignin();
  });
  $('#signin-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const code = $('#signin-code').value.trim();
    if (code && code !== '1234') {
      showToast('For the prototype, use demo code 1234.');
      return;
    }
    completeSignin('Staff portal unlocked');
  });

  $('#approve').addEventListener('click', () => showToast('Case approved for counter ID check.'));
  $('#request').addEventListener('click', () => showToast('Missing information request prepared.'));
  $('#review').addEventListener('click', () => showToast('Case escalated for staff review.'));

  renderDashboard();
}

document.addEventListener('DOMContentLoaded', init);
