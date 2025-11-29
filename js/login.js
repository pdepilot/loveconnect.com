// Login page functionality
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const successMessage = document.getElementById("successMessage");
    const particlesContainer = document.getElementById("particles");
    const authLogo = document.querySelector(".auth-logo");
    const authLeft = document.querySelector(".auth-left");

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

    // Check if we're coming from a successful registration
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("registered") === "true") {
        successMessage.style.display = "block";
        setTimeout(() => {
            successMessage.style.display = "none";
        }, 5000);
    }

    // Form submission with enhanced animations
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Create particles at the center of the form
        const formRect = this.getBoundingClientRect();
        const centerX = formRect.left + formRect.width / 2;
        const centerY = formRect.top + formRect.height / 2;
        createParticles(30, centerX, centerY);

        // Animate logo
        authLogo.style.transform = "scale(1.1)";
        setTimeout(() => {
            authLogo.style.transform = "scale(1)";
        }, 300);

        // Animate left panel
        authLeft.style.transform = "translateX(10px)";
        setTimeout(() => {
            authLeft.style.transform = "translateX(0)";
        }, 500);

        // Add button animation
        const btn = this.querySelector(".btn-primary");
        btn.style.animation = "pulse 0.5s ease, glow 1s ease infinite";

        setTimeout(() => {
            btn.style.animation = "";
            // In a real app, you would handle login here
            alert("Login functionality would be implemented here!");
            // Redirect to dashboard
            // window.location.href = 'dashboard.html';
        }, 1000);
    });

    // Add floating animation to logo
    setInterval(() => {
        authLogo.style.animation = "float 3s ease-in-out infinite";
    }, 5000);
});