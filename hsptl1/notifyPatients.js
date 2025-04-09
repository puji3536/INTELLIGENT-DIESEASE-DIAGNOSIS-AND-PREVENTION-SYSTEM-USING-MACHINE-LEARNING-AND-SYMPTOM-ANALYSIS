// Notify Button Click
document.getElementById('notifyBtn').addEventListener('click', notifyPatients);

// Notify Next 3 Pending Patients
function notifyPatients() {
  fetch(scriptURL + '?action=notify')
    .then(response => response.json())
    .then(data => {
      const pendingPatients = data.filter(patient => patient.status === 'Pending').slice(0, 3);

      pendingPatients.forEach(patient => {
        sendNotification(patient);
      });
    })
    .catch(error => console.error('Error notifying patients:', error));
}

// Send Notifications via Email, SMS, and WhatsApp
function sendNotification(patient) {
  let message = `Hello ${patient.name},\nYour appointment for ${patient.disease} is scheduled on ${new Date(patient.appointmentDate).toLocaleString()}.\nToken Number: ${patient.tokenNumber}.`;

  // Simulate Sending SMS / WhatsApp / Email
  alert(`Notification Sent to ${patient.name}`);
  
  sendEmail(patient);
  sendWhatsApp(patient);
}

// Send Email
function sendEmail(patient) {
  fetch('/sendEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: patient.name,
      disease: patient.disease,
      appointmentDate: patient.appointmentDate,
      tokenNumber: patient.tokenNumber,
      email: patient.email
    })
  })
    .then(response => console.log('Email Sent Successfully'))
    .catch(error => console.error('Error sending email:', error));
}

// Send WhatsApp Message (Mock)
function sendWhatsApp(patient) {
  console.log(`WhatsApp message sent to ${patient.name} at ${patient.contactNumber}`);
}
