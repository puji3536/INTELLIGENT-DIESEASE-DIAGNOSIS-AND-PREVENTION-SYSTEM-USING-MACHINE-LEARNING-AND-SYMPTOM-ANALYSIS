let symptomsList = [];

// Fetch symptoms from Flask API
fetch("http://127.0.0.1:5000/get-symptoms")
    .then(response => response.json())
    .then(data => {
        symptomsList = data;
    })
    .catch(error => console.error("Error loading symptoms:", error));

function filterSymptoms(inputElement) {
    let input = inputElement.value.toLowerCase();
    let dropdown = inputElement.nextElementSibling;
    dropdown.innerHTML = "";

    if (input.length === 0) {
        dropdown.style.display = "none";
        return;
    }

    let filteredSymptoms = symptomsList.filter(symptom => 
        symptom.toLowerCase().includes(input)
    );

    if (filteredSymptoms.length === 0) {
        dropdown.style.display = "none";
        return;
    }

    dropdown.style.display = "block";
    filteredSymptoms.forEach(symptom => {
        let item = document.createElement("div");
        item.classList.add("dropdown-item");
        item.textContent = symptom;
        item.onclick = function() {
            inputElement.value = symptom;
            dropdown.style.display = "none";
        };
        dropdown.appendChild(item);
    });
}

function predictDisease() {
    let resultContainer = document.getElementById("result-container");
    let loadingText = document.getElementById("loading-text");
    loadingText.style.display = "block";
    resultContainer.innerHTML = "";

    let symptoms = Array.from(document.getElementsByClassName("searchInput"))
        .map(input => input.value)
        .filter(value => value.trim() !== "");

    fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symptoms: symptoms })
    })
    .then(response => response.json())
    .then(data => {
        loadingText.style.display = "none";
        displayResults(data);
    })
    .catch(error => {
        console.error("Error:", error);
        loadingText.style.display = "none";
        resultContainer.innerHTML = "<p>Error occurred while predicting.</p>";
    });
}

function displayResults(results) {
    let resultContainer = document.getElementById("result-container");
    resultContainer.innerHTML = "";
    window.predictedResults = results;
    if (!results || results.length === 0) {
        resultContainer.innerHTML = "<p>No disease found. Please check symptoms.</p>";
        return;
    }

    results.forEach((result, index) => {
        let diseaseCard = document.createElement("div");
        diseaseCard.classList.add("disease-card");
        diseaseCard.innerHTML = `
            <h3>${index + 1}. ${result.disease}</h3>
            <p><strong>Causes:</strong> ${result.causes}</p>
            <p><strong>Medications:</strong> ${result.medications}</p>
            <p><strong>Precautions:</strong> ${result.precautions}</p>
            <p><strong>Probability:</strong> ${result.probability}%</p>
            <p><strong>Specialist:</strong> ${result.specialist}</p>
            <p><strong>Tests:</strong> ${result.tests}</p>
            <button onclick="downloadReport(${index})">Download Report</button>
         

        `;
        resultContainer.appendChild(diseaseCard);
    });
}

function clearSelections() {
    document.querySelectorAll('.searchInput').forEach(input => {
        input.value = '';
    });
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.style.display = 'none';
        dropdown.innerHTML = '';
    });
    document.getElementById('result-container').innerHTML = '';
}

function downloadReport(index) {
    if (typeof window.jspdf === "undefined") {
        console.error("jsPDF is not loaded.");
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let result = window.predictedResults[index];
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Medical Report", 105, 15, { align: "center" });

    let y = 30;
    const lineSpacing = 7;
    function addText(text) {
        let splitText = doc.splitTextToSize(text, 180);
        doc.text(15, y, splitText);
        y += splitText.length * lineSpacing;
    }
    function addBoldText(heading, text) {
        doc.setFont("helvetica", "bold");
        doc.text(15, y, heading);
        let headingWidth = doc.getTextWidth(heading) + 2;
        doc.setFont("helvetica", "normal");
        doc.text(15 + headingWidth, y, text);
        y += lineSpacing;
    }

    addText(`Disease: ${result.disease}`);
    addText(`Causes: ${result.causes}`);
    addText(`Medications: ${result.medications}`);
    addText(`Precautions: ${result.precautions}`);
    addText(`Probability: ${result.probability}%`);
    addText(`Specialist: ${result.specialist}`);
    addText(`Tests: ${result.tests}`);
    doc.save(`${result.disease}_Medical_Report.pdf`);
}

