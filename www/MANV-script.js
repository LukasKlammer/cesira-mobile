let ongoingNumber;
let names = [];
let triageCategories = [];
loadFromLocalStorage(); // wenn localStorage gefüllt ist holt sich diese Funktion die Daten daraus

function addPatient() { // gesichteten Patienten speichern

    if (findTriageCategory() != 'notPossible') { // Ablauf wird erst dann gestartet, wenn mindestens eine Checkbox angeklickt wurde und damit die Triagierung gemacht werden kann
        ongoingNumber = +document.getElementById('patient-number').innerHTML; // liest die bestehende Patientennummer aus - wird im HTML Teil initial auf 1 gesetzt
        let name = document.getElementById('patient-name').value; // Liest den Namen aus dem Feld (sofern einer eingegeben wurde)

        names[ongoingNumber] = name; // Array an der Stelle der Patienten-Nummer mit entsprechendem Name beschreiben
        triageCategories[ongoingNumber] = findTriageCategory(); // hier wird Triage-Kategorie gesucht und ins Array an der Position der aktuellen Patientennummer geschrieben
        showAndGenerateOverlay(); // Pop-Up overlay aufrufen
        resetInput(); // Eingabefelder und Checkboxen reseten
        updateOngoingNumber(); // checkt ab, welche Nummer der nächste Patient haben soll. Schaut sich dazu die Länge des Arrays an
        renderDataOutput();
        saveToLocalStorage();
    }

    else {
        alert('Mindestens eine Angabe zum Patienten-Zustand muss ausgewählt werden.')
    }
}

function findTriageCategory() { // diese Funktion sucht automatisch nach der richtigen Sichtungs-Kategorie (abhängig von Auswahl Checkboxen)

    if (document.getElementById('save-dead-signs').checked == true) {
        return 'Schwarz';
    }
    else if (document.getElementById('unconscious').checked == true) {
        return 'Rot';
    }
    else if (document.getElementById('bleeding').checked == true) {
        return 'Rot';
    }
    else if (document.getElementById('shock').checked == true) {
        return 'Rot';
    }
    else if (document.getElementById('breathing').checked == true) {
        return 'Rot';
    }
    else if (document.getElementById('fractures').checked == true) {
        return 'Gelb';
    }
    else if (document.getElementById('other').checked == true) {
        return 'Gelb';
    }
    else if (document.getElementById('walkable').checked == true) {
        return 'Grün';
    }
    else {
        return 'notPossible';
    }
}

function resetInput() { // alle Eingabefelder und Checkboxen wieder auf Ausgangswerte setzen
    document.getElementById('patient-name').value = '';
    document.getElementById('walkable').checked = false;
    document.getElementById('unconscious').checked = false;
    document.getElementById('bleeding').checked = false;
    document.getElementById('shock').checked = false;
    document.getElementById('breathing').checked = false;
    document.getElementById('fractures').checked = false;
    document.getElementById('other').checked = false;
    document.getElementById('save-dead-signs').checked = false;
}

function renderDataOutput() { // wird aufgerufen, sobald body neu geladen, Patient hinzugefügt oder Patient entfernt wird
    updateCountPatients(); // Patientenzahlen in der Übersichts-Tabelle updaten
    writeList(); // Patientenliste ausgeben

    updateOngoingNumber();
}

function writeList() { // Patientenliste ausgeben
    document.getElementById('patient-list').innerHTML = '';

    for (let i = 1; i < triageCategories.length; i++) {
        document.getElementById('patient-list').innerHTML += /*html*/ `<li id="patient-item-${i}">laufende Nummer  ${i}, ${names[i]}, <b>${triageCategories[i]}</b> <button onclick="deletePatient(${i})"> Patient ${i} löschen</button></li>`;
        colorListItems(i);
    }
}

function colorListItems(i) { // färbt die Patienten-Items in der Liste nach ihrer Triage-Kategorie
    if (triageCategories[i] == 'Schwarz') {
        document.getElementById('patient-item-' + i).classList.add('bg-black');
    }
    else if (triageCategories[i] == 'Rot') {
        document.getElementById('patient-item-' + i).classList.add('bg-red');
    }
    else if (triageCategories[i] == 'Gelb') {
        document.getElementById('patient-item-' + i).classList.add('bg-yellow');
    }
    else if (triageCategories[i] == 'Grün') {
        document.getElementById('patient-item-' + i).classList.add('bg-green');
    }
    else if (triageCategories[i] == 'Weiß') {
        document.getElementById('patient-item-' + i).classList.add('bg-white');
    }

}

function updateCountPatients() { // berechnet die Patientenanzahl neu und schreibt die Werte in die Tabelle
    let sumBlack = 0; // zuerst die Anzahl auf 0 setzen, damit von vorne gezählt werden kann
    let sumRed = 0;
    let sumYellow = 0;
    let sumGreen = 0;
    let sumWhite = 0;

    for (let i = 1; i < triageCategories.length; i++) { // durchläuft das Array triageCategories und "zählt" die Anzahl der jeweiligen Farb-Namen
        if (triageCategories[i] == 'Schwarz') {
            sumBlack++;
        }
        else if (triageCategories[i] == 'Rot') {
            sumRed++;
        }
        else if (triageCategories[i] == 'Gelb') {
            sumYellow++;
        }
        else if (triageCategories[i] == 'Grün') {
            sumGreen++;
        }
        else if (triageCategories[i] == 'Weiß') {
            sumWhite++;
        }
    }

    document.getElementById('quantity-red').innerHTML = sumRed; // legt die Anzahl Rot in der Tabelle neu fest
    document.getElementById('quantity-yellow').innerHTML = sumYellow;
    document.getElementById('quantity-green').innerHTML = sumGreen;
    document.getElementById('quantity-black').innerHTML = sumBlack;
    document.getElementById('quantity-white').innerHTML = sumWhite;
}

function updateOngoingNumber() { // über Länge des Arrays kann die nächste "freie" Nummer gesucht werden
    if (triageCategories.length > 1) { // wird erst dann erhöht, wenn mindestens bereits 1 Element ins Array an die Stelle 1 (damit wird Array 2 Stellen lang) geschrieben wird
        document.getElementById('patient-number').innerHTML = triageCategories.length;
    }

}

function deletePatient(position) { // Patient aus dem Array löschen; muss danach Liste neu schreiben, Patientenanzahl neu berechnen, laufende Nummer neu herausfinden
    if (position == 1) {
        deleteCompleteStorage();
    } else {
        names.splice(position, 1);
        triageCategories.splice(position, 1);
        updateOngoingNumber(); // checkt ab, welche Nummer der nächste Patient haben soll. Schaut sich dazu die Länge des Arrays an
        renderDataOutput();
        saveToLocalStorage();
    }


}

function showAndGenerateOverlay() { // Popup-Overlay generieren und öffnen
    setBackgroundInfoTriage(); // Hintergrundfarbe der Anweisung "Triage-Kategorie" anpassen - sollen "sprechende" Farben sein
    document.getElementById('info-triage-color').innerHTML = `mit ${triageCategories[ongoingNumber]} kennzeichnen!`; // Text-Ausgabe, mit welcher Farbe der Patient zu kennzeichnen ist
    document.getElementById('overlay').classList.remove('d-none');
}

function hideAndResetOverlay() { // Popup-Overlay schließen
    document.getElementById('overlay').classList.add('d-none');
    document.getElementById('info-triage-color').innerHTML = ''; // Info-Feld leeren
    resetBackgroundInfoTriage(); // Hintergrundfarbe des Info-Felds wieder entfernen, damit sie im nächsten Aufruf wieder neu eingestellt werden kann
}

function setBackgroundInfoTriage() { // Hintergrundfarbe der Anweisung "Triage-Kategorie" anpassen - sollen "sprechende" Farben sein
    if (triageCategories[ongoingNumber] == 'Rot') {
        document.getElementById('info-triage-color').classList.add('bg-red');
    }
    else if (triageCategories[ongoingNumber] == 'Gelb') {
        document.getElementById('info-triage-color').classList.add('bg-yellow');
    }
    else if (triageCategories[ongoingNumber] == 'Grün') {
        document.getElementById('info-triage-color').classList.add('bg-green');
    }
    else if (triageCategories[ongoingNumber] == 'Schwarz') {
        document.getElementById('info-triage-color').classList.add('bg-black');
    }
    else if (triageCategories[ongoingNumber] == 'Weiß') {
        document.getElementById('info-triage-color').classList.add('bg-white');
    }
    else {
        alert('Nicht definiert! Fehler!');
    }
}

function resetBackgroundInfoTriage() { // Hintergrundfarbe des Info-Felds wieder entfernen, damit sie im nächsten Aufruf wieder neu eingestellt werden kann
    document.getElementById('info-triage-color').className = '';
    document.getElementById('info-triage-color').classList.add('info-triage-color');
}

function saveToLocalStorage() { // in den lokalen Speicher speichern
    let namesAsText = JSON.stringify(names); // Array in Text umwandeln
    localStorage.setItem('names', namesAsText); // Text in localStorage speichern unter dem KEY "names"
    let triageCategoriesAsText = JSON.stringify(triageCategories);
    localStorage.setItem('triageCategories', triageCategoriesAsText);
}

function loadFromLocalStorage() {
    let namesAsText = localStorage.getItem('names'); // Text aus localStorage holen, KEY ist names
    let triageCategoriesAsText = localStorage.getItem('triageCategories');

    if (namesAsText && triageCategoriesAsText) {
        names = JSON.parse(namesAsText); // Text in Array umwandeln - Array names belegen mit Werten aus Speicher
        triageCategories = JSON.parse(triageCategoriesAsText);
    }

}

function deleteCompleteStorage() {
    localStorage.removeItem('names');
    localStorage.removeItem('triageCategories');
    names = [];
    triageCategories = [];
    document.getElementById('patient-number').innerHTML = '1';
    updateCountPatients(); // Patientenzahlen in der Übersichts-Tabelle updaten
    writeList(); // Patientenliste ausgeben
}
