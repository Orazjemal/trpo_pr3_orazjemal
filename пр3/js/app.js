(() => {
  "use strict";

  // Значения переписаны из data/dashboard.json и data/notifications.json.
  const notifications = {
    success: { type: "success", text: "Изменения сохранены" },
    warning: { type: "warning", text: "Проверьте обязательные поля" }
  };
  const statusFilter = document.getElementById("statusFilter");
  const activityRows = document.getElementById("activityRows");
  const rowCount = document.getElementById("rowCount");
  const form = document.getElementById("createForm");
  const nameInput = document.getElementById("operationName");
  const statusInput = document.getElementById("operationStatus");
  const toastElement = document.getElementById("actionToast");
  const toast = bootstrap.Toast.getOrCreateInstance(toastElement, { delay: 4200 });
  let nextId = activityRows.querySelectorAll("tr").length + 1;

  function updateVisibleRows() {
    const value = statusFilter.value;
    let visible = 0;
    activityRows.querySelectorAll("tr").forEach((row) => {
      const show = value === "all" || row.dataset.status === value;
      row.hidden = !show;
      if (show) visible += 1;
    });
    rowCount.textContent = `Показано ${visible} ${visible === 1 ? "операция" : "операций"}`;
  }

  function showNotification(kind) {
    const message = notifications[kind];
    document.getElementById("toastTitle").textContent = kind === "success" ? "Готово" : "Проверьте форму";
    document.getElementById("toastMessage").textContent = message.text;
    document.querySelector(".toast-indicator").classList.toggle("warning", kind === "warning");
    toast.show();
  }

  function validateName() {
    const valid = nameInput.value.trim().length >= 3 && nameInput.value.trim().length <= 60;
    nameInput.classList.toggle("is-valid", valid);
    nameInput.classList.toggle("is-invalid", !valid);
    nameInput.setAttribute("aria-invalid", String(!valid));
    return valid;
  }

  statusFilter.addEventListener("change", updateVisibleRows);
  nameInput.addEventListener("input", validateName);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validateName()) {
      nameInput.focus();
      showNotification("warning");
      return;
    }
    const title = nameInput.value.trim();
    const status = statusInput.value;
    const badgeClass = status === "Готово" ? "status-done" : status === "В работе" ? "status-progress" : "status-new";
    const row = document.createElement("tr");
    row.dataset.status = status;
    row.innerHTML = `<th scope="row">${nextId}</th><td></td><td><span class="status-badge ${badgeClass}"></span></td>`;
    row.cells[1].textContent = title;
    row.querySelector(".status-badge").textContent = status;
    activityRows.append(row);
    nextId += 1;
    updateVisibleRows();
    bootstrap.Modal.getOrCreateInstance(document.getElementById("createModal")).hide();
    form.reset();
    nameInput.classList.remove("is-valid", "is-invalid");
    nameInput.removeAttribute("aria-invalid");
    showNotification("success");
  });
  document.getElementById("createModal").addEventListener("hidden.bs.modal", () => {
    form.reset();
    nameInput.classList.remove("is-valid", "is-invalid");
    nameInput.removeAttribute("aria-invalid");
  });
  document.getElementById("reminderButton").addEventListener("click", () => showNotification("warning"));
  updateVisibleRows();
})();
