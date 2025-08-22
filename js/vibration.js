"use strict";
class VibrationManager {
  static vibrate(duration = 15, pattern = null) {
    try {
      if (!this.isVibrationSupported()) {
        return false;
      }
      let vibrationValue = 50;
      try {
        const value = localStorage.getItem("vibration");
        vibrationValue = value !== null ? parseInt(value) : 50;
        if (isNaN(vibrationValue)) vibrationValue = 50;
      } catch (error) {
        vibrationValue = 50;
      }
      if (vibrationValue <= 0) {
        return false;
      }
      if (document.visibilityState !== "visible") {
        return false;
      }
      let vibrationPattern;
      if (pattern && Array.isArray(pattern)) {
        vibrationPattern = pattern.map((ms) => {
          const adjustedMs = ms * (vibrationValue / 100);
          return Math.max(adjustedMs, 10);
        });
      } else {
        vibrationPattern = Math.max(duration * (vibrationValue / 100), 10);
      }
      const result = navigator.vibrate(vibrationPattern);
      if (!result) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
  static isVibrationSupported() {
    try {
      return (
        "vibrate" in navigator &&
        typeof navigator.vibrate === "function" &&
        !this.isDesktopDevice()
      );
    } catch (error) {
      return false;
    }
  }
  static isDesktopDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    return !/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );
  }
  static patterns = {
    button: [50],
    collision: [50],
    explosion: [70, 100, 70],
    score: [40, 80, 40],
    gameOver: [100, 150, 100, 150, 100],
    menu: [40],
    error: [100, 50, 100],
  };
}
window.ensureVibrationManager = function (callback) {
  try {
    if (!("vibrate" in navigator)) {
      if (callback) callback();
      return;
    }
    if (typeof VibrationManager !== "undefined") {
      if (callback) callback();
      return;
    }
    const existingScript = document.querySelector(
      'script[src*="vibration.js"]'
    );
    if (existingScript) {
      const onLoad = function () {
        if (callback) setTimeout(callback, 100);
      };
      if (existingScript.complete || existingScript.readyState === "complete") {
        onLoad();
      } else {
        existingScript.addEventListener("load", onLoad);
        existingScript.addEventListener("error", () => {
          if (callback) callback();
        });
      }
      return;
    }
    const basePath = getBasePath();
    const scriptPath = `${basePath}/js/vibration.js`;
    const script = document.createElement("script");
    script.src = scriptPath;
    script.onload = function () {
      if (callback) setTimeout(callback, 100);
    };
    script.onerror = function (error) {
      if (callback) callback();
    };
    document.head.appendChild(script);
  } catch (error) {
    if (callback) callback();
  }
};
function getBasePath() {
  const scripts = document.getElementsByTagName("script");
  for (let i = 0; i < scripts.length; i++) {
    if (scripts[i].src && scripts[i].src.includes("vibration.js")) {
      const url = new URL(scripts[i].src);
      return url.pathname.replace("/js/vibration.js", "");
    }
  }
  const path = window.location.pathname;
  if (path.includes("/html/")) {
    return "..";
  }
  return ".";
}
