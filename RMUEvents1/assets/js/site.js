/* RMU Events — statische homepage.
   Drie dingetjes: de balk die van de banner af verkleurt, het
   uitklapmenu op smalle schermen, en het jaartal in de voettekst. */
(function () {
  'use strict';

  var header = document.getElementById('header');
  var hero = document.getElementById('top');

  /* ---------- Balk: doorzichtig op de banner, gevuld daarna ----------
     De banner zelf is de wachter. Met de bovenrand van het kijkvenster naar
     beneden gehaald tot onder de balk valt "raakt de banner de balk niet
     meer" precies samen met "de balk is de banner voorbij".

     Niet met een los sentinel-blokje onderaan de banner doen: is de banner
     hoger dan het scherm, dan begint dat blokje onder de onderrand en telt
     het net zo goed als onzichtbaar, terwijl je juist bovenaan staat. De
     balk sprong dan meteen in zijn vaste vorm. Bovendien vuurt een
     observer alleen bij een drempelovergang, en tussen "onder het scherm"
     en "boven het scherm" is er geen: na een sprong bleef de stand hangen. */
  if (header && hero && 'IntersectionObserver' in window) {
    /* Eén keer vastleggen: zodra de balk vast staat krimpt hij, en een
       meebewegende grens laat hem heen en weer klapperen. */
    var balkHoogte = header.offsetHeight;

    new IntersectionObserver(function (posities) {
      header.classList.toggle('is-vast', !posities[0].isIntersecting);
    }, { rootMargin: '-' + balkHoogte + 'px 0px 0px 0px' }).observe(hero);
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

  /* ---------- Woordmerk streek voor streek tekenen ----------
     Elk pad krijgt een duur die evenredig is met zijn eigen lengte, zodat de
     "pen" overal even snel beweegt: een lange stok duurt langer dan een kort
     dwarsstreepje. De vertragingen worden opgeteld, dus de streken volgen
     elkaar in de volgorde waarin ze in de SVG staan. */
  var tekening = document.querySelector('.merk-tekening');
  if (tekening) {
    var SNELHEID = 1400;  /* eenheden per seconde */
    var PAUZE = 0.03;     /* seconde tussen twee streken */
    var klok = 0.25;      /* even wachten voor hij begint */

    /* Per teken doorlopen, zodat het boerinnetje in de N precies kan
       beginnen zodra die letter af is. Alleen de penstreken meenemen: de
       paden in de clipPath zijn de lettervormen zelf en bewegen niet mee. */
    [].slice.call(tekening.children).forEach(function (groep) {
      [].slice.call(groep.querySelectorAll('.veeg')).forEach(function (pad) {
        var lengte = pad.getTotalLength();
        var duur = lengte / SNELHEID;
        pad.style.setProperty('--lengte', lengte);
        pad.style.animationDuration = duur.toFixed(3) + 's';
        pad.style.animationDelay = klok.toFixed(3) + 's';
        klok += duur + PAUZE;
      });
      var boerin = groep.querySelector('.boerin');
      if (boerin) boerin.style.animationDelay = klok.toFixed(3) + 's';
    });
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
