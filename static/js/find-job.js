// fetch("static/data/job_data.csv")
//   .then(res => res.text())
//   .then(text => {
//     const data = parseCSV(text);
//     populateForm(data);
//   });

// // Improved CSV parser that handles quoted fields
// function parseCSV(str) {
//   const lines = str.trim().split("\n");
//   const rows = [];
  
//   lines.forEach(line => {
//     const row = [];
//     let current = '';
//     let inQuotes = false;
    
//     for (let i = 0; i < line.length; i++) {
//       const char = line[i];
      
//       if (char === '"') {
//         inQuotes = !inQuotes;
//       } else if (char === ',' && !inQuotes) {
//         row.push(current.trim());
//         current = '';
//       } else {
//         current += char;
//       }
//     }
//     row.push(current.trim());
//     rows.push(row);
//   });
  
//   const headers = rows[0].map(h => h.trim().toLowerCase().replace(/['"]/g, ''));
//   const records = rows.slice(1).map(row => {
//     const obj = {};
//     headers.forEach((h, i) => {
//       obj[h] = row[i] ? row[i].trim().replace(/^["']|["']$/g, '') : "";
//     });
//     return obj;
//   });
  
//   return { headers, records };
// }

// // Helper to find closest matching column name
// function findClosestColumn(target, headers) {
//   const clean = text => text.replace(/[^a-z]/gi, "").toLowerCase();
//   const cleanedTarget = clean(target);
  
//   // First try exact match
//   const exactMatch = headers.find(h => clean(h) === cleanedTarget);
//   if (exactMatch) return exactMatch;
  
//   // Then try contains match
//   const containsMatch = headers.find(h => clean(h).includes(cleanedTarget) || cleanedTarget.includes(clean(h)));
//   if (containsMatch) return containsMatch;
  
//   // Finally try levenshtein distance
//   let bestMatch = null, bestScore = Infinity;
//   headers.forEach(h => {
//     const cleanedHeader = clean(h);
//     const dist = levenshtein(cleanedTarget, cleanedHeader);
//     if (dist < bestScore) {
//       bestScore = dist;
//       bestMatch = h;
//     }
//   });

//   return bestScore <= 4 ? bestMatch : null;
// }

// // Levenshtein distance
// function levenshtein(a, b) {
//   const matrix = [];
//   for (let i = 0; i <= b.length; i++) matrix[i] = [i];
//   for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
//   for (let i = 1; i <= b.length; i++) {
//     for (let j = 1; j <= a.length; j++) {
//       matrix[i][j] = b[i-1] === a[j-1]
//         ? matrix[i-1][j-1]
//         : Math.min(
//             matrix[i-1][j-1] + 1,
//             matrix[i][j-1] + 1,
//             matrix[i-1][j] + 1
//           );
//     }
//   }
//   return matrix[b.length][a.length];
// }

// function populateForm({ headers, records }) {
//   const expectedCols = ["branch", "course", "interests", "skills", "projects", "certifications"];
  
//   // These columns should split comma-separated values
//   const splitColumns = ["interests", "skills", "projects", "certifications"];
  
//   const columnMap = {};

//   // Find best matching headers
//   expectedCols.forEach(col => {
//     columnMap[col] = findClosestColumn(col, headers);
//   });

//   const uniqueValues = {};
//   expectedCols.forEach(col => {
//     const header = columnMap[col];
//     if (header) {
//       const allValues = [];
      
//       records.forEach(record => {
//         const value = record[header];
//         if (value && value !== "") {
//           // Split by comma if this is a split column
//           if (splitColumns.includes(col)) {
//             const splitValues = value.split(',').map(v => v.trim()).filter(v => v !== "");
//             allValues.push(...splitValues);
//           } else {
//             allValues.push(value);
//           }
//         }
//       });
      
//       uniqueValues[col] = [...new Set(allValues)].sort();
//     } else {
//       uniqueValues[col] = [];
//     }
//   });
//   // Fill dropdowns
//   expectedCols.forEach(col => {
//     const select = document.getElementById(col);
//     select.innerHTML = "<option value=''>--Select--</option>";
//     uniqueValues[col].forEach(val => {
//       const opt = document.createElement("option");
//       opt.value = val;
//       opt.textContent = val;
//       select.appendChild(opt);
//     });
//   });

//   document.getElementById("formContainer").style.display = "block";
// }

// async function submitForm() {
//   const fields = ["branch", "course", "interests", "skills", "projects", "certifications"];
//   const data = {};
//   fields.forEach(f => data[f] = document.getElementById(f).value);
//   try
//   {

//     const res = await fetch("/job",{
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(data, null, 2)
//       });

//       document.getElementById("suggested-job").textContent = `Your suggested job is ${res.data}`;
//   }
//   catch(err)
//   {
//     alert("Failed to load data");
//   }
  
//   alert("Form Submitted Successfully!\n\n" + JSON.stringify(data, null, 2));
// }

fetch("static/data/job_data.csv")
      .then(res => res.text())
      .then(text => {
        const data = parseCSV(text);
        populateForm(data);
      });

    
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

    
    function findClosestColumn(target, headers) {
      const clean = text => text.replace(/[^a-z]/gi, "").toLowerCase();
      const cleanedTarget = clean(target);

      const exactMatch = headers.find(h => clean(h) === cleanedTarget);
      if (exactMatch) return exactMatch;

      const containsMatch = headers.find(h =>
        clean(h).includes(cleanedTarget) || cleanedTarget.includes(clean(h))
      );
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

    
    function levenshtein(a, b) {
      const matrix = [];
      for (let i = 0; i <= b.length; i++) matrix[i] = [i];
      for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
      for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
          matrix[i][j] = b[i - 1] === a[j - 1]
            ? matrix[i - 1][j - 1]
            : Math.min(
              matrix[i - 1][j - 1] + 1,
              matrix[i][j - 1] + 1,
              matrix[i - 1][j] + 1
            );
        }
      }
      return matrix[b.length][a.length];
    }

    let csvData = null;

    
    function populateForm({ headers, records }) {
      csvData = { headers, records };

      const expectedCols = ["course", "branch","cgpa","interests", "skills", "projects", "certifications"];
      const splitColumns = ["interests", "skills", "projects", "certifications"];

      const columnMap = {};
      expectedCols.forEach(col => {
        columnMap[col] = findClosestColumn(col, headers);
      });

      const courseHeader = columnMap["course"];
      const uniqueCourses = [...new Set(records.map(r => r[courseHeader]))].sort();

      const courseSelect = document.getElementById("course");
      courseSelect.innerHTML = "<option value=''>--Select Course--</option>";
      uniqueCourses.forEach(course => {
        const opt = document.createElement("option");
        opt.value = course;
        opt.textContent = course;
        courseSelect.appendChild(opt);
      });

      // Disable other fields initially
      expectedCols.forEach(col => {
        if (col !== "course") {
          const select = document.getElementById(col);
          select.innerHTML = "<option value=''>--Select--</option>";
          select.disabled = true;
        }
      });

      
      courseSelect.addEventListener("change", () => {
        const selectedCourse = courseSelect.value;
        if (!selectedCourse) return;

        const filteredRecords = records.filter(r => r[courseHeader] === selectedCourse);

        expectedCols.forEach(col => {
          if (col === "course") return;

          const header = columnMap[col];
          const select = document.getElementById(col);
          const allValues = [];

          filteredRecords.forEach(record => {
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

          const uniqueValues = [...new Set(allValues)].sort();
          select.innerHTML = "<option value=''>--Select--</option>";
          uniqueValues.forEach(val => {
            const opt = document.createElement("option");
            opt.value = val;
            opt.textContent = val;
            select.appendChild(opt);
          });

          select.disabled = false;
        });
      });

      document.getElementById("formContainer").style.display = "block";
    }

   
    function findMatchingInternship(userInput) {
      if (!csvData) return "Unable to find match";

      const { records } = csvData;
      let bestMatch = null;
      let bestScore = 0;

      records.forEach(record => {
        let score = 0;

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

      if (bestMatch && bestScore > 0) {
        return `Based on your profile, we recommend internships in: ${bestMatch.interests || userInput.interests}`;
      }

      return `Internship recommendation for ${userInput.branch || "your branch"} student interested in ${userInput.interests || "your field"}`;
    }

    
    async function submitForm() {
      const fields = ["course", "branch", "cgpa","interests", "skills", "projects", "certifications"];
      const data = {};

      fields.forEach(f => {
        data[f] = document.getElementById(f).value;
      });
      if (!data.course || !data.branch || !data.interests) {
        alert("Please select at least Course, Branch and Interests");
        return;
      }
      try
      {
          const res = await fetch("/job",{
            method:"POST",
            headers: {"Content-Type" : "application/json"},
            body:JSON.stringify(data,null,2)
          });
          const predicted_json = await res.json();
          console.log(predicted_json);
          // console.log(predicted_json.data);
          document.getElementById("suggested-role").textContent = `Your suggested job is ${predicted_json.data}`;
      }
      catch(err)
      {
        alert("Failed to load data");
      }
    }