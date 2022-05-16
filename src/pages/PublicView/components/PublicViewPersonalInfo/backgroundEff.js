function parallax(e) {
  document.querySelectorAll(".movingObject").forEach(function(move) {
    const x = (e.clientX * 5) / 250;
    const y = (e.clientY * 5) / 250;
    const nextTransform = "translateX(" + x + "px) translateY(" + y + "px)";
    move.style.transition = "unset";
    move.style.transform = nextTransform;
    
  })
}

function initPosition(e) {
  document.querySelectorAll(".movingObject").forEach(function(move) {
    const x = (e.clientX * 5) / 250;
    const y = (e.clientY * 5) / 250;
    const nextTransform = "translateX(" + x + "px) translateY(" + y + "px)";
    move.style.transition = "transform 0.3s";
    move.style.transform = nextTransform;
  })
}

function resetPosition(e) {
  document.querySelectorAll(".movingObject").forEach(function(move) {
    move.style.transform = "translateX(0) translateY(0)";
    move.style.transition = "transform 0.3s";
  })
}

export function transformBG() {
  document.addEventListener("mousemove", parallax);  
  document.addEventListener("mouseenter", initPosition);
  document.addEventListener("mouseleave", resetPosition);
}

export function removeListenerTransformBG() {
  document.removeEventListener("mousemove", parallax);
  document.removeEventListener("mouseenter", initPosition);
  document.removeEventListener("mouseleave", resetPosition);
}