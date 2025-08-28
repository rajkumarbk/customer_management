// ---------- Example datasets ----------
    const staffData = {
      "101": ["Ali","Hassan","Faisal"], "102": ["Salman","Omar","Bader"],
      "103": ["Khalid","Yousef","Faris"], "104": ["Fahad","Ahmed","Rayan"],
      "105": ["Mohammed","Ibrahim","Adel"], "106": ["Saad","Talal","Ziad"],
      "107": ["Majid","Sultan","Emad"], "108": ["Nasser","Adnan","Hatem"],
      "109": ["Bilal","Hamza","Sameer"]
    };

    // Rich KSA-focused brand/model list
    const carData = {
      "Toyota": ["Corolla","Camry","Yaris","Land Cruiser","Prado","Hilux","Hiace","RAV4","Fortuner"],
      "Nissan": ["Patrol","Altima","Sunny","X-Trail","Navara","Maxima"],
      "Hyundai": ["Elantra","Sonata","Accent","Tucson","Santa Fe","H-1"],
      "Kia": ["Cerato (Forte)","Sportage","Sorento","Rio","K5 (Optima)"],
      "Ford": ["F-150","Explorer","Expedition","Taurus","Mustang"],
      "Chevrolet": ["Tahoe","Silverado","Malibu","Suburban","Camaro"],
      "GMC": ["Sierra","Yukon","Acadia"],
      "Honda": ["Civic","Accord","CR-V","Pilot"],
      "Mercedes-Benz": ["C-Class","E-Class","S-Class","GLE","GLC"],
      "BMW": ["3 Series","5 Series","7 Series","X5","X3"]
    };

    // ---------- DOM ----------
    const branch = document.getElementById("branch");
    const workplace = document.getElementById("workplace");
    const glass = document.getElementById("glass");
    const staff = document.getElementById("staff");
    const assistant = document.getElementById("assistant");
    const brand = document.getElementById("brand");
    const model = document.getElementById("model");
    const year = document.getElementById("year");
    const plate = document.getElementById("plate");
    const start = document.getElementById("start");
    const end = document.getElementById("end");
    const customer = document.getElementById("customer");
    const mobile = document.getElementById("mobile");
    const invoice = document.getElementById("invoice");
    const photo = document.getElementById("photo");
    const photoPreview = document.getElementById("photoPreview");
    const remarks = document.getElementById("remarks");
    const pageTitle = document.getElementById("pageTitle");

    // ---------- Helpers ----------
    function setNow(input) { input.value = new Date().toISOString().slice(0,16); }

    function fillSelect(select, items, firstLabel = "Select") {
      select.innerHTML = "";
      if (firstLabel !== null) select.add(new Option(firstLabel, ""));
      items.forEach(v => select.add(new Option(v, v)));
    }

    function genYears(from = 2000, to = (new Date()).getFullYear()) {
      const arr = [];
      for (let y = to; y >= from; y--) arr.push(String(y)); // newest first
      return arr;
    }

    // ---------- Populate Brand/Model/Year ----------
    fillSelect(brand, Object.keys(carData), "Select Brand");
    brand.addEventListener("change", () => {
      const models = carData[brand.value] || [];
      fillSelect(model, models, "Select Model");
      fillSelect(year, [], "Select Year");
    });

    model.addEventListener("change", () => {
      fillSelect(year, genYears(2000), "Select Year");
    });

    // ---------- Staff by Branch ----------
    branch.addEventListener("change", () => {
      const list = staffData[branch.value] || [];
      fillSelect(staff, list, "Select Staff");
      fillSelect(assistant, list, "Select Assistant");
    });

    // ---------- Photo Preview ----------
    photo.addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const url = URL.createObjectURL(f);
      photoPreview.src = url;
      photoPreview.style.display = "block";
    });

    // ---------- Init times (only for NEW) ----------
    const editIndexRaw = localStorage.getItem("editIndex");
    const records = JSON.parse(localStorage.getItem("records") || "[]");
    let editing = (editIndexRaw !== null);
    let editIndex = editing ? parseInt(editIndexRaw, 10) : null;

    if (!editing) { setNow(start); setNow(end); }

    // ---------- Prefill on Edit ----------
    if (editing) {
      const rec = records[editIndex];
      if (!rec) { localStorage.removeItem("editIndex"); window.location.href = "index.html"; }

      pageTitle.textContent = "Edit Record";

      // Branch -> staff
      branch.value = rec.branch || "";
      branch.dispatchEvent(new Event("change"));
      staff.value = rec.staff || "";
      assistant.value = rec.assistant || "";

      workplace.value = rec.workplace || "";
      glass.value = rec.glass || "";

      // Brand -> model -> year
      brand.value = rec.brand || "";
      brand.dispatchEvent(new Event("change"));
      model.value = rec.model || "";
      model.dispatchEvent(new Event("change"));
      year.value = rec.year || "";

      // Others
      plate.value = rec.plate || "";
      start.value = rec.start || "";
      end.value   = rec.end || "";
      customer.value = rec.customer || "";
      mobile.value   = rec.mobile || "";
      invoice.value  = rec.invoice || "";
      remarks.value  = rec.remarks || "";

      if (rec.photo) {
        photoPreview.src = rec.photo;
        photoPreview.style.display = "block";
      }
    }

    // ---------- Submit ----------
    document.getElementById("recordForm").addEventListener("submit", (e) => {
      e.preventDefault();

      const payload = {
        branch: branch.value,
        workplace: workplace.value,
        staff: staff.value,
        assistant: assistant.value,
        brand: brand.value,
        model: model.value,
        year: year.value,
        plate: plate.value,
        glass: glass.value,
        start: start.value,
        customer: customer.value,
        mobile: mobile.value,
        invoice: invoice.value,
        end: end.value,
        remarks: remarks.value
      };

      // Handle photo: if new chosen, read; else keep existing (on edit)
      const finishSave = (dataUrlIfAny) => {
        if (dataUrlIfAny) payload.photo = dataUrlIfAny;
        else if (editing && records[editIndex] && records[editIndex].photo) payload.photo = records[editIndex].photo;

        if (editing) {
          records[editIndex] = payload;
          localStorage.setItem("records", JSON.stringify(records));
          localStorage.removeItem("editIndex");
          localStorage.setItem("recordUpdated", "1");
        } else {
          records.push(payload);
          localStorage.setItem("records", JSON.stringify(records));
          localStorage.setItem("recordInserted", "1");
        }
        window.location.href = "index.html";
      };

      const file = photo.files && photo.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => finishSave(ev.target.result);
        reader.readAsDataURL(file);
      } else {
        finishSave(null);
      }
    });
