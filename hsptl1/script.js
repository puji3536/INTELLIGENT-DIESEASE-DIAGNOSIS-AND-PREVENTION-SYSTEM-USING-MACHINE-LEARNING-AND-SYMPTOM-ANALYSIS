const doctorMap = {
    "Flu": "Dr. Sharma",
    "Cold": "Dr. Kapoor",
    "Blood Pressure": "Dr. Mehta",
    "Diabetes": "Dr. Verma"
};

function populateDropdown() {
    const diseaseSelect = document.getElementById("disease");
    diseaseSelect.innerHTML = `<option value="" disabled selected>Select Disease</option>` +
        Object.keys(doctorMap)
        .map(disease => `<option value="${disease}">${disease}</option>`)
        .join("");
}

// Update doctor name based on disease selection
function updateDoctor() {
    const disease = document.getElementById("disease").value;
    document.getElementById("doctor").value = doctorMap[disease] || "Not Assigned";
}
function submitToGoogleForm() {
    var name = encodeURIComponent(document.getElementById('name').value);
    var age = encodeURIComponent(document.getElementById('age').value);
    var contact = encodeURIComponent(document.getElementById('contact').value);
    var email = encodeURIComponent(document.getElementById('email').value);
    var disease = encodeURIComponent(document.getElementById('disease').value);
    var doctor = encodeURIComponent(document.getElementById('doctor').value);
    var appointmentDate = encodeURIComponent(document.getElementById('appointmentDate').value);

    // Google Form pre-filled URL with Entry IDs
    var formURL = `https://docs.google.com/forms/d/e/1FAIpQLSe-y7s9zyXn4dKhB2qhAgqPHtkcfwYgopMVgS3wFO8YnYEXyg/viewform?usp=header` +
        `&entry.997935872=${name}` +
        `&entry.1542790566=${contact}` +
        `&entry.1892262874=${email}` +
        `&entry.376208433=${disease}` +
        `&entry.746445863=${appointmentDate}`;

    // Redirect to pre-filled Google Form
    window.open(formURL, '_blank');
}

// Generate the styled PDF
function generatePDF(event) {
    event.preventDefault();
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // 📄 Get form values
    const hospitalName = "Hospital 1";
    const hospitalContact = "+91 98765 43210";
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const contact = document.getElementById("contact").value;
    const email = document.getElementById("email").value;
    const disease = document.getElementById("disease").value;
    const doctor = document.getElementById("doctor").value;
    const appointmentDate = document.getElementById("appointmentDate").value;
    const expectedTime = "10:30 AM"; // Static expected time

    // 🌟 Add header with background color
    doc.setFillColor(200, 220, 255);
    doc.rect(0, 0, 210, 20, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Appointment Details", 10, 15);

    // 🎯 Add Hospital Info
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Hospital: ", 10, 30);
    doc.setFont("helvetica", "normal");
    doc.text(hospitalName, 40, 30);

    doc.setFont("helvetica", "bold");
    doc.text("Contact: ", 10, 40);
    doc.setFont("helvetica", "normal");
    doc.text(hospitalContact, 40, 40);

    // 👩‍⚕️ Patient Info
    doc.setFont("helvetica", "bold");
    doc.text("Patient Name: ", 10, 50);
    doc.setFont("helvetica", "normal");
    doc.text(name, 50, 50);

    doc.setFont("helvetica", "bold");
    doc.text("Age: ", 10, 60);
    doc.setFont("helvetica", "normal");
    doc.text(age, 30, 60);

    doc.setFont("helvetica", "bold");
    doc.text("Contact: ", 10, 70);
    doc.setFont("helvetica", "normal");
    doc.text(contact, 35, 70);

    doc.setFont("helvetica", "bold");
    doc.text("Email: ", 10, 80);
    doc.setFont("helvetica", "normal");
    doc.text(email, 30, 80);

    // 📚 Disease
    doc.setFont("helvetica", "bold");
    doc.text("Disease: ", 10, 90);
    doc.setFont("helvetica", "normal");
    doc.text(disease, 35, 90);

    // 🧑‍⚕️ Doctor Assigned
    doc.setFont("helvetica", "bold");
    doc.text("Doctor Assigned: ", 10, 100);
    doc.setFont("helvetica", "normal");
    doc.text(doctor, 55, 100);

    // 📅 Appointment Date
    doc.setFont("helvetica", "bold");
    doc.text("Appointment Date: ", 10, 110);
    doc.setFont("helvetica", "normal");
    doc.text(appointmentDate, 60, 110);

    // ⏰ Expected Time
    doc.setFont("helvetica", "bold");
    doc.text("Expected Time: ", 10, 120);
    doc.setFont("helvetica", "normal");
    doc.text(expectedTime, 45, 120);

    // 📄 Footer with page number
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, 180, 290);
    }

    // 🎉 Save the PDF
    doc.save("appointment_details.pdf");
    submitToGoogleForm();
}

// Populate the dropdown when the page loads
window.onload = function () {
    populateDropdown();
};
