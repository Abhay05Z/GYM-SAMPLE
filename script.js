const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.querySelector(".nav-menu");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

window.addEventListener("load", () => {
  document.body.classList.add("is-ready");
});

const internalPageLinks = document.querySelectorAll('a[href$=".html"]');

internalPageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");
    const target = link.getAttribute("target");

    if (!href || href.startsWith("#") || target === "_blank") {
      return;
    }

    const nextUrl = new URL(href, window.location.href);
    if (nextUrl.href === window.location.href) {
      return;
    }

    event.preventDefault();
    document.body.classList.add("is-transitioning");

    window.setTimeout(() => {
      window.location.href = nextUrl.href;
    }, 420);
  });
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll("[data-testimonial-shell]").forEach((shell) => {
  const cards = Array.from(shell.querySelectorAll(".testimonial-card"));
  const dotsContainer = shell.querySelector(".slider-dots");
  const buttons = shell.querySelectorAll(".slider-btn");

  if (!cards.length || !dotsContainer) {
    return;
  }

  let activeIndex = 0;
  let autoRotate;

  const render = (index) => {
    cards.forEach((card, cardIndex) => {
      card.classList.toggle("is-active", cardIndex === index);
    });

    Array.from(dotsContainer.children).forEach((dot, dotIndex) => {
      dot.classList.toggle("is-active", dotIndex === index);
    });
  };

  const setActive = (index) => {
    activeIndex = (index + cards.length) % cards.length;
    render(activeIndex);
  };

  const restart = () => {
    window.clearInterval(autoRotate);
    autoRotate = window.setInterval(() => {
      setActive(activeIndex + 1);
    }, 5000);
  };

  cards.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slider-dot";
    dot.setAttribute("aria-label", `Show testimonial ${index + 1}`);
    dot.addEventListener("click", () => {
      setActive(index);
      restart();
    });
    dotsContainer.append(dot);
  });

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const delta = button.dataset.direction === "next" ? 1 : -1;
      setActive(activeIndex + delta);
      restart();
    });
  });

  render(activeIndex);
  restart();
});

const contactForm = document.querySelector(".contact-form");

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const button = contactForm.querySelector("button");
    if (!button) {
      return;
    }

    const originalText = button.textContent;
    button.textContent = "Request Sent";
    button.disabled = true;

    window.setTimeout(() => {
      button.textContent = originalText;
      button.disabled = false;
      contactForm.reset();
    }, 1800);
  });
}
