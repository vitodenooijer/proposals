/* RMU Events — statische homepage.
   Drie dingetjes: de balk die van de banner af verkleurt, het
   uitklapmenu op smalle schermen, en het jaartal in de voettekst. */
(function () {
  'use strict';

  var header = document.getElementById('header');
  var hero = document.getElementById('top');

  /* ---------- Balk: doorzichtig op de banner, gevuld daarna ----------
     Een sentinel van 1px onderaan de banner scheelt een scroll-listener:
     zodra die uit beeld is, is de balk voorbij de banner. */
  if (header && hero && 'IntersectionObserver' in window) {
    var wachter = document.createElement('div');
    wachter.style.cssText = 'position:absolute;bottom:0;left:0;width:1px;height:1px;pointer-events:none;';
    hero.style.position = 'relative';
    hero.appendChild(wachter);

    new IntersectionObserver(function (posities) {
      header.classList.toggle('is-vast', !posities[0].isIntersecting);
    }, { rootMargin: '-' + header.offsetHeight + 'px 0px 0px 0px' }).observe(wachter);
  } else if (header) {
    // Terugval voor oudere browsers.
    var kijk = function () {
      var grens = hero ? hero.offsetHeight - header.offsetHeight : 200;
      header.classList.toggle('is-vast', window.scrollY > grens);
    };
    window.addEventListener('scroll', kijk, { passive: true });
    kijk();
  }

  /* ---------- Pijltje: weg voordat het achter de balk schuift ----------
     Dezelfde truc als hierboven, maar met het pijltje zelf als wachter.
     Sturen op intersectionRatio, niet op isIntersecting: die laatste blijft
     waar zolang er nog een pixel overlapt, en dan is het pijltje al half
     door de balk heen gezakt. Zodra de ratio onder 1 komt, raakt het de
     balk en moet het weg. */
  var pijl = document.querySelector('.hero-pijl');
  if (pijl && header && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (posities) {
      pijl.classList.toggle('is-weg', posities[0].intersectionRatio < 1);
    }, {
      rootMargin: '-' + header.offsetHeight + 'px 0px 0px 0px',
      threshold: [0, 0.5, 1]
    }).observe(pijl);
  }

  /* ---------- Uitklapmenu ---------- */
  var knop = document.getElementById('menu-toggle');
  var paneel = document.getElementById('menu-paneel');
  var sluiten = document.getElementById('menu-sluiten');
  var waas = document.getElementById('menu-overlay');

  if (knop && paneel && waas) {
    var zetOpen = function (open) {
      document.body.classList.toggle('menu-open', open);
      knop.setAttribute('aria-expanded', String(open));
      knop.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');

      if (open) {
        // hidden eraf vóór de transitie, anders schuift er niets.
        paneel.hidden = false;
        waas.hidden = false;
        requestAnimationFrame(function () { paneel.focus(); });
      } else {
        // Pas verbergen als het paneel uit beeld geschoven is.
        window.setTimeout(function () {
          if (!document.body.classList.contains('menu-open')) {
            paneel.hidden = true;
            waas.hidden = true;
          }
        }, 350);
        knop.focus();
      }
    };

    paneel.tabIndex = -1;
    knop.addEventListener('click', function () {
      zetOpen(!document.body.classList.contains('menu-open'));
    });
    waas.addEventListener('click', function () { zetOpen(false); });
    if (sluiten) sluiten.addEventListener('click', function () { zetOpen(false); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('menu-open')) zetOpen(false);
    });

    // Een link in het paneel volgen betekent: paneel dicht.
    paneel.addEventListener('click', function (e) {
      if (e.target.closest('a')) zetOpen(false);
    });

    // Terug naar breed scherm terwijl het menu open staat: opruimen.
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1100 && document.body.classList.contains('menu-open')) zetOpen(false);
    });
  }

  /* ---------- Jaartal ---------- */
  var jaar = document.getElementById('jaar');
  if (jaar) jaar.textContent = String(new Date().getFullYear());
})();
