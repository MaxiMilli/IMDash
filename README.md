# IMDash
> Das IMDash ist eine ergänzende E-Learning Plattform zu Moodle den Unterricht der 'Interaktiven Medien' noch interaktiver zu gestalten.

**Status:**
- Prototyp

Diese Dokumentation reisst die Motivation, die technische Beschreibung, die verwendeten Technologien, die Herausforderungen und die potentielle Weiterentwicklung an. (Zugangsdaten werden per Mail verschickt)

## Rahmenbedingungen
Dieses Tool wurde während der Major-Ausbildung im Studiengang Multimedia Production (MMP) an der [HTW Chur](https://www.htwchur.ch/) entwickelt. Während dem Frühlingssemester 2018 wurde das Tool konzipiert und wird im Herbstsemester 2018 umgesetzt. Es ist ein Studentenprojekt und für beide Entwickler das erste Tool dieser Grösse.

Das Projekt hat einen insgesamten Wert von 8 ECTS von zwei Studierenden.

<p align="center" style="width: 100%; align: center;">
  <img alt="Prototyp des IMDash" src="http://862341-7.web1.fh-htwchur.ch/img/IMDash.png" style="width: 80%; box-shadow: 0px 0px 40px 0px rgba(0,0,0,0.3);">
</p>

## Technlologien
Das IMDash wurde hauptsächlich in **Javascript** mit dem Single Page Application (SPA) Framework **Vue.js** geschrieben. Die REST-API wurde in **PHP** geschrieben. Die Daten liegen auf einer **MySQL**-Datenbank.

Innerhalb der SPA wurden verschiedene Plugins von Drittentwickler genutzt, die allesamt Open Source sind.

**JavaScript:**
- [jQuery 3.3.1](https://jquery.com/) Unsere JavaScript-Library
- [jQuery UI 1.12.1](https://jqueryui.com/) Für UI-Elemente in der Application
- [popper.js](https://popper.js.org/) Für customized ToolTips
- [packery.js](https://packery.metafizzy.co/) Die Kacheln-Anordnung für das Dashboard
- [draggabilly.js](https://draggabilly.desandro.com/) Fügt die Drag'n'Drop-Funktion hinzu
- [vue.js](https://vuejs.org/) Das SPA Framework
- [vue-router.js](https://router.vuejs.org/) Routet die unterseiten innerhalb der SPA
- [axios.js](https://github.com/axios/axios) Effizientes AJAX-Framework, optimiert für vue.js
- [vue-responsive-grid-layout.js](https://www.npmjs.com/package/vue-responsive-grid-layout) Macht das Dashboard-Layout responsive
- [bootstrap.js](https://getbootstrap.com/) Bootstrap: frontend component library
- [vue-tippy.js](https://github.com/KABBOUCHI/vue-tippy) Vue ToolTips mit vue-bind
- [vue-swatches.js](https://saintplay.github.io/vue-swatches/) Farbenwähler für Vue.js
- [vue-clickaway.js](https://www.npmjs.com/package/vue-clickaway) Fügt einen Event für den Klick ausserhalb des Elementes hinzu
- [vue-instant.browser.js](https://github.com/santiblanko/vue-instant) Benutzerdefinierti Vorschlag-Liste wie bei Google
- [sweet-modal.js](https://sweet-modal.adepto.as/) Modalfenster mit verschiedenenm Inhalt
- [vue-snotify.js](https://github.com/artemsky/vue-snotify) Notification Zentrum für Vue.js
- [vue-tabs.js](https://github.com/spatie/vue-tabs-component) Fügt Tabs zu einer Vue-App ----------
- [vue-star-rating.js](https://jsfiddle.net/craig_h_411/992o7cq5/) Bewerten mit Sternen
- [pdf.js](https://mozilla.github.io/pdf.js/) Rendert PDF-Seiten auf Canvas







Die Entwicklungsumgebung kann lokal eingerichtet werden, die Datenbankdaten werden von einer REST-API gefetcht.

Das Projekt basiert auf Vue.js und kommuniziert mit einer MySQL Datenbank via REST API. Die SPA (Single Page Application) soll später auch offline verfügbar gemacht werden.

### Devtools
Für die Entwicklung mit Vue.js haben wir die Vue Devtools verwendet. Die Electron-App kann mit ``npm install -g @vue/devtools`` installiert und mit dem Kommando ``vue-devtools`` ausgeführt werden.
