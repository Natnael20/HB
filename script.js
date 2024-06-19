  // Set the countdown time in seconds
  let countdownTime = 10;

  // Update the countdown every 1 second
  const countdown = setInterval(function() {
      // Display the current countdown time
      document.getElementById("number").innerHTML = countdownTime;

      // If the countdown reaches 0, display the surprise message and trigger animations
      if (countdownTime <= 0) {
          clearInterval(countdown);
          document.getElementById("number").innerHTML = "";
          document.getElementById("surprise").innerHTML = "Happy Graduation!";
          document.getElementById("surprise").classList.add("animate__animated", "animate__bounceIn");
          document.getElementById("note").classList.add("show-off");
          document.getElementById("note").classList.add("animate__animated", "animate__bounceIn")
          const balloons = document.getElementsByClassName("balloon");
              for (let i = 0; i < balloons.length; i++) {
                  balloons[i].classList.add("show-balloon");
      }
          // Trigger confetti animation
          function launchConfetti() {
              confetti({
                  particleCount: 120,
                  spread: 70,
                  origin: { y: 0.6 }
              });
          }
          launchConfetti();
          setInterval(launchConfetti, 1000);

 
      } else {
          // Decrease the countdown time by 1 second
          countdownTime--;
      }
  }, 1000);