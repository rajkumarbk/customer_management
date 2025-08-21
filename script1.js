// ----- State -----
    let records = JSON.parse(localStorage.getItem("records") || "[]");

    // ----- UI helpers -----
    const alertBox = document.getElementById("alertBox");
    function showAlert(type, msg, timeout = 3000) {
      alertBox.className = "alert alert-" + type;
      alertBox.textContent = msg;
      alertBox.classList.remove("d-none");
      if (timeout) setTimeout(()=> alertBox.classList.add("d-none"), timeout);
    }

    function persist() { localStorage.setItem("records", JSON.stringify(records)); }

    // ----- Render -----
    function displayRecords(list = records) {
      const body = document.getElementById("recordsBody");
      body.innerHTML = "";
      list.forEach((rec, index) => {
        body.insertAdjacentHTML("beforeend", `
          <tr>
            <td>${rec.branch || ""}</td>
            <td>${rec.workplace || ""}</td>
            <td>${rec.staff || ""}</td>
            <td>${rec.assistant || ""}</td>
            <td>${[rec.brand, rec.model, rec.year].filter(Boolean).join(" ")}</td>
            <td>${rec.plate || ""}</td>
            <td>${rec.glass || ""}</td>
            <td>${rec.start || ""}</td>
            <td>${rec.customer || ""}</td>
            <td>${rec.mobile || ""}</td>
            <td>${rec.invoice || ""}</td>
            <td>${rec.end || ""}</td>
            <td>${rec.photo ? `<img class="thumb" src="${rec.photo}" alt="">` : ""}</td>
            <td>${rec.remarks || ""}</td>
            <td>
              <div class="d-flex gap-2">
                <button class="btn btn-warning btn-sm" onclick="editRecord(${index})">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteRecord(${index})">Delete</button>
              </div>
            </td>
          </tr>
        `);
      });
    }

    // ----- Actions -----
    function deleteRecord(index) {
      if (!confirm("Delete this record?")) return;
      records.splice(index, 1);
      persist();
      displayRecords();
      showAlert("success", "Record deleted.");
    }

    function editRecord(index) {
      localStorage.setItem("editIndex", String(index));
      window.location.href = "insert.html";
    }

    // ----- Filters -----
    function applyFilters() {
      const q = (document.getElementById("searchBox").value || "").toLowerCase();
      const s = document.getElementById("filterStart").value || "";
      const e = document.getElementById("filterEnd").value || "";

      const filtered = records.filter(rec => {
        const matchesSearch = JSON.stringify(rec).toLowerCase().includes(q);
        const startDate = (rec.start || "").slice(0,10);
        const inRange =
          (!s || startDate >= s) &&
          (!e || startDate <= e);
        return matchesSearch && inRange;
      });
      displayRecords(filtered);
    }

    document.getElementById("searchBox").addEventListener("input", applyFilters);
    document.getElementById("btnFilter").addEventListener("click", applyFilters);
    document.getElementById("btnReset").addEventListener("click", () => {
      document.getElementById("filterStart").value = "";
      document.getElementById("filterEnd").value  = "";
      document.getElementById("searchBox").value  = "";
      displayRecords();
    });

    // ----- Init -----
    displayRecords();

    // Success banners coming back from insert page
    if (localStorage.getItem("recordInserted")) {
      localStorage.removeItem("recordInserted");
      showAlert("success", "1 record inserted successfully");
    }
    if (localStorage.getItem("recordUpdated")) {
      localStorage.removeItem("recordUpdated");
      showAlert("success", "Record updated successfully");
    }

    // Expose for inline handlers
    window.deleteRecord = deleteRecord;
    window.editRecord   = editRecord;