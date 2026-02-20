const images = document.querySelectorAll(".gallery img");
const modal = document.getElementById("modal");
const modalImg = document.getElementById("modalImg");
const closeBtn = document.querySelector(".close");

// Open Modal
images.forEach(img => {
  img.addEventListener("click", () => {
    modal.style.display = "flex";
    modalImg.src = img.src;
    document.body.style.overflow = "hidden"; // prevent scroll
  });
});

// Close Modal (X button)
closeBtn.addEventListener("click", closeModal);

// Close on overlay click
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// ESC key support
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeModal();
  }
});

function closeModal() {
  modal.style.display = "none";
  document.body.style.overflow = "auto";
}
