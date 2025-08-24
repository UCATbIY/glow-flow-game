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
    span.style.animationDelay = `${i * 0.25}s`;
    title.appendChild(span);
  });
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js", { scope: "/" })
      .then((registration) => {
        console.log("SW registered with scope:", registration.scope);

        if (navigator.serviceWorker.controller) {
          console.log("Service Worker is controlling the page");
        } else {
          console.log("Service Worker not controlling the page yet");
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "activated") {
                console.log("New Service Worker activated, reloading...");
                window.location.reload();
              }
            });
          });
        }
      })
      .catch((registrationError) => {
        console.log("SW registration failed:", registrationError);
      });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  const modalContent = document.getElementById("license-modal");
  const agreeCheckbox = document.getElementById("license-agree");
  const confirmBtn = document.getElementById("license-confirm");
  if (!localStorage.getItem("license-accepted")) {
    setTimeout(function () {
      modalContent.style.display = "flex";
      modalContent.style.opacity = "0";
      modalContent.style.transition = "opacity 0.5s ease";
      setTimeout(() => {
        modalContent.style.opacity = "1";
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
      modalContent.style.opacity = "0";
      setTimeout(function () {
        modalContent.style.display = "none";
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


