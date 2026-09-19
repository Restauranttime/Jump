/* ---------------------------------------------------------------------
   Die Anzeigeschicht stilllegen. Das muss NACH dem Spielcode geschehen:
   frage(), sagen() und die uebrigen leben in dessen Gueltigkeitsbereich,
   nicht auf globalThis - eine Zuweisung davor liefe ins Leere, und der
   Wochenablauf haette still auf eine Eingabe gewartet, die im Terminal
   niemand macht. Genau daran haben die ersten Pruefungen gehangen.
   --------------------------------------------------------------------- */
frage = async (o) => (o && o.wahlen) ? 0 : 0;
sagen = async () => 0;
warteKnopf = async () => {};
warteAnsage = async () => {};
warteWahl = async () => 0;
speichern = () => {};
render = () => {};
startseite = () => {};
spielAnzeigen = () => {};
stand = () => {};
