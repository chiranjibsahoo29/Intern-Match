let branchChart;
let isLoading = false;
let studLoaded = 0;

async function loadDashboard() {
    try {
    const response = await fetch("/analytics",{
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();

    const total_students = data.total_students || 0;
    const total_branches = (data.branch && data.branch.length) || 0;
    const total_batches = (data.batch && data.batch.length) || 0;
    const total_courses = (data.course && data.course.length) || 0;
    const total_colleges = (data.college && data.college.length) || 0;
    
    document.getElementById("total_students").innerText = total_students;
    document.getElementById("total_branches").innerText = total_branches;
    document.getElementById("total_colleges").innerText = total_colleges;
    document.getElementById("total_courses").innerText = total_courses;

    
    const branchData = data.branch || [];
    const labels = branchData.map(x => x.BRANCH || x.branch || "Unknown");
    const counts = branchData.map(x => x.count || 0);

    if (branchChart) branchChart.destroy();

    branchChart = new Chart(document.getElementById("branchPie"), {
        type: "pie",
        data: {
        labels,
        datasets: [{
            data: counts,
            backgroundColor: ["#4CAF50", "#42A5F5", "#FFB74D", "#E57373", "#BA68C8"],
        }]
        },
        options: {
        radius:'100%',
        plugins: {
            legend: { position: "bottom" },
            tooltip: {
            callbacks: {
                label: ctx => `${ctx.label}: ${ctx.formattedValue}`
            }
            }
        }
        }
    });
    } catch (err) {
    console.error("Dashboard load failed:", err);
    }
}

async function loadStudents() {
    if (isLoading) return;
    isLoading = true;

    try {
    const res = await fetch("/students",{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ SID: studLoaded })
    });
    const students = await res.json();
    const tbody = document.getElementById("studentBody");
    students.forEach((s, i) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${s.SL_NO || ""}</td>
        <td>${s.REGD || ""}</td>
        <td class="elide-text" title="${s.NAME || ""}">${s.NAME || ""}</td>
        <td>${s.BATCH || ""}</td>
        <td class="elide-text" title="${s.BRANCH || ""}">${s.BRANCH || ""}</td>
        <td>${s.COURSE || ""}</td>
        <td class="elide-text" title="${s.COLLEGE || ""}">${s.COLLEGE || ""}</td>
        `;
        tbody.appendChild(tr);
    });
    studLoaded+=students.length;
    } 
    catch (err) 
    {
    console.error("Error loading students:", err);
    studLoaded = 0;
    }
    finally 
    {
    isLoading = false;
    }
}


document.getElementById("scrollArea").addEventListener("scroll", (e) => {
    const area = e.target;
    if (area.scrollTop + area.clientHeight >= area.scrollHeight - 10) {
    loadStudents();
    }
});


loadDashboard();
loadStudents();
setInterval(loadDashboard, 5000);