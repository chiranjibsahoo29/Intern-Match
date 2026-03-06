//All Login Dependent Features Protection
document.getElementById("dashboardLink").addEventListener("click", function (event) {
  event.preventDefault(); 
  const isLoggedIn = sessionStorage.getItem("ID");
  console.log(isLoggedIn);
  if (isLoggedIn) 
  {
    window.location.href = "/dashboard";
  } 
  else 
  {
    window.location.href = "/user_login";
  }
});

document.getElementById("subscriptionLink").addEventListener("click", function (event) {
  event.preventDefault(); 
  const isLoggedIn = sessionStorage.getItem("ID");
  console.log(isLoggedIn);
  if (isLoggedIn) 
  {
    window.location.href = "/subscription";
  } 
  else 
  {
    window.location.href = "/user_login";
  }
});

document.getElementById("jobLink").addEventListener("click", function (event) {
  event.preventDefault(); 
  const isLoggedIn = sessionStorage.getItem("ID");
  console.log(isLoggedIn);
  if (isLoggedIn) 
  {
    window.location.href = "/find-job";
  } 
  else 
  {
    window.location.href = "/user_login";
  }
});

document.getElementById("internshipLink").addEventListener("click", function (event) {
  event.preventDefault(); 
  const isLoggedIn = sessionStorage.getItem("ID");
  console.log(isLoggedIn);
  if (isLoggedIn) 
  {
    window.location.href = "/find-internship";
  } 
  else 
  {
    window.location.href = "/user_login";
  }
});

document.getElementById("profileLink").addEventListener("click", function (event) {
  event.preventDefault(); 
  const isLoggedIn = sessionStorage.getItem("ID");
  console.log(isLoggedIn);
  if (isLoggedIn) 
  {
    window.location.href = "/user_profile";
  } 
  else 
  {
    window.location.href = "/user_login";
  }
});