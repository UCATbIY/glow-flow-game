"use strict";
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
const isStandalone =
  window.navigator.standalone ||
  window.matchMedia("(display-mode: standalone)").matches;
document.addEventListener("DOMContentLoaded", function () {
  const modalContent = document.getElementById("license-modal");
  const agreeCheckbox = document.getElementById("license-agree");
  const confirm = document.getElementById("license-confirm");
  if (!localStorage.getItem("license-accepted")) {
    modalContent.style.display = "flex";
    modalContent.style.opacity = "1";
  }
  agreeCheckbox.addEventListener("change", function () {
    if (this.checked) {
      confirm.disabled = false;
      confirm.style.background = "black";
      confirm.style.color = "white";
    } else {
      confirm.disabled = true;
      confirm.style.background = "darkgrey";
      confirm.style.color = "#eee";
    }
  });
  confirm.addEventListener("click", function () {
    if (agreeCheckbox.checked) {
      modalContent.style.opacity = "0";
      setTimeout(function () {
        modalContent.style.display = "none";
        document.body.style.overflow = "auto";
      }, 500);
      localStorage.setItem("license-accepted", "true");
    }
  });
});
const interactiveUI = new Audio("audio/interactiveUI.mp3");
function playinteractiveUIEffect() {
  interactiveUI.currentTime = 0;
  interactiveUI.play();
  if (navigator.vibrate) {
    navigator.vibrate(50);
  }
}
const licenseAgree = document.getElementById("license-agree");
licenseAgree.addEventListener("click", () => {
  playinteractiveUIEffect();
});
const licenseConfirm = document.getElementById("license-confirm");
licenseConfirm.addEventListener("click", () => {
  playinteractiveUIEffect();
});
const links = document.querySelectorAll(".link");
links.forEach((link) => {
  link.addEventListener("click", playinteractiveUIEffect);
});
window.addEventListener("load", () => {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("service-worker.js", { scope: "/" })
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
