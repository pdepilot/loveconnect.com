// Enhanced Signup page functionality with advanced facial verification
document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const progressSteps = document.querySelector(".progress-steps");
  const progressBar = document.createElement("div");
  progressBar.className = "progress-bar";
  progressSteps.appendChild(progressBar);

  const steps = document.querySelectorAll(".step");
  const authSteps = document.querySelectorAll(".auth-step");
  const phoneVerificationForm = document.getElementById(
    "phoneVerificationForm"
  );
  const codeVerificationForm = document.getElementById("codeVerificationForm");
  const registerForm = document.getElementById("registerForm");
  const sendCodeBtn = document.getElementById("sendCodeBtn");
  const verifyCodeBtn = document.getElementById("verifyCodeBtn");
  const createAccountBtn = document.getElementById("createAccountBtn");
  const phoneNumberDisplay = document.getElementById("phoneNumberDisplay");
  const changeNumberLink = document.getElementById("changeNumber");
  const resendCodeLink = document.getElementById("resendCode");
  const countdownElement = document.getElementById("countdown");
  const codeInputs = document.querySelectorAll(".code-input");
  const verificationCodeInput = document.getElementById("verificationCode");

  // Form elements
  const ageSlider = document.getElementById("age");
  const ageDisplay = document.getElementById("ageDisplay");
  const passwordInput = document.getElementById("registerPassword");
  const strengthFill = document.getElementById("strengthFill");
  const strengthText = document.getElementById("strengthText");

  // Enhanced Biometric verification elements
  const verificationModal = document.getElementById("verificationModal");
  const cancelVerification = document.getElementById("cancelVerification");
  const verifyIdentity = document.getElementById("verifyIdentity");
  const videoElement = document.getElementById("videoElement");
  const canvasElement = document.getElementById("canvasElement");
  const faceCanvas = document.getElementById("faceCanvas");
  const capturedImage = document.getElementById("capturedImage");
  const cameraOverlay = document.getElementById("cameraOverlay");
  const countdownText = document.getElementById("countdownText");
  const faceStatus = document.getElementById("faceStatus");
  const statusText = document.getElementById("statusText");
  const faceInstructions = document.getElementById("faceInstructions");
  const faceActions = document.getElementById("faceActions");
  const retakePhoto = document.getElementById("retakePhoto");
  const usePhoto = document.getElementById("usePhoto");
  const verificationActions = document.getElementById("verificationActions");

  // New elements for enhanced verification
  const brightnessLevel = document.getElementById("brightnessLevel");
  const brightnessText = document.getElementById("brightnessText");
  const faceCount = document.getElementById("faceCount");
  const brightnessWarning = document.getElementById("brightnessWarning");
  const multipleFacesWarning = document.getElementById("multipleFacesWarning");

  // State
  let currentStep = 1;
  let verificationCode = "";
  let userPhoneNumber = "";
  let countdownInterval;
  let countdownTime = 60;

  // Enhanced Biometric verification state
  let stream = null;
  let faceDetectionInterval = null;
  let isFaceDetected = false;
  let isCapturing = false;
  let captured = false;
  let faceDetectionAttempts = 0;
  let currentBrightness = 0;
  let detectedFaces = 0;
  let conditionsMet = false;

  // Initialize
  updateProgressBar();
  setupCodeInputs();

  // Step Navigation
  function goToStep(step) {
    console.log("Navigating to step:", step);

    // Hide all steps
    authSteps.forEach((step) => step.classList.remove("active"));
    steps.forEach((step) => step.classList.remove("active"));

    // Show current step
    const targetStep = document.getElementById(`step${step}`);
    if (targetStep) {
      targetStep.classList.add("active");
      console.log("Step activated:", targetStep.id);
    } else {
      console.error("Target step not found:", `step${step}`);
    }

    // Update progress steps
    steps.forEach((s, index) => {
      if (index + 1 <= step) {
        s.classList.add("active");
      }
    });

    currentStep = step;
    updateProgressBar();
  }

  function updateProgressBar() {
    const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // Code Input Handling
  function setupCodeInputs() {
    codeInputs.forEach((input, index) => {
      input.addEventListener("input", (e) => {
        const value = e.target.value;

        // Only allow numbers
        if (!/^\d*$/.test(value)) {
          input.value = value.replace(/\D/g, "");
          return;
        }

        if (input.value.length === 1) {
          input.classList.add("filled");

          // Auto-focus next input
          if (index < codeInputs.length - 1) {
            codeInputs[index + 1].focus();
          }
        } else {
          input.classList.remove("filled");
        }

        updateVerificationCode();
      });

      input.addEventListener("keydown", (e) => {
        if (e.key === "Backspace" && !e.target.value && index > 0) {
          codeInputs[index - 1].focus();
          codeInputs[index - 1].value = "";
          codeInputs[index - 1].classList.remove("filled");
        }
      });

      input.addEventListener("paste", (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData
          .getData("text")
          .replace(/\D/g, "")
          .slice(0, 6);
        pasteData.split("").forEach((char, i) => {
          if (codeInputs[i]) {
            codeInputs[i].value = char;
            codeInputs[i].classList.add("filled");
          }
        });
        updateVerificationCode();
        codeInputs[Math.min(pasteData.length - 1, 5)].focus();
      });
    });
  }

  function updateVerificationCode() {
    verificationCode = Array.from(codeInputs)
      .map((input) => input.value)
      .join("");
    verificationCodeInput.value = verificationCode;
    console.log("Verification code updated:", verificationCode);
  }

  // Countdown Timer
  function startCountdown() {
    countdownTime = 60;
    countdownElement.textContent = formatTime(countdownTime);
    countdownElement.style.display = "block";
    resendCodeLink.style.pointerEvents = "none";
    resendCodeLink.style.opacity = "0.5";

    if (countdownInterval) {
      clearInterval(countdownInterval);
    }

    countdownInterval = setInterval(() => {
      countdownTime--;
      countdownElement.textContent = formatTime(countdownTime);

      if (countdownTime <= 0) {
        clearInterval(countdownInterval);
        resendCodeLink.style.pointerEvents = "auto";
        resendCodeLink.style.opacity = "1";
        countdownElement.style.display = "none";
      }
    }, 1000);
  }

  function formatTime(seconds) {
    return `00:${seconds.toString().padStart(2, "0")}`;
  }

  // Password Strength
  passwordInput.addEventListener("input", function () {
    const password = this.value;
    const strength = calculatePasswordStrength(password);

    strengthFill.style.width = `${strength.percentage}%`;
    strengthFill.style.background = strength.color;
    strengthText.textContent = strength.text;
    strengthText.style.color = strength.color;
  });

  function calculatePasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (password.match(/[a-z]/)) score++;
    if (password.match(/[A-Z]/)) score++;
    if (password.match(/[0-9]/)) score++;
    if (password.match(/[^a-zA-Z0-9]/)) score++;

    const percentage = (score / 5) * 100;

    if (score <= 2) return { percentage, color: "#dc3545", text: "Weak" };
    if (score <= 3) return { percentage, color: "#ffc107", text: "Medium" };
    if (score <= 4) return { percentage, color: "#28a745", text: "Strong" };
    return { percentage, color: "#20c997", text: "Very Strong" };
  }

  // Button Loading States
  function setButtonLoading(button, isLoading) {
    const btnText = button.querySelector(".btn-text");
    const btnLoader = button.querySelector(".btn-loader");

    if (isLoading) {
      btnText.style.display = "none";
      btnLoader.style.display = "flex";
      button.disabled = true;
    } else {
      btnText.style.display = "block";
      btnLoader.style.display = "none";
      button.disabled = false;
    }
  }

  // Form Submissions
  phoneVerificationForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("Phone verification form submitted");

    const countryCode = document.getElementById("countryCode").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    userPhoneNumber = `${countryCode}${phoneNumber}`;

    console.log("Phone number:", userPhoneNumber);

    if (!phoneNumber) {
      showError("Please enter your phone number");
      return;
    }

    setButtonLoading(sendCodeBtn, true);

    // Simulate API call to send verification code
    try {
      console.log("Sending verification code...");
      await sendVerificationCode(userPhoneNumber);
      phoneNumberDisplay.textContent = userPhoneNumber;
      goToStep(2);
      startCountdown();
      showSuccess("Verification code sent successfully! Demo code: 123456");
    } catch (error) {
      console.error("Error sending code:", error);
      showError("Failed to send verification code. Please try again.");
    } finally {
      setButtonLoading(sendCodeBtn, false);
    }
  });

  codeVerificationForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("Code verification form submitted");
    console.log("Entered code:", verificationCode);

    if (verificationCode.length !== 6) {
      showError("Please enter the 6-digit verification code");
      return;
    }

    setButtonLoading(verifyCodeBtn, true);

    // Simulate API call to verify code
    try {
      console.log("Verifying code...");
      await verifyCode(userPhoneNumber, verificationCode);
      goToStep(3);
      showSuccess("Phone number verified successfully!");
    } catch (error) {
      console.error("Error verifying code:", error);
      showError(
        "Invalid verification code. Please try again. Demo code: 123456"
      );
    } finally {
      setButtonLoading(verifyCodeBtn, false);
    }
  });

  registerForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    console.log("Registration form submitted");

    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      showError("Passwords do not match!");
      return;
    }

    setButtonLoading(createAccountBtn, true);

    // Collect form data
    const formData = {
      fullName: document.getElementById("fullName").value,
      email: document.getElementById("registerEmail").value,
      age: document.getElementById("age").value,
      password: password,
      phoneNumber: userPhoneNumber,
    };

    console.log("Form data:", formData);

    // Simulate API call to create account
    try {
      await createAccount(formData);
      showVerificationModal();
    } catch (error) {
      console.error("Error creating account:", error);
      showError("Failed to create account. Please try again.");
    } finally {
      setButtonLoading(createAccountBtn, false);
    }
  });

  // Event Listeners
  changeNumberLink.addEventListener("click", function (e) {
    e.preventDefault();
    goToStep(1);
  });

  resendCodeLink.addEventListener("click", function (e) {
    e.preventDefault();

    if (countdownTime > 0) return;

    setButtonLoading(sendCodeBtn, true);

    // Resend verification code
    sendVerificationCode(userPhoneNumber)
      .then(() => {
        showSuccess("Verification code resent! Demo code: 123456");
        startCountdown();
        countdownElement.style.display = "block";
      })
      .catch((error) => {
        console.error("Error resending code:", error);
        showError("Failed to resend code. Please try again.");
      })
      .finally(() => {
        setButtonLoading(sendCodeBtn, false);
      });
  });

  ageSlider.addEventListener("input", function () {
    ageDisplay.textContent = this.value;
  });

  // Simulated API Functions
  async function sendVerificationCode(phoneNumber) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random failure (10% chance)
        if (Math.random() < 0.1) {
          reject(new Error("Network error"));
        } else {
          // In a real app, this would send an actual SMS
          console.log(`Verification code sent to: ${phoneNumber}`);
          // Store the code for verification (in real app, this would be on server)
          window.generatedCode = "123456"; // Simple code for demo
          console.log("Generated demo code: 123456");
          resolve();
        }
      }, 1500);
    });
  }

  async function verifyCode(phoneNumber, code) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        console.log("Verifying code:", code, "against:", window.generatedCode);
        if (code === window.generatedCode) {
          resolve();
        } else {
          reject(new Error("Invalid code"));
        }
      }, 1000);
    });
  }

  async function createAccount(formData) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random failure (5% chance)
        if (Math.random() < 0.05) {
          reject(new Error("Account creation failed"));
        } else {
          console.log("Account created:", formData);
          resolve();
        }
      }, 2000);
    });
  }

  // Message Functions
  function showSuccess(message) {
    // Remove existing messages
    hideMessages();

    const successDiv = document.createElement("div");
    successDiv.className = "success-message";
    successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
    successDiv.style.display = "block";

    const currentStep = document.querySelector(".auth-step.active");
    if (currentStep) {
      currentStep.insertBefore(
        successDiv,
        currentStep.querySelector(".auth-form")
      );
    }

    setTimeout(() => {
      successDiv.style.display = "none";
    }, 5000);
  }

  function showError(message) {
    // Remove existing messages
    hideMessages();

    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorDiv.style.display = "block";

    const currentStep = document.querySelector(".auth-step.active");
    if (currentStep) {
      currentStep.insertBefore(
        errorDiv,
        currentStep.querySelector(".auth-form")
      );
    }

    setTimeout(() => {
      errorDiv.style.display = "none";
    }, 5000);
  }

  function hideMessages() {
    const messages = document.querySelectorAll(
      ".success-message, .error-message"
    );
    messages.forEach((msg) => (msg.style.display = "none"));
  }

  // Enhanced Biometric Verification Functions
  function showVerificationModal() {
    console.log("Showing verification modal");
    verificationModal.classList.add("active");
    startFaceVerification();
  }

  function hideVerificationModal() {
    verificationModal.classList.remove("active");
    stopFaceVerification();
    resetFaceVerification();
  }

  function resetFaceVerification() {
    isFaceDetected = false;
    isCapturing = false;
    captured = false;
    faceDetectionAttempts = 0;
    currentBrightness = 0;
    detectedFaces = 0;
    conditionsMet = false;

    faceStatus.style.display = "block";
    faceStatus.className = "verification-status status-positioning";
    statusText.innerHTML = "Position your face in the circle";
    faceInstructions.textContent =
      "Position your face in the circle and ensure good lighting";
    faceActions.style.display = "none";
    verificationActions.style.display = "flex";
    videoElement.style.display = "block";
    capturedImage.style.display = "none";
    cameraOverlay.classList.remove("active");

    // Reset brightness indicator
    brightnessLevel.style.width = "0%";
    brightnessText.textContent = "Brightness: 0%";

    // Reset face count
    faceCount.textContent = "Faces detected: 0";

    // Hide warnings
    brightnessWarning.style.display = "none";
    multipleFacesWarning.style.display = "none";

    // Disable buttons
    usePhoto.disabled = true;
    verifyIdentity.disabled = true;
  }

  async function startFaceVerification() {
    try {
      // Request camera access
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 300,
          height: 300,
          facingMode: "user",
        },
      });

      videoElement.srcObject = stream;

      // Start face detection and brightness monitoring
      startFaceDetection();
      startBrightnessMonitoring();
    } catch (error) {
      console.error("Error accessing camera:", error);
      // Fallback: Skip face verification and complete registration
      completeRegistration();
    }
  }

  function startBrightnessMonitoring() {
    // Check brightness every 500ms
    setInterval(() => {
      if (
        videoElement.readyState === videoElement.HAVE_ENOUGH_DATA &&
        !isCapturing &&
        !captured
      ) {
        calculateBrightness();
      }
    }, 500);
  }

  function calculateBrightness() {
    const context = faceCanvas.getContext("2d");
    faceCanvas.width = videoElement.videoWidth;
    faceCanvas.height = videoElement.videoHeight;
    context.drawImage(videoElement, 0, 0, faceCanvas.width, faceCanvas.height);

    const imageData = context.getImageData(
      0,
      0,
      faceCanvas.width,
      faceCanvas.height
    );
    const data = imageData.data;

    let brightness = 0;
    for (let i = 0; i < data.length; i += 4) {
      // Calculate brightness using the formula: 0.299*R + 0.587*G + 0.114*B
      brightness += 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    }

    // Normalize brightness to a 0-100 scale
    currentBrightness = Math.min(
      100,
      Math.max(0, Math.round((brightness / (data.length / 4) / 255) * 100))
    );

    // Update UI
    brightnessLevel.style.width = `${currentBrightness}%`;
    brightnessText.textContent = `Brightness: ${currentBrightness}%`;

    // Show/hide brightness warning
    if (currentBrightness < 30) {
      brightnessWarning.style.display = "block";
    } else {
      brightnessWarning.style.display = "none";
    }

    // Update verification conditions
    checkVerificationConditions();
  }

  function startFaceDetection() {
    faceDetectionInterval = setInterval(() => {
      if (!isCapturing && !captured) {
        // Simulate face detection with conditions
        const faceDetected = Math.random() > 0.2;

        // Simulate number of faces detected (1-3)
        detectedFaces = Math.floor(Math.random() * 3) + 1;

        // Update face count display
        faceCount.textContent = `Faces detected: ${detectedFaces}`;

        // Show/hide multiple faces warning
        if (detectedFaces > 1) {
          multipleFacesWarning.style.display = "block";
        } else {
          multipleFacesWarning.style.display = "none";
        }

        // Update verification conditions
        checkVerificationConditions();

        if (faceDetected && !isFaceDetected && conditionsMet) {
          isFaceDetected = true;
          faceStatus.className = "verification-status status-capturing";
          statusText.innerHTML =
            '<i class="fas fa-check-circle"></i> Face detected! Capturing in 3 seconds...';

          // Start countdown to capture
          setTimeout(() => {
            if (isFaceDetected && !isCapturing && conditionsMet) {
              captureFace();
            }
          }, 3000);
        }
      }
    }, 2000);
  }

  function checkVerificationConditions() {
    // Conditions for successful verification:
    // 1. Brightness must be at least 30%
    // 2. Only one face must be detected
    conditionsMet = currentBrightness >= 30 && detectedFaces === 1;

    // Update UI based on conditions
    if (conditionsMet) {
      faceStatus.className = "verification-status status-success";
      statusText.innerHTML =
        '<i class="fas fa-check-circle"></i> Conditions met! Ready to capture.';

      // Enable buttons if conditions are met
      if (captured) {
        usePhoto.disabled = false;
        verifyIdentity.disabled = false;
      }
    } else {
      faceStatus.className = "verification-status status-warning";

      let warningMessage = "Adjust conditions: ";
      if (currentBrightness < 30) warningMessage += "Improve lighting. ";
      if (detectedFaces !== 1)
        warningMessage += "Ensure only one face is visible.";

      statusText.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${warningMessage}`;

      // Disable buttons if conditions are not met
      usePhoto.disabled = true;
      verifyIdentity.disabled = true;
    }
  }

  function captureFace() {
    if (!conditionsMet) {
      console.log("Cannot capture: conditions not met");
      return;
    }

    isCapturing = true;
    clearInterval(faceDetectionInterval);

    // Show countdown
    cameraOverlay.classList.add("active");
    countdownText.textContent = "3";
    countdownText.style.animation = "countdown 1s forwards";

    setTimeout(() => {
      countdownText.textContent = "2";
      countdownText.style.animation = "countdown 1s forwards";
    }, 1000);

    setTimeout(() => {
      countdownText.textContent = "1";
      countdownText.style.animation = "countdown 1s forwards";
    }, 2000);

    setTimeout(() => {
      // Capture the image
      const context = canvasElement.getContext("2d");
      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      context.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height
      );

      // Convert to data URL and display
      capturedImage.src = canvasElement.toDataURL("image/png");
      videoElement.style.display = "none";
      capturedImage.style.display = "block";

      // Stop the camera stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
      }

      // Update UI
      cameraOverlay.classList.remove("active");
      faceStatus.className = "verification-status status-success";
      statusText.innerHTML =
        '<i class="fas fa-check-circle"></i> Face captured successfully!';
      faceInstructions.textContent =
        "Your face has been captured for verification";
      faceActions.style.display = "flex";
      verificationActions.style.display = "none";

      captured = true;
      isCapturing = false;

      // Enable use photo button if conditions are met
      usePhoto.disabled = !conditionsMet;
    }, 3000);
  }

  function stopFaceVerification() {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      stream = null;
    }

    if (faceDetectionInterval) {
      clearInterval(faceDetectionInterval);
      faceDetectionInterval = null;
    }
  }

  function completeRegistration() {
    hideVerificationModal();
    // Redirect to login page with success parameter
    window.location.href = "login.html?registered=true";
  }

  // Biometric verification event listeners
  retakePhoto.addEventListener("click", function () {
    resetFaceVerification();
    startFaceVerification();
  });

  usePhoto.addEventListener("click", function () {
    if (conditionsMet) {
      completeRegistration();
    } else {
      showError("Cannot proceed: Verification conditions not met");
    }
  });

  verifyIdentity.addEventListener("click", function () {
    if (captured && conditionsMet) {
      usePhoto.click();
    } else {
      captureFace();
    }
  });

  cancelVerification.addEventListener("click", hideVerificationModal);

  // Add floating animation to logo
  setInterval(() => {
    const authLogo = document.querySelector(".auth-logo");
    if (authLogo) {
      authLogo.style.animation = "float 3s ease-in-out infinite";
    }
  }, 5000);

  // Debug: Log initial state
  console.log("Enhanced signup form initialized");
  console.log("Current step:", currentStep);
});
