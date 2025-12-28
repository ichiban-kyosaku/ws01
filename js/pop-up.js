// Pop-up Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("popupModal");
    const closeBtn = document.querySelector(".popup-close");
  
    // Show the modal on page load
    modal.style.display = "block";
  
    // Close the modal when clicking on the close button
    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });
  
    // Close the modal when pressing the Escape key
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        modal.style.display = "none";
      }
    });
  });
  