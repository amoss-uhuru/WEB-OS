/* ===================================================================
   Lightweight bilingual (English / Kiswahili) toggle.
=================================================================== */
(function () {
  const DICT = {
    en: {
      "nav.home": "Home", "nav.about": "About", "nav.projects": "Development Projects",
      "nav.education": "Education & Bursaries", "nav.programs": "Youth & Women",
      "nav.opportunities": "Opportunities", "nav.announcements": "Announcements",
      "nav.services": "Service Delivery", "nav.feedback": "Citizen Feedback",
      "nav.resources": "Resources", "nav.contact": "Contact", "nav.login": "Login / Register",
      "cta.explore": "Explore the Platform", "cta.getstarted": "Get Started",
      "cta.viewall": "View all", "cta.readmore": "Read more", "cta.submit": "Submit",
      "footer.rights": "All rights reserved.", "footer.tagline": "One Constituency. One Platform. One Future.",
      "badge.demo": "Demo content — connect the backend API to replace with live data.",
    },
    sw: {
      "nav.home": "Nyumbani", "nav.about": "Kuhusu", "nav.projects": "Miradi ya Maendeleo",
      "nav.education": "Elimu na Ufadhili", "nav.programs": "Vijana na Wanawake",
      "nav.opportunities": "Fursa", "nav.announcements": "Matangazo",
      "nav.services": "Huduma", "nav.feedback": "Maoni ya Wananchi",
      "nav.resources": "Nyaraka", "nav.contact": "Wasiliana", "nav.login": "Ingia / Jisajili",
      "cta.explore": "Tembelea Jukwaa", "cta.getstarted": "Anza Sasa",
      "cta.viewall": "Ona vyote", "cta.readmore": "Soma zaidi", "cta.submit": "Tuma",
      "footer.rights": "Haki zote zimehifadhiwa.", "footer.tagline": "Eneobunge Moja. Jukwaa Moja. Wakati Ujao Mmoja.",
      "badge.demo": "Maudhui ya mfano — unganisha na mfumo wa nyuma kupata data halisi.",
    },
  };

  function apply(lang) {
    document.documentElement.setAttribute("lang", lang === "sw" ? "sw" : "en");
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const val = DICT[lang] && DICT[lang][key];
      if (val) el.textContent = val;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      const key = el.getAttribute("data-i18n-ph");
      const val = DICT[lang] && DICT[lang][key];
      if (val) el.setAttribute("placeholder", val);
    });
    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.classList.toggle("active", btn.getAttribute("data-lang") === lang);
    });
    try { localStorage.setItem("krc_lang", lang); } catch (e) {}
  }

  document.addEventListener("DOMContentLoaded", () => {
    let saved = "en";
    try { saved = localStorage.getItem("krc_lang") || "en"; } catch (e) {}
    apply(saved);
    document.querySelectorAll(".lang-toggle button").forEach((btn) => {
      btn.addEventListener("click", () => apply(btn.getAttribute("data-lang")));
    });
  });
})();
