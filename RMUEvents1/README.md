# RMU Events — statische homepage (voorstel 1)

Losse, statische pagina. Geen build, geen server nodig: open `index.html` in de
browser. De enige externe bron zijn de Google Fonts.

```
index.html
assets/css/style.css     alle opmaak, met tokens bovenaan
assets/js/site.js        vaste balk, uitklapmenu, jaartal
assets/img/              logo en foto's (overgenomen uit RMUEvents/public/img)
assets/video/            hier komt de bannervideo — zie LEESMIJ.txt
```

## De banner

Zet de video neer als `assets/video/banner.mp4` (en eventueel `banner.webm`).
Zolang die er niet is, toont de banner de posterfoto `assets/img/braderie.jpg`.
De video speelt gedempt, in een lus, en is licht vervaagd — de sterkte staat in
`style.css` als `--hero-blur` (5px, op smalle schermen 4px).

## Waar de stijl vandaan komt

- **Layout en typografie** naar het Wix-sjabloon *Be.Spirit Festival*:
  fullscreen banner, zwevende balk met gecentreerd menu, label plus knoppen
  rechtsboven, socials op de banner, brede letterspatiëring in hoofdletters.
  Lettertypen zijn Google-tegenhangers van die van het sjabloon: Barlow
  Condensed (DIN Neuzeit Grotesk), Jost (Avenir) en Yellowtail voor de
  banner­kop.
- **Nieuwsblokken** naar HTML5 UP *Editorial*: zes blokken met foto, kop,
  omschrijving en een knop "Meer lezen".
- **Kleuren** van de bestaande RMU Events-site: pruim `#594c51`, crème
  `#f1ebc4`, koraal `#f06060` op een achtergrond van `#f2efe8`.

## De menubalk

Staat vast bovenaan. Boven de banner is hij doorzichtig met witte tekst; zodra
hij van de banner af scrolt krijgt hij een pruimkleurige achtergrond en wordt de
tekst crème; het crème logovlak blijft zoals het is. Wie liever een lichte balk
heeft, haalt in `style.css` het commentaar weg bij het blok onder
*"Liever een lichte balk"*.

Onder 1100px verdwijnen menu én knoppen achter een hamburger rechtsboven; de
knoppen komen in het uitklappaneel terug onder het kopje "Aanmelden".

## Nog invullen

De socials staan goed: Facebook, Instagram en YouTube van de stichting, op drie
plekken (banner, uitklapmenu, voettekst). De overige links wijzen nog naar
ankers op de pagina zelf (`#nieuws`, `#contact`) — die kunnen naar de echte
pagina's zodra die er zijn.
