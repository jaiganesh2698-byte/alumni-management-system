(function () {
  "use strict";

  const STORAGE_KEY = "alumni-management-ui-v1";

  /** Same as data/seed.json — used when opening index.html via file:// (fetch may fail). */
  const EMBEDDED_SEED = {
    degreePrograms: [
      { id: 1, code: "BSC-CS", name: "B.Sc. Computer Science", level: "Bachelor", durationYears: 4 },
      { id: 2, code: "MSC-DS", name: "M.Sc. Data Science", level: "Master", durationYears: 2 },
      { id: 3, code: "PHD-EE", name: "Ph.D. Electrical Engineering", level: "Doctorate", durationYears: null },
    ],
    departments: [
      { id: 1, code: "CS", name: "Computer Science" },
      { id: 2, code: "EE", name: "Electrical Engineering" },
      { id: 3, code: "BUS", name: "Business Administration" },
    ],
    alumni: [
      { id: 1, studentIdLegacy: "U2018001", firstName: "Priya", lastName: "Nair", email: "priya.nair@example.com", phone: "+1-555-0101", graduationYear: 2018, degreeProgramId: 1, departmentId: 1, city: "Chennai", country: "India", consentContact: true, notes: "" },
      { id: 2, studentIdLegacy: "U2019007", firstName: "James", lastName: "Okafor", email: "j.okafor@example.com", phone: "+1-555-0102", graduationYear: 2019, degreeProgramId: 1, departmentId: 1, city: "Toronto", country: "Canada", consentContact: true, notes: "" },
      { id: 3, studentIdLegacy: "G2021003", firstName: "Mei", lastName: "Tan", email: "mei.tan@example.com", phone: "", graduationYear: 2021, degreeProgramId: 2, departmentId: 1, city: "Singapore", country: "Singapore", consentContact: true, notes: "" },
      { id: 4, studentIdLegacy: "P2020001", firstName: "Elena", lastName: "Volkov", email: "elena.volkov@example.com", phone: "+1-555-0104", graduationYear: 2020, degreeProgramId: 3, departmentId: 2, city: "Berlin", country: "Germany", consentContact: false, notes: "" },
      { id: 5, studentIdLegacy: "U2017033", firstName: "Carlos", lastName: "Silva", email: "carlos.silva@example.com", phone: "+1-555-0105", graduationYear: 2017, degreeProgramId: 1, departmentId: 3, city: "São Paulo", country: "Brazil", consentContact: true, notes: "" },
    ],
    employment: [
      { id: 1, alumniId: 1, employer: "Acme Analytics", jobTitle: "Software Engineer", startDate: "2018-07-01", endDate: "2021-03-15", isCurrent: false },
      { id: 2, alumniId: 1, employer: "Northwind Labs", jobTitle: "Senior Engineer", startDate: "2021-04-01", endDate: null, isCurrent: true },
      { id: 3, alumniId: 2, employer: "Contoso Health", jobTitle: "Data Analyst", startDate: "2019-09-01", endDate: null, isCurrent: true },
      { id: 4, alumniId: 3, employer: "Fabrikam AI", jobTitle: "ML Engineer", startDate: "2021-06-01", endDate: null, isCurrent: true },
      { id: 5, alumniId: 4, employer: "Research Institute Z", jobTitle: "Postdoctoral Researcher", startDate: "2020-10-01", endDate: null, isCurrent: true },
      { id: 6, alumniId: 5, employer: "Adventure Works", jobTitle: "Product Manager", startDate: "2017-08-01", endDate: "2022-12-31", isCurrent: false },
      { id: 7, alumniId: 5, employer: "Wide World Importers", jobTitle: "Director of Operations", startDate: "2023-01-15", endDate: null, isCurrent: true },
    ],
    events: [
      { id: 1, title: "Class of 2018 Reunion", eventType: "Reunion", startsAt: "2026-06-14T18:00:00", location: "Main Campus Hall", description: "Ten-year reunion dinner." },
      { id: 2, title: "Alumni Tech Career Panel", eventType: "Career", startsAt: "2026-03-05T17:30:00", location: "Virtual (Zoom)", description: "Panel with engineers and founders." },
      { id: 3, title: "Annual Giving Day", eventType: "Fundraising", startsAt: "2026-09-20T00:00:00", location: "Online", description: "24-hour fundraising campaign." },
    ],
    eventRegistrations: [
      { alumniId: 1, eventId: 1, registeredAt: "2026-01-10T12:00:00", attended: null },
      { alumniId: 2, eventId: 1, registeredAt: "2026-01-11T09:00:00", attended: null },
      { alumniId: 2, eventId: 2, registeredAt: "2026-02-01T10:00:00", attended: true },
      { alumniId: 3, eventId: 2, registeredAt: "2026-02-01T11:00:00", attended: true },
      { alumniId: 5, eventId: 3, registeredAt: "2026-01-15T08:00:00", attended: null },
    ],
    donations: [
      { id: 1, alumniId: 1, amount: 250, currency: "USD", donatedAt: "2025-11-01", campaign: "Annual Fund" },
      { id: 2, alumniId: 2, amount: 100, currency: "USD", donatedAt: "2025-11-02", campaign: "Annual Fund" },
      { id: 3, alumniId: 5, amount: 500, currency: "USD", donatedAt: "2026-09-20", campaign: "Giving Day 2026" },
    ],
  };

  function cloneSeed() {
    return JSON.parse(JSON.stringify(EMBEDDED_SEED));
  }

  function nextId(items) {
    return items.reduce((m, x) => Math.max(m, x.id || 0), 0) + 1;
  }

  function loadFromStorage() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function saveToStorage(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  async function loadInitialState() {
    const stored = loadFromStorage();
    if (stored && stored.alumni && stored.degreePrograms) return stored;
    try {
      const res = await fetch("data/seed.json");
      if (res.ok) return await res.json();
    } catch (_) {}
    return cloneSeed();
  }

  function toast(message, isError) {
    const area = document.getElementById("toasts");
    const el = document.createElement("div");
    el.className = "toast" + (isError ? " error" : "");
    el.textContent = message;
    area.appendChild(el);
    setTimeout(() => el.remove(), 4200);
  }

  function escapeHtml(s) {
    if (s == null) return "";
    const d = document.createElement("div");
    d.textContent = s;
    return d.innerHTML;
  }

  function fullName(a) {
    return `${a.firstName} ${a.lastName}`;
  }

  function degreeName(state, id) {
    const d = state.degreePrograms.find((x) => x.id === id);
    return d ? d.name : "—";
  }

  function deptName(state, id) {
    const d = state.departments.find((x) => x.id === id);
    return d ? d.name : "—";
  }

  function formatEventWhen(iso) {
    try {
      const d = new Date(iso);
      return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
    } catch {
      return iso;
    }
  }

  let state = cloneSeed();
  let selectedAlumniId = null;

  function renderOverview() {
    const stats = document.getElementById("overview-stats");
    const donationTotal = state.donations.reduce((s, d) => s + d.amount, 0);
    const registered = state.eventRegistrations.length;
    stats.innerHTML = `
      <div class="stat-card"><strong>${state.alumni.length}</strong><span>Alumni records</span></div>
      <div class="stat-card"><strong>${state.employment.filter((e) => e.isCurrent).length}</strong><span>Current roles</span></div>
      <div class="stat-card"><strong>${state.events.length}</strong><span>Events</span></div>
      <div class="stat-card"><strong>${registered}</strong><span>Event registrations</span></div>
      <div class="stat-card"><strong>${donationTotal.toLocaleString(undefined, { style: "currency", currency: "USD" })}</strong><span>Total gifts (mixed currency summed as numbers in demo)</span></div>
    `;
  }

  function fillSelects() {
    const deg = document.getElementById("a-degree");
    const dep = document.getElementById("a-dept");
    const dAl = document.getElementById("d-alumni");
    deg.innerHTML = state.degreePrograms
      .map((p) => `<option value="${p.id}">${escapeHtml(p.code)} — ${escapeHtml(p.name)}</option>`)
      .join("");
    dep.innerHTML = state.departments
      .map((d) => `<option value="${d.id}">${escapeHtml(d.code)} — ${escapeHtml(d.name)}</option>`)
      .join("");
    dAl.innerHTML = state.alumni
      .slice()
      .sort((a, b) => fullName(a).localeCompare(fullName(b)))
      .map((a) => `<option value="${a.id}">${escapeHtml(fullName(a))}</option>`)
      .join("");
  }

  function getFilterQuery() {
    return (document.getElementById("filter-alumni").value || "").trim().toLowerCase();
  }

  function renderAlumniTable() {
    const tbody = document.querySelector("#table-alumni tbody");
    const q = getFilterQuery();
    const rows = state.alumni.filter((a) => {
      if (!q) return true;
      const blob = [fullName(a), a.email, a.city, a.country, a.studentIdLegacy || ""].join(" ").toLowerCase();
      return blob.includes(q);
    });
    rows.sort((a, b) => a.lastName.localeCompare(b.lastName) || a.firstName.localeCompare(b.firstName));
    tbody.innerHTML = rows
      .map(
        (a) => `
      <tr data-id="${a.id}" tabindex="0">
        <td>${escapeHtml(fullName(a))}</td>
        <td>${escapeHtml(a.email)}</td>
        <td>${a.graduationYear}</td>
        <td>${escapeHtml(degreeName(state, a.degreeProgramId))}</td>
        <td>${escapeHtml(deptName(state, a.departmentId))}</td>
        <td>${escapeHtml([a.city, a.country].filter(Boolean).join(", ") || "—")}</td>
      </tr>`
      )
      .join("");
    if (rows.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No alumni match your search.</td></tr>`;
    }
  }

  function renderAlumniDetail() {
    const wrap = document.getElementById("alumni-detail");
    if (!selectedAlumniId) {
      wrap.hidden = true;
      wrap.innerHTML = "";
      return;
    }
    const a = state.alumni.find((x) => x.id === selectedAlumniId);
    if (!a) {
      selectedAlumniId = null;
      wrap.hidden = true;
      return;
    }
    const jobs = state.employment.filter((e) => e.alumniId === a.id).sort((x, y) => y.startDate.localeCompare(x.startDate));
    const donationRows = state.donations.filter((d) => d.alumniId === a.id);
    const hasDonations = donationRows.length > 0;
    wrap.hidden = false;
    wrap.innerHTML = `
      <div class="detail-header">
        <div>
          <h3>${escapeHtml(fullName(a))}</h3>
          <p class="muted">${escapeHtml(a.email)} · Class of ${a.graduationYear} · ${escapeHtml(degreeName(state, a.degreeProgramId))}</p>
        </div>
        <div>
          ${hasDonations ? `<p class="muted">Cannot delete: donation history exists (DBMS RESTRICT).</p>` : `<button type="button" class="btn btn-danger btn-delete-alumni" data-id="${a.id}">Delete record</button>`}
        </div>
      </div>
      <div class="two-col">
        <div>
          <h4 style="margin:0 0 0.5rem;font-size:0.95rem;">Profile</h4>
          <p class="muted" style="margin:0 0 0.5rem;">${escapeHtml(a.studentIdLegacy || "—")} · ${escapeHtml(deptName(state, a.departmentId))}</p>
          <p class="muted" style="margin:0;">${escapeHtml(a.phone || "No phone")} · ${escapeHtml([a.city, a.country].filter(Boolean).join(", ") || "—")}</p>
          <p style="margin:0.75rem 0 0;"><span class="badge">${a.consentContact ? "Consent: yes" : "Consent: no"}</span></p>
          ${a.notes ? `<p style="margin-top:0.75rem;">${escapeHtml(a.notes)}</p>` : ""}
        </div>
        <div>
          <h4 style="margin:0 0 0.5rem;font-size:0.95rem;">Employment history</h4>
          <ul style="margin:0;padding-left:1.1rem;color:var(--muted);font-size:0.9rem;">
            ${jobs.map((e) => `<li><strong>${escapeHtml(e.employer)}</strong> — ${escapeHtml(e.jobTitle)} (${e.startDate}${e.endDate ? " → " + e.endDate : ""})${e.isCurrent ? ' <span class="badge badge-warm">current</span>' : ""}</li>`).join("")}
          </ul>
          <form id="form-job" style="margin-top:1rem;padding-top:1rem;border-top:1px solid var(--border);">
            <p style="margin:0 0 0.5rem;font-weight:600;font-size:0.85rem;">Add current role</p>
            <div class="form-grid">
              <div><label for="j-employer">Employer</label><input type="text" id="j-employer" required /></div>
              <div><label for="j-title">Title</label><input type="text" id="j-title" required /></div>
              <div><label for="j-start">Start date</label><input type="date" id="j-start" required /></div>
            </div>
            <button type="submit" class="btn">Save as current job</button>
            <p class="muted" style="margin:0.5rem 0 0;font-size:0.8rem;">Marks previous current roles as ended (matches SQL rules).</p>
          </form>
        </div>
      </div>
    `;
    wrap.querySelector("#form-job").addEventListener("submit", onAddJob);
    const del = wrap.querySelector(".btn-delete-alumni");
    if (del) del.addEventListener("click", onDeleteAlumni);
  }

  function onAddJob(ev) {
    ev.preventDefault();
    const employer = document.getElementById("j-employer").value.trim();
    const jobTitle = document.getElementById("j-title").value.trim();
    const startDate = document.getElementById("j-start").value;
    if (!selectedAlumniId || !employer || !jobTitle || !startDate) return;
    state.employment.forEach((e) => {
      if (e.alumniId === selectedAlumniId && e.isCurrent) {
        e.isCurrent = false;
        e.endDate = startDate;
      }
    });
    state.employment.push({
      id: nextId(state.employment),
      alumniId: selectedAlumniId,
      employer,
      jobTitle,
      startDate,
      endDate: null,
      isCurrent: true,
    });
    saveToStorage(state);
    toast("Employment updated.");
    renderAlumniDetail();
    renderCareers();
    renderOverview();
  }

  function onDeleteAlumni(ev) {
    const id = Number(ev.target.getAttribute("data-id"));
    if (!id || state.donations.some((d) => d.alumniId === id)) {
      toast("Remove donations first or keep record.", true);
      return;
    }
    if (!confirm("Delete this alumni and related employment and event registrations?")) return;
    state.alumni = state.alumni.filter((a) => a.id !== id);
    state.employment = state.employment.filter((e) => e.alumniId !== id);
    state.eventRegistrations = state.eventRegistrations.filter((r) => r.alumniId !== id);
    selectedAlumniId = null;
    saveToStorage(state);
    toast("Alumni removed.");
    renderAlumniTable();
    renderAlumniDetail();
    fillSelects();
    renderCareers();
    renderEvents();
    renderDonations();
    renderOverview();
  }

  function renderCareers() {
    const tbody = document.querySelector("#table-careers tbody");
    const rows = [];
    state.alumni.forEach((a) => {
      const cur = state.employment.find((e) => e.alumniId === a.id && e.isCurrent);
      if (cur) rows.push({ a, e: cur });
    });
    rows.sort((x, y) => fullName(x.a).localeCompare(fullName(y.a)));
    tbody.innerHTML = rows
      .map(
        (x) => `
      <tr>
        <td>${escapeHtml(fullName(x.a))}</td>
        <td>${escapeHtml(x.e.employer)}</td>
        <td>${escapeHtml(x.e.jobTitle)}</td>
        <td>${escapeHtml(x.e.startDate)}</td>
      </tr>`
      )
      .join("");
  }

  function isRegistered(alumniId, eventId) {
    return state.eventRegistrations.some((r) => r.alumniId === alumniId && r.eventId === eventId);
  }

  function renderEvents() {
    const list = document.getElementById("events-list");
    const alumniOpts = state.alumni
      .slice()
      .sort((a, b) => fullName(a).localeCompare(fullName(b)))
      .map((a) => `<option value="${a.id}">${escapeHtml(fullName(a))}</option>`)
      .join("");
    list.innerHTML = state.events
      .map((ev) => {
        const regs = state.eventRegistrations.filter((r) => r.eventId === ev.id);
        const regLines = regs
          .map((r) => {
            const a = state.alumni.find((x) => x.id === r.alumniId);
            const att = r.attended === true ? "attended" : r.attended === false ? "no-show" : "pending";
            return `<li>${escapeHtml(a ? fullName(a) : "?")} — <span class="badge">${att}</span></li>`;
          })
          .join("");
        return `
        <div class="event-card" data-event-id="${ev.id}">
          <h4>${escapeHtml(ev.title)} <span class="badge badge-warm">${escapeHtml(ev.eventType)}</span></h4>
          <p class="muted" style="margin:0 0 0.35rem;">${formatEventWhen(ev.startsAt)} · ${escapeHtml(ev.location || "—")}</p>
          <p style="margin:0 0 0.75rem;font-size:0.9rem;">${escapeHtml(ev.description || "")}</p>
          <div style="display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center;margin-bottom:0.5rem;">
            <label for="reg-alumni-${ev.id}" class="sr-only">Register alumni</label>
            <select id="reg-alumni-${ev.id}" class="reg-alumni-select" style="max-width:220px;">${alumniOpts}</select>
            <button type="button" class="btn btn-reg-event" data-event-id="${ev.id}">Register</button>
          </div>
          <p style="margin:0;font-size:0.8rem;font-weight:600;color:var(--muted);">Registrations (${regs.length})</p>
          <ul style="margin:0.35rem 0 0;padding-left:1.1rem;font-size:0.9rem;">${regLines || '<li class="muted">None yet.</li>'}</ul>
        </div>`;
      })
      .join("");

    list.querySelectorAll(".btn-reg-event").forEach((btn) => {
      btn.addEventListener("click", () => {
        const eventId = Number(btn.getAttribute("data-event-id"));
        const card = list.querySelector(`.event-card[data-event-id="${eventId}"]`);
        const sel = card.querySelector(".reg-alumni-select");
        const alumniId = Number(sel.value);
        if (!alumniId || !eventId) return;
        if (isRegistered(alumniId, eventId)) {
          toast("Already registered.", true);
          return;
        }
        state.eventRegistrations.push({
          alumniId,
          eventId,
          registeredAt: new Date().toISOString(),
          attended: null,
        });
        saveToStorage(state);
        toast("Registered for event.");
        renderEvents();
        renderOverview();
      });
    });
  }

  function renderDonations() {
    const tbody = document.querySelector("#table-donations tbody");
    const rows = state.donations.slice().sort((a, b) => b.donatedAt.localeCompare(a.donatedAt));
    tbody.innerHTML = rows
      .map((d) => {
        const a = state.alumni.find((x) => x.id === d.alumniId);
        return `<tr>
        <td>${escapeHtml(d.donatedAt)}</td>
        <td>${escapeHtml(a ? fullName(a) : "?")}</td>
        <td>${escapeHtml(d.amount.toLocaleString())} ${escapeHtml(d.currency)}</td>
        <td>${escapeHtml(d.campaign || "—")}</td>
      </tr>`;
      })
      .join("");
  }

  function showPanel(id) {
    document.querySelectorAll(".panel").forEach((p) => {
      p.hidden = p.id !== "panel-" + id;
    });
    document.querySelectorAll(".nav button").forEach((b) => {
      b.setAttribute("aria-current", b.getAttribute("data-panel") === id ? "true" : "false");
    });
  }

  function wireNav() {
    document.querySelectorAll(".nav button").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-panel");
        showPanel(id);
        if (id === "alumni") {
          document.getElementById("filter-alumni").focus();
        }
      });
    });
  }

  function wireAlumniTable() {
    const table = document.getElementById("table-alumni");
    table.addEventListener("click", (e) => {
      const tr = e.target.closest("tr[data-id]");
      if (!tr) return;
      selectedAlumniId = Number(tr.getAttribute("data-id"));
      renderAlumniDetail();
    });
    table.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const tr = e.target.closest("tr[data-id]");
      if (!tr) return;
      e.preventDefault();
      selectedAlumniId = Number(tr.getAttribute("data-id"));
      renderAlumniDetail();
    });
    document.getElementById("filter-alumni").addEventListener("input", () => {
      renderAlumniTable();
    });
  }

  document.getElementById("form-alumni").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const email = String(fd.get("email") || "").trim().toLowerCase();
    if (state.alumni.some((a) => a.email.toLowerCase() === email)) {
      toast("Email already in use.", true);
      return;
    }
    const year = Number(fd.get("graduationYear"));
    if (year < 1950 || year > 2100) {
      toast("Graduation year must be between 1950 and 2100.", true);
      return;
    }
    const row = {
      id: nextId(state.alumni),
      studentIdLegacy: String(fd.get("studentIdLegacy") || "").trim() || null,
      firstName: String(fd.get("firstName") || "").trim(),
      lastName: String(fd.get("lastName") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      phone: String(fd.get("phone") || "").trim(),
      graduationYear: year,
      degreeProgramId: Number(fd.get("degreeProgramId")),
      departmentId: Number(fd.get("departmentId")),
      city: String(fd.get("city") || "").trim(),
      country: String(fd.get("country") || "").trim(),
      consentContact: Boolean(fd.get("consentContact")),
      notes: String(fd.get("notes") || "").trim(),
    };
    state.alumni.push(row);
    saveToStorage(state);
    e.target.reset();
    document.getElementById("a-consent").checked = true;
    toast("Alumni saved.");
    fillSelects();
    renderAlumniTable();
    renderOverview();
    renderCareers();
    renderEvents();
  });

  document.getElementById("form-donation").addEventListener("submit", (e) => {
    e.preventDefault();
    const alumniId = Number(document.getElementById("d-alumni").value);
    const amount = Number(document.getElementById("d-amount").value);
    const currency = String(document.getElementById("d-currency").value || "USD").trim() || "USD";
    const donatedAt = document.getElementById("d-date").value;
    const campaign = String(document.getElementById("d-campaign").value || "").trim();
    if (!alumniId || !(amount > 0) || !donatedAt) return;
    state.donations.push({
      id: nextId(state.donations),
      alumniId,
      amount,
      currency,
      donatedAt,
      campaign: campaign || null,
    });
    saveToStorage(state);
    e.target.querySelector("#d-amount").value = "";
    document.getElementById("d-campaign").value = "";
    toast("Donation recorded.");
    renderDonations();
    renderOverview();
  });

  document.getElementById("btn-reset").addEventListener("click", () => {
    if (!confirm("Replace all browser data with the sample seed?")) return;
    state = cloneSeed();
    localStorage.removeItem(STORAGE_KEY);
    saveToStorage(state);
    selectedAlumniId = null;
    toast("Reset to sample data.");
    fillSelects();
    renderOverview();
    renderAlumniTable();
    renderAlumniDetail();
    renderCareers();
    renderEvents();
    renderDonations();
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById("d-date").value = today;
  });

  async function init() {
    state = await loadInitialState();
    saveToStorage(state);
    const today = new Date().toISOString().slice(0, 10);
    document.getElementById("d-date").value = today;
    document.getElementById("a-year").value = String(new Date().getFullYear() - 1);

    fillSelects();
    wireNav();
    wireAlumniTable();
    renderOverview();
    renderAlumniTable();
    renderCareers();
    renderEvents();
    renderDonations();
    showPanel("overview");
  }

  init();
})();
