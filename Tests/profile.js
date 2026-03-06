
function signOut() {
  alert("You have been signed out successfully!");
  localStorage.removeItem("userId"); 
  window.location.href = "login.html"; 
}


document.addEventListener("DOMContentLoaded", () => {
  
  const userId = localStorage.getItem("userId");

  if (!userId) {
    
    window.location.href = "login.html";
    return;
  }

  
  const apiURL = `https://example.com/api/student-profile?userId=${userId}`;

  
  showMessage("Fetching your details...");

  
  fetch(apiURL)
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch data");
      return res.json();
    })
    .then(data => displayUserData(data))
    .catch(err => {
      console.error("Error fetching user data:", err);
      showMessage("Failed to load profile data ❌", "red");
    });

  
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
});