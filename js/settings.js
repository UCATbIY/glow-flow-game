"use strict";
const defaults = {
  musicVolume: 50,
  soundEffects: 50,
  vibration: 0,
  gravity: 5,
  sensitivity: 50,
  musicEnabled: 1,
  soundEnabled: 1,
};
function getSetting(key) {
  try {
    const value = localStorage.getItem(key);
    if (value === null || value === undefined) {
      localStorage.setItem(key, defaults[key].toString());
      return defaults[key];
    }
    const numValue = parseInt(value);
    return isNaN(numValue) ? defaults[key] : numValue;
  } catch (error) {
    return defaults[key];
  }
}
function saveSetting(key, value) {
  try {
    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      localStorage.setItem(key, numValue.toString());
      return true;
    }
    return false;
  } catch (error) {
    return false;
  }
}
function vibrateButton() {
  ensureVibrationManager(() => {
    if (typeof VibrationManager !== "undefined") {
      const vibrationValue = getSetting("vibration");
      if (vibrationValue > 0) {
        VibrationManager.vibrate(VibrationManager.patterns.button);
      }
    }
  });
}
document.addEventListener("DOMContentLoaded", function () {
  const settings = {
    musicVolume: getSetting("musicVolume"),
    soundEffects: getSetting("soundEffects"),
    vibration: getSetting("vibration"),
    gravity: getSetting("gravity"),
    sensitivity: getSetting("sensitivity"),
    musicEnabled: getSetting("musicEnabled"),
    soundEnabled: getSetting("soundEnabled"),
  };
  document.getElementById("music-volume").value = settings.musicVolume;
  document.getElementById(
    "music-volume-value"
  ).textContent = `${settings.musicVolume}%`;
  document.getElementById("sound-effects").value = settings.soundEffects;
  document.getElementById(
    "sound-effects-value"
  ).textContent = `${settings.soundEffects}%`;
  document.getElementById("vibration").value = settings.vibration;
  document.getElementById(
    "vibration-value"
  ).textContent = `${settings.vibration}%`;
  document.getElementById("gravity").value = settings.gravity;
  document.getElementById("gravity-value").textContent = (
    settings.gravity / 10
  ).toFixed(1);
  document.getElementById("sensitivity").value = settings.sensitivity;
  document.getElementById(
    "sensitivity-value"
  ).textContent = `${settings.sensitivity}%`;
  document
    .getElementById("music-volume")
    .addEventListener("input", function () {
      const value = this.value;
      document.getElementById("music-volume-value").textContent = `${value}%`;
      saveSetting("musicVolume", value);
    });
  document
    .getElementById("sound-effects")
    .addEventListener("input", function () {
      const value = this.value;
      document.getElementById("sound-effects-value").textContent = `${value}%`;
      saveSetting("soundEffects", value);
    });
  document.getElementById("vibration").addEventListener("input", function () {
    const value = this.value;
    document.getElementById("vibration-value").textContent = `${value}%`;
    saveSetting("vibration", value);
  });
  document.getElementById("gravity").addEventListener("input", function () {
    const value = this.value;
    document.getElementById("gravity-value").textContent = (value / 10).toFixed(
      1
    );
    saveSetting("gravity", value);
  });
  document.getElementById("sensitivity").addEventListener("input", function () {
    const value = this.value;
    document.getElementById("sensitivity-value").textContent = `${value}%`;
    saveSetting("sensitivity", value);
  });
  document.getElementById("save-btn").addEventListener("click", function () {
    const settingsToSave = {
      musicVolume: document.getElementById("music-volume").value,
      soundEffects: document.getElementById("sound-effects").value,
      vibration: document.getElementById("vibration").value,
      gravity: document.getElementById("gravity").value,
      sensitivity: document.getElementById("sensitivity").value,
    };
    for (const key in settingsToSave) {
      saveSetting(key, settingsToSave[key]);
    }
    if (typeof window.updateGameSettings === "function") {
      window.updateGameSettings();
    }
    vibrateButton();
    setTimeout(() => {
      window.history.back();
    }, 300);
  });
  document.getElementById("back-btn").addEventListener("click", function () {
    vibrateButton();
    window.history.back();
  });
  document.getElementById("default-btn").addEventListener("click", function () {
    document.getElementById("music-volume").value = defaults.musicVolume;
    document.getElementById(
      "music-volume-value"
    ).textContent = `${defaults.musicVolume}%`;
    document.getElementById("sound-effects").value = defaults.soundEffects;
    document.getElementById(
      "sound-effects-value"
    ).textContent = `${defaults.soundEffects}%`;
    document.getElementById("vibration").value = defaults.vibration;
    document.getElementById(
      "vibration-value"
    ).textContent = `${defaults.vibration}%`;
    document.getElementById("gravity").value = defaults.gravity;
    document.getElementById("gravity-value").textContent = (
      defaults.gravity / 10
    ).toFixed(1);
    document.getElementById("sensitivity").value = defaults.sensitivity;
    document.getElementById(
      "sensitivity-value"
    ).textContent = `${defaults.sensitivity}%`;
    for (const key in defaults) {
      saveSetting(key, defaults[key]);
    }
    if (typeof window.updateGameSettings === "function") {
      window.updateGameSettings();
    }
    vibrateButton();
  });
});
