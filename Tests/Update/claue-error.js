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
  
  const exactMatch = headers.find(h => clean(h) === cleanedTarget);
  if (exactMatch) return exactMatch;
  
  const containsMatch = headers.find(h => clean(h).includes(cleanedTarget) || cleanedTarget.includes(clean(h)));
  if (containsMatch) return containsMatch;
  
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

// Store CSV data globally
let csvData = null;

function populateForm({ headers, records }) {
  csvData = { headers, records }; // Store for later use
  
  const expectedCols = ["branch", "course", "interests", "skills", "projects", "certifications"];
  const splitColumns = ["interests", "skills", "projects", "certifications"];
  
  const columnMap = {};
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

// Simple matching algorithm for internship recommendation
function findMatchingInternship(userInput) {
  if (!csvData) return "Unable to find match";
  
  const { records } = csvData;
  let bestMatch = null;
  let bestScore = 0;
  
  records.forEach(record => {
    let score = 0;
    
    // Check each field for matches
    if (userInput.branch && record.branch && 
        record.branch.toLowerCase().includes(userInput.branch.toLowerCase())) {
      score += 2;
    }
    
    if (userInput.interests && record.interests && 
        record.interests.toLowerCase().includes(userInput.interests.toLowerCase())) {
      score += 3;
    }
    
    if (userInput.skills && record.skills && 
        record.skills.toLowerCase().includes(userInput.skills.toLowerCase())) {
      score += 3;
    }
    
    if (userInput.projects && record.projects && 
        record.projects.toLowerCase().includes(userInput.projects.toLowerCase())) {
      score += 2;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestMatch = record;
    }
  });
  
  // Create a recommendation based on the best match
  if (bestMatch && bestScore > 0) {
    return `Based on your profile, we recommend internships in: ${bestMatch.interests || userInput.interests}`;
  }
  
  return `Internship recommendation for ${userInput.branch} student interested in ${userInput.interests}`;
}

async function submitForm() {
  const fields = ["branch", "course", "interests", "skills", "projects", "certifications"];
  const data = {};
  
  // Collect form data
  fields.forEach(f => {
    data[f] = document.getElementById(f).value;
  });
  
  // Validate that at least some fields are filled
  if (!data.branch && !data.interests) {
    alert("Please select at least Branch and Interests");
    return;
  }
  
  try {
    // Generate recommendation locally
    const recommendation = findMatchingInternship(data);
    
    // Display the recommendation
    const suggestionElement = document.getElementById("suggested-internship");
    if (suggestionElement) {
      suggestionElement.textContent = recommendation;
    }
    
    // Show success message
    alert("Form Submitted Successfully!\n\n" + JSON.stringify(data, null, 2));
    
  } catch(err) {
    console.error("Error:", err);
    alert("An error occurred: " + err.message);
  }
}