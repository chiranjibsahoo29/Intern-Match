
function signOut() 
{
  alert("You have been signed out successfully!");
  sessionStorage.removeItem("ID"); 
  window.location.href = "/"; 
}
  
showMessage("Fetching your details...");

async function getStudentDetails()
{
    try 
    {
        const id = sessionStorage.getItem("ID");
        const res = await fetch("/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id})
        });
        const data = await res.json();
        displayUserData(data);
    } 
    catch (error) 
    {
        showMessage("Failed to load profile data ❌", "red");
    }
}


function displayUserData(data) {
    const userInfo = document.getElementById("userInfo");
    userInfo.innerHTML = `
        <p><strong>Name:</strong> ${data.name || "N/A"}</p>
        <p><strong>Branch:</strong> ${data.branch || "N/A"}</p>
        <p><strong>Course:</strong> ${data.course || "N/A"}</p>
        <p><strong>Batch:</strong> ${data.batch || "N/A"}</p>
        <p><strong>College:</strong> ${data.college || "N/A"}</p>
    `;
}


function showMessage(msg, color = "gray") {
    const userInfo = document.getElementById("userInfo");
    userInfo.innerHTML = `<p style="color:${color};">${msg}</p>`;
}

//Call API Requests
getStudentDetails();