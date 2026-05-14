const menuButton = document.querySelector(".menu-toggle");
const menu = document.querySelector("#menu-principal");
const toast = document.querySelector(".toast");
let toastTimeout;

if (menuButton && menu) {
  const icon = menuButton.querySelector(".material-symbols-outlined");

  function closeMenu() {
    menu.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Abrir menu");
    if (icon) icon.textContent = "menu";
  }

  function openMenu() {
    menu.classList.add("is-open");
    document.body.classList.add("menu-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Fechar menu");
    if (icon) icon.textContent = "close";
  }

  menuButton.addEventListener("click", () => {
    if (menu.classList.contains("is-open")) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  menu.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;

    if (
      target instanceof Node &&
      menu.classList.contains("is-open") &&
      !menu.contains(target) &&
      !menuButton.contains(target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMenu();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 980) {
      closeMenu();
    }
  });
}

function showToast(message) {
  if (!toast) return;

  window.clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.classList.add("is-visible");

  toastTimeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2400);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return;
    } catch {
      // Continue para o fallback em navegadores que bloqueiam a API Clipboard.
    }
  }

  const input = document.createElement("textarea");
  input.value = text;
  input.setAttribute("readonly", "");
  input.style.position = "fixed";
  input.style.top = "-1000px";
  document.body.appendChild(input);
  input.focus();
  input.select();
  document.execCommand("copy");
  input.remove();
}

document.querySelectorAll("[data-copy]").forEach((trigger) => {
  trigger.addEventListener("click", async (event) => {
    event.preventDefault();

    const text = trigger.getAttribute("data-copy");
    const message = trigger.getAttribute("data-copy-message") || "Copiado!";

    if (!text) return;

    try {
      await copyText(text);
      showToast(message);
    } catch {
      showToast("Não foi possível copiar.");
    }
  });
});

document.querySelectorAll("[data-email-action]").forEach((trigger) => {
  trigger.addEventListener("click", (event) => {
    const mailto = "mailto:gabyfreiire@icloud.com?subject=Contato%20pelo%20portf%C3%B3lio";
    const gmail = "https://mail.google.com/mail/?view=cm&fs=1&to=gabyfreiire%40icloud.com&su=Contato%20pelo%20portf%C3%B3lio";
    const shouldUseMailApp = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;

    event.preventDefault();

    if (shouldUseMailApp) {
      window.location.href = mailto;
      return;
    }

    window.open(gmail, "_blank", "noopener,noreferrer");
  });
});

document.querySelectorAll("[data-pdf-viewer]").forEach(async (viewer) => {
  const pdfPath = viewer.getAttribute("data-pdf-src");

  if (!pdfPath) return;

  try {
    const response = await fetch(pdfPath, { method: "HEAD" });

    if (!response.ok) return;

    viewer.innerHTML = "";

    const object = document.createElement("object");
    object.setAttribute("data", pdfPath);
    object.setAttribute("type", "application/pdf");
    object.className = "resume-pdf";
    viewer.appendChild(object);
  } catch {
    // Mantém a mensagem amigável quando o PDF ainda não está disponível.
  }
});

const openCurriculoButton = document.querySelector("[data-open-curriculo]");
const closeCurriculoButton = document.querySelector("[data-close-curriculo]");
const curriculoView = document.querySelector("#curriculo-view");
const curriculoImage = document.querySelector("[data-curriculo-image]");
const curriculoPlaceholder = document.querySelector("[data-curriculo-placeholder]");

if (curriculoImage && curriculoPlaceholder) {
  function showCurriculoImage() {
    curriculoImage.hidden = false;
    curriculoPlaceholder.hidden = true;
  }

  curriculoImage.addEventListener("load", () => {
    showCurriculoImage();
  });

  curriculoImage.addEventListener("error", () => {
    curriculoImage.hidden = true;
    curriculoPlaceholder.hidden = false;
  });

  if (curriculoImage.complete && curriculoImage.naturalWidth > 0) {
    showCurriculoImage();
  }
}

if (openCurriculoButton && closeCurriculoButton && curriculoView) {
  openCurriculoButton.addEventListener("click", (event) => {
    event.preventDefault();
    curriculoView.hidden = false;
    document.body.classList.add("is-curriculo-open");
    window.scrollTo({ top: 0, behavior: "auto" });
    closeCurriculoButton.focus();
  });

  closeCurriculoButton.addEventListener("click", () => {
    document.body.classList.remove("is-curriculo-open");
    curriculoView.hidden = true;
    window.location.hash = "home";
    openCurriculoButton.focus();
  });
}
