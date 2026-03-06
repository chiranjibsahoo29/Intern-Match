fetch("internship_bput.csv")
  .then(res => res.text())
  .then(text => {
    const data = parseCSV(text);
    populateForm(data);
  });

// Improved CSV parser that handles quoted fields
function parseCSV(str) {
  const lines = str.trim().split("\n");
  const rows = [];
  
  lines.forEach(line => {
    const row = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    rows.push(row);
  });
  
  const headers = rows[0].map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
  const records = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = row[i] ? row[i].trim().replace(/^["']|["']$/g, '') : "";
    });
    return obj;
  });
  
  return { headers, records };
}

// Helper to find closest matching column name
function findClosestColumn(target, headers) {
  const clean = text => text.replace(/[^a-z]/gi, "").toLowerCase();
  const cleanedTarget = clean(target);
  
  // First try exact match
  const exactMatch = headers.find(h => clean(h) === cleanedTarget);
  if (exactMatch) return exactMatch;
  
  // Then try contains match
  const containsMatch = headers.find(h => clean(h).includes(cleanedTarget) || cleanedTarget.includes(clean(h)));
  if (containsMatch) return containsMatch;
  
  // Finally try levenshtein distance
  let bestMatch = null, bestScore = Infinity;
  headers.forEach(h => {
    const cleanedHeader = clean(h);
    const dist = levenshtein(cleanedTarget, cleanedHeader);
    if (dist < bestScore) {
      bestScore = dist;
      bestMatch = h;
    }
  });

  return bestScore <= 4 ? bestMatch : null;
}

// Levenshtein distance
function levenshtein(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i-1] === a[j-1]
        ? matrix[i-1][j-1]
        : Math.min(
            matrix[i-1][j-1] + 1,
            matrix[i][j-1] + 1,
            matrix[i-1][j] + 1
          );
    }
  }
  return matrix[b.length][a.length];
}

function populateForm({ headers, records }) {
  const expectedCols = ["branch", "course", "interests", "skills", "projects", "certifications"];
  
  // These columns should split comma-separated values
  const splitColumns = ["interests", "skills", "projects", "certifications"];
  
  const columnMap = {};

  // Find best matching headers
  expectedCols.forEach(col => {
    columnMap[col] = findClosestColumn(col, headers);
  });

  const uniqueValues = {};
  expectedCols.forEach(col => {
    const header = columnMap[col];
    if (header) {
      const allValues = [];
      
      records.forEach(record => {
        const value = record[header];
        if (value && value !== "") {
          // Split by comma if this is a split column
          if (splitColumns.includes(col)) {
            const splitValues = value.split(',').map(v => v.trim()).filter(v => v !== "");
            allValues.push(...splitValues);
          } else {
            allValues.push(value);
          }
        }
      });
      
      uniqueValues[col] = [...new Set(allValues)].sort();
    } else {
      uniqueValues[col] = [];
    }
  });
  // Fill dropdowns
  expectedCols.forEach(col => {
    const select = document.getElementById(col);
    select.innerHTML = "<option value=''>--Select--</option>";
    uniqueValues[col].forEach(val => {
      const opt = document.createElement("option");
      opt.value = val;
      opt.textContent = val;
      select.appendChild(opt);
    });
  });

  document.getElementById("formContainer").style.display = "block";
}

async function submitForm() {
  const fields = ["branch", "course", "interests", "skills", "projects", "certifications"];
  const data = {};
  fields.forEach(f => data[f] = document.getElementById(f).value);
  try
  {

    const res = await fetch("/internship",{
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data, null, 2)
      });

      document.getElementById("suggested-internship").textContent = `Your suggested internship is ${res.data}`;
  }
  catch(err)
  {
    alert("Failed to load data");
  }
  
  alert("Form Submitted Successfully!\n\n" + JSON.stringify(data, null, 2));
}
