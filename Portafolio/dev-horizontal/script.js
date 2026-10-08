/* ===== Datos editables: cambia aquí tus textos ===== */
const SKILLS = [["JavaScript", 85], ["HTML5", 92], ["CSS3", 88], ["Git y GitHub", 75], ["APIs REST", 70], ["Bases de datos", 65]];
const TOOLS = ["VS Code", "Node.js", "Git", "Figma", "Responsive", "Accesibilidad", "Depuración", "Código limpio", "Trabajo en equipo"];
const PROJECTS = [
  ["🌐", "Portafolio personal", "Sitio responsivo con animaciones y excelente rendimiento.", "HTML · CSS · JS"],
  ["🛒", "Tienda en línea", "Catálogo, carrito de compras y pago simulado.", "JavaScript · UI"],
  ["📋", "Gestor de tareas", "App para organizar pendientes con filtros y guardado local.", "JavaScript · LocalStorage"],
  ["📊", "Panel de datos", "Dashboard con gráficas y tablas fáciles de leer.", "JS · Diseño"]
];
const PATH = [
  ["2023", "Inicio en programación", "Primeros proyectos con HTML, CSS y JavaScript. Edita aquí tu escuela o curso."],
  ["2025", "Proyectos propios", "Aplicaciones web completas para practicar y construir portafolio."],
  ["2026", "Desarrollador freelance", "Sitios y aplicaciones por encargo para clientes y negocios."],
  ["Próximo", "Siguiente meta", "Trabajar en un equipo de producto y seguir creciendo (edita esta meta)."]
];

const $ = (s) => document.querySelector(s);
const track = $("#track"), panels = [...track.children];
let idx = 0, lock = false;

/* ===== Pintar contenido ===== */
$("#rings").innerHTML = SKILLS.map(([n, v]) => `<div class="ring"><div data-v="${v}"></div><span>${n}</span></div>`).join("");
$("#chips").innerHTML = TOOLS.map((t) => `<span>${t}</span>`).join("");
$("#cards").innerHTML = PROJECTS.map(([i, t, p, s], k) => `<article class="card" style="--i:${k}"><div class="ic">${i}</div><h3>${t}</h3><p>${p}</p><small>${s}</small></article>`).join("");
$("#path").innerHTML = PATH.map(([f, t, p]) => `<li><small>${f}</small><h3>${t}</h3><p>${p}</p></li>`).join("");
$("#dots").innerHTML = panels.map((_, i) => `<i data-go="${i}" role="button" aria-label="Ir a la sección ${i + 1}"></i>`).join("");

/* ===== Navegación horizontal ===== */
function go(i) {
  idx = Math.max(0, Math.min(panels.length - 1, i));
  track.scrollTo({ left: panels[idx].offsetLeft, behavior: "smooth" });
}
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-go]");
  if (t) { e.preventDefault(); go(+t.dataset.go); }
});
$("#prev").onclick = () => go(idx - 1);
$("#next").onclick = () => go(idx + 1);

/* Rueda del mouse -> mueve de lado a lado */
track.addEventListener("wheel", (e) => {
  const p = panels[idx];
  const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
  if (Math.abs(e.deltaY) >= Math.abs(e.deltaX) && p.scrollHeight > p.clientHeight + 4) return; // deja scroll vertical si no cabe
  e.preventDefault();
  if (lock || Math.abs(d) < 12) return;
  lock = true; go(idx + (d > 0 ? 1 : -1));
  setTimeout(() => (lock = false), 750);
}, { passive: false });

/* Teclado */
addEventListener("keydown", (e) => {
  if (["ArrowRight", "PageDown"].includes(e.key)) go(idx + 1);
  if (["ArrowLeft", "PageUp"].includes(e.key)) go(idx - 1);
  if (e.key === "Home") go(0);
  if (e.key === "End") go(panels.length - 1);
});
addEventListener("resize", () => track.scrollTo({ left: panels[idx].offsetLeft }));

/* ===== Detectar sección activa ===== */
const links = [...document.querySelectorAll("#menu a")], dots = [...document.querySelectorAll(".dots i")];
const io = new IntersectionObserver((entries) => entries.forEach((en) => {
  if (!en.isIntersecting) return;
  const i = panels.indexOf(en.target);
  idx = i;
  panels.forEach((p, k) => p.classList.toggle("on", k === i || p.classList.contains("on")));
  links.forEach((a) => a.classList.toggle("on", +a.dataset.go === i));
  dots.forEach((d, k) => d.classList.toggle("on", k === i));
  $("#count").textContent = String(i + 1).padStart(2, "0") + " / " + String(panels.length).padStart(2, "0");
  $("#bar").style.width = ((i + 1) / panels.length) * 100 + "%";
  if (i === 2) document.querySelectorAll(".ring div").forEach((r) => r.style.setProperty("--p", r.dataset.v));
}), { root: track, threshold: 0.6 });
panels.forEach((p) => io.observe(p));
