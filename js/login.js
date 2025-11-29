// Tab switching functionality with enhanced animations
document.addEventListener("DOMContentLoaded", function () {
  const loginTab = document.querySelector('[data-tab="login"]');
  const registerTab = document.querySelector('[data-tab="register"]');
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const showLogin = document.getElementById("showLogin");
  const showRegister = document.getElementById("showRegister");
  const successMessage = document.getElementById("successMessage");
  const ageSlider = document.getElementById("age");
  const ageDisplay = document.getElementById("ageDisplay");
  const particlesContainer = document.getElementById("particles");
  const authLogo = document.querySelector(".auth-logo");
  const authLeft = document.querySelector(".auth-left");

  // Biometric verification elements
  const verificationModal = document.getElementById("verificationModal");
  const cancelVerification = document.getElementById("cancelVerification");
  const verifyIdentity = document.getElementById("verifyIdentity");
  const videoElement = document.getElementById("videoElement");
  const canvasElement = document.getElementById("canvasElement");
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

  let stream = null;
  let faceDetectionInterval = null;
  let isFaceDetected = false;
  let isCapturing = false;
  let captured = false;
  let faceDetectionAttempts = 0;

  // Age slider functionality
  ageSlider.addEventListener("input", function () {
    ageDisplay.textContent = this.value;
  });

  // Create particles for animation
  function createParticles(count, x, y) {
    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.classList.add("particle");

      // Random size and color
      const size = Math.random() * 8 + 4;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      // Random color from theme
      const colors = ["#ff4b91", "#6c63ff", "#e83e8c", "#ff6b9d"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      particle.style.background = color;

      // Position
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;

      // Animation
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 5 + 2;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity;

      particle.style.opacity = "1";

      particlesContainer.appendChild(particle);

      // Animate particle
      let posX = x;
      let posY = y;
      let opacity = 1;

      const animateParticle = () => {
        posX += vx;
        posY += vy;
        opacity -= 0.02;

        particle.style.left = `${posX}px`;
        particle.style.top = `${posY}px`;
        particle.style.opacity = opacity;

        if (opacity > 0) {
          requestAnimationFrame(animateParticle);
        } else {
          particlesContainer.removeChild(particle);
        }
      };

      animateParticle();
    }
  }

  // Enhanced form switching with animations
  function switchForm(fromForm, toForm, direction) {
    // Create particles at the center of the form
    const formRect = fromForm.getBoundingClientRect();
    const centerX = formRect.left + formRect.width / 2;
    const centerY = formRect.top + formRect.height / 2;
    createParticles(30, centerX, centerY);

    // Animate logo
    authLogo.style.transform = "scale(1.1)";
    setTimeout(() => {
      authLogo.style.transform = "scale(1)";
    }, 300);

    // Animate left panel
    authLeft.style.transform =
      direction === "toRegister" ? "translateX(-10px)" : "translateX(10px)";
    setTimeout(() => {
      authLeft.style.transform = "translateX(0)";
    }, 500);

    // Animate forms
    fromForm.classList.remove("active");
    fromForm.classList.add("exiting");

    setTimeout(() => {
      fromForm.classList.remove("exiting");
      toForm.classList.add("entering");

      setTimeout(() => {
        toForm.classList.remove("entering");
        toForm.classList.add("active");
      }, 100);
    }, 300);
  }

  // Switch to login form
  function showLoginForm() {
    loginTab.classList.add("active");
    registerTab.classList.remove("active");
    switchForm(registerForm, loginForm, "toLogin");
  }

  // Switch to register form
  function showRegisterForm() {
    registerTab.classList.add("active");
    loginTab.classList.remove("active");
    switchForm(loginForm, registerForm, "toRegister");
  }

  // Tab click events
  loginTab.addEventListener("click", showLoginForm);
  registerTab.addEventListener("click", showRegisterForm);
  showLogin.addEventListener("click", showLoginForm);
  showRegister.addEventListener("click", showRegisterForm);

  // Biometric verification functionality
  function showVerificationModal() {
    verificationModal.classList.add("active");
    // Start with face verification by default
    startFaceVerification();
  }

  function hideVerificationModal() {
    verificationModal.classList.remove("active");
    stopFaceVerification();
    resetFaceVerification();
  }

  // Reset face verification state
  function resetFaceVerification() {
    isFaceDetected = false;
    isCapturing = false;
    captured = false;
    faceDetectionAttempts = 0;
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
  }

  // Start face verification
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

      // Start face detection simulation
      startFaceDetection();
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Unable to access camera. Please check permissions and try again.");
    }
  }

  // Simulate face detection with enhanced checks
  function startFaceDetection() {
    faceDetectionInterval = setInterval(() => {
      if (!isCapturing && !captured) {
        // Simulate face detection conditions
        const lightingCondition = Math.random() > 0.3; // 70% chance of good lighting
        const facePosition = Math.random() > 0.2; // 80% chance of good position
        const singleFace = Math.random() > 0.1; // 90% chance of single face
        const eyesOpen = Math.random() > 0.2; // 80% chance of eyes open
        const mouthClosed = Math.random() > 0.2; // 80% chance of mouth closed

        // Check for multiple faces
        if (!singleFace) {
          faceStatus.className = "verification-status status-error";
          statusText.innerHTML =
            '<i class="fas fa-exclamation-triangle"></i> Multiple faces detected. Please ensure only one person is in frame.';
          faceInstructions.textContent =
            "Please make sure only your face is visible in the camera";
          isFaceDetected = false;
          return;
        }

        // Check lighting conditions
        if (!lightingCondition) {
          faceStatus.className = "verification-status status-warning";
          statusText.innerHTML =
            '<i class="fas fa-lightbulb"></i> Low lighting detected. Please move to a brighter area.';
          faceInstructions.textContent =
            "Find a well-lit area or turn on more lights for better face detection";
          isFaceDetected = false;
          return;
        }

        // Check face position
        if (!facePosition) {
          faceStatus.className = "verification-status status-warning";
          statusText.innerHTML =
            '<i class="fas fa-arrows-alt"></i> Please position your face properly in the circle.';
          faceInstructions.textContent =
            "Center your face within the guide and make sure it's clearly visible";
          isFaceDetected = false;
          return;
        }

        // Check eyes
        if (!eyesOpen) {
          faceStatus.className = "verification-status status-warning";
          statusText.innerHTML =
            '<i class="fas fa-eye"></i> Please open your eyes for verification.';
          faceInstructions.textContent =
            "Keep your eyes open and look directly at the camera";
          isFaceDetected = false;
          return;
        }

        // Check mouth
        if (!mouthClosed) {
          faceStatus.className = "verification-status status-warning";
          statusText.innerHTML =
            '<i class="fas fa-comment"></i> Please close your mouth for verification.';
          faceInstructions.textContent =
            "Close your mouth and maintain a neutral expression";
          isFaceDetected = false;
          return;
        }

        // All conditions met - face detected
        if (!isFaceDetected) {
          isFaceDetected = true;
          faceStatus.className = "verification-status status-capturing";
          statusText.innerHTML =
            '<i class="fas fa-check-circle"></i> Face detected! Capturing in 3 seconds...';

          // Start countdown to capture
          setTimeout(() => {
            if (isFaceDetected && !isCapturing) {
              captureFace();
            }
          }, 3000);
        }
      }
    }, 1500);
  }

  // Capture face photo
  function captureFace() {
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
    }, 3000);
  }

  // Stop face verification
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

  // Retake photo
  retakePhoto.addEventListener("click", function () {
    resetFaceVerification();
    startFaceVerification();
  });

  // Use captured photo
  usePhoto.addEventListener("click", function () {
    // kizzi send the capturedImage.src to server for verification

    hideVerificationModal();

    // Show success message
    successMessage.style.display = "block";
    successMessage.style.animation = "slideInDown 0.5s ease";

    setTimeout(() => {
      showLoginForm();
      setTimeout(() => {
        successMessage.style.display = "none";
        registerForm.reset();
        ageDisplay.textContent = "25";
        ageSlider.value = "25";
      }, 1000);
    }, 2000);
  });

  // Verify identity
  verifyIdentity.addEventListener("click", function () {
    // If face is already captured, use it
    if (captured) {
      usePhoto.click();
    } else {
      // Otherwise, manually trigger capture
      captureFace();
    }
  });

  // Cancel verification
  cancelVerification.addEventListener("click", hideVerificationModal);

  // Form submission with enhanced animations
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    // Add button animation
    const btn = this.querySelector(".btn-primary");
    btn.style.animation = "pulse 0.5s ease, glow 1s ease infinite";

    setTimeout(() => {
      btn.style.animation = "";
      // kizzi,In a real app, you would handle login here
      alert("Login functionality would be implemented here!");
      // Redirect to dashboard
      // window.location.href = 'dashboard.html';
    }, 1000);
  });

  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Add button animation
    const btn = this.querySelector(".btn-primary");
    btn.style.animation = "pulse 0.5s ease, glow 1s ease infinite";

    // Kizzi, you would handle registration here
    // Show biometric verification modal
    setTimeout(() => {
      btn.style.animation = "";
      showVerificationModal();
    }, 1000);
  });

  // Add floating animation to logo
  setInterval(() => {
    authLogo.style.animation = "float 3s ease-in-out infinite";
  }, 5000);

  // Check if we're coming from a successful registration
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("registered") === "true") {
    successMessage.style.display = "block";
    showLoginForm();
    setTimeout(() => {
      successMessage.style.display = "none";
    }, 5000);
  }
});
