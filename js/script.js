"use strict";
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
const isStandalone =
  window.navigator.standalone ||
  window.matchMedia("(display-mode: standalone)").matches;
window.addEventListener("load", () => {
  const title = document.getElementById("title");
  "GLOW FLOW".split("").forEach((letter, i) => {
    const span = document.createElement("span");
    span.textContent = letter === " " ? "" : letter;
    span.style.animationDelay = `${i * 0.1}s`;
    title.appendChild(span);
  });
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/service-worker.js");
  }
  if (isMobile && !isStandalone) {
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const licenseModal = document.getElementById("license-modal");
  const agreeCheckbox = document.getElementById("license-agree");
  const confirmBtn = document.getElementById("license-confirm");
  if (!localStorage.getItem("license-accepted")) {
    setTimeout(function () {
      licenseModal.style.display = "block";
      document.body.style.overflow = "hidden";
      licenseModal.style.opacity = "0";
      licenseModal.style.transition = "opacity 0.5s ease";
      setTimeout(() => {
        licenseModal.style.opacity = "1";
      }, 100);
    }, 1000);
  }
  agreeCheckbox.addEventListener("change", function () {
    if (this.checked) {
      confirmBtn.disabled = false;
      confirmBtn.style.background = "var(--cyan-color)";
      confirmBtn.style.color = "black";
      confirmBtn.style.cursor = "pointer";
      confirmBtn.style.boxShadow = "0 0 15px var(--cyan-color)";
    } else {
      confirmBtn.disabled = true;
      confirmBtn.style.background = "#555";
      confirmBtn.style.color = "#999";
      confirmBtn.style.cursor = "not-allowed";
      confirmBtn.style.boxShadow = "none";
    }
  });
  confirmBtn.addEventListener("click", function () {
    if (agreeCheckbox.checked) {
      licenseModal.style.opacity = "0";
      setTimeout(function () {
        licenseModal.style.display = "none";
        document.body.style.overflow = "auto";
      }, 500);
      localStorage.setItem("license-accepted", "true");
      ensureVibrationManager(() => {
        if (typeof VibrationManager !== "undefined") {
          VibrationManager.vibrate(VibrationManager.patterns.button);
        }
      });
    }
  });
  licenseModal.addEventListener("click", function (e) {
    if (e.target === licenseModal) {
      licenseModal.style.opacity = "0";
      setTimeout(function () {
        licenseModal.style.display = "none";
        document.body.style.overflow = "auto";
      }, 500);
    }
  });
});
document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll(
    ".btn, .telegram-icon, .back-btn, .modal-btn"
  );
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      ensureVibrationManager(() => {
        if (typeof VibrationManager !== "undefined") {
          VibrationManager.vibrate(VibrationManager.patterns.button);
        }
      });
    });
  });
});
