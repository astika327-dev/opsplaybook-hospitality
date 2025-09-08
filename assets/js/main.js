// Checklist progress tracker
const checklist = document.querySelectorAll("#housekeeping-checklist input");
const progressText = document.getElementById("progress-text");
const progressFill = document.getElementById("progress-fill");

function updateProgress() {
  const completed = [...checklist].filter(c => c.checked).length;
  progressText.textContent = `${completed}/${checklist.length} tasks completed`;
  progressFill.style.width = `${(completed / checklist.length) * 100}%`;
}
checklist.forEach(c => c.addEventListener("change", updateProgress));

// Incident report form
const form = document.getElementById("incident-form");
const log = document.getElementById("incident-log");

form.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("villa-name").value;
  const issue = document.getElementById("issue").value;
  const date = document.getElementById("date").value;
  const severity = document.getElementById("severity").value;

  const report = {
    name, issue, date, severity
  };

  // Save to localStorage
  let reports = JSON.parse(localStorage.getItem("incidentReports")) || [];
  reports.push(report);
  localStorage.setItem("incidentReports", JSON.stringify(reports));

  renderReports();
  form.reset();
});

function renderReports() {
  let reports = JSON.parse(localStorage.getItem("incidentReports")) || [];
  log.innerHTML = "<h3>Incident Log</h3>";
  reports.forEach(r => {
    log.innerHTML += `
      <p><strong>${r.date}</strong> | ${r.name} | ${r.issue} (${r.severity})</p>
    `;
  });
}
renderReports();
