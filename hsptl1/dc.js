function loadPatientData() {
    fetch('https://script.google.com/macros/s/AKfycbyql9osCsCkv2d7X1dOsY1SwN8iXCUCBdIIV5K67Zsfzj8aybco3Yhoy2psoRLCFdnwDg/exec')  // Use the correct URL
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse JSON response
        })
        .then(data => {
            var queueBody = document.getElementById('queueBody');
            queueBody.innerHTML = '';
            data.forEach((patient, index) => {
                queueBody.innerHTML += `
                    <tr>
                        <td>${patient.name}</td>
                        <td>${patient.disease}</td>
                        <td>${patient.appointmentDate}</td>
                        <td>${patient.status}</td>
                        <td>
                            ${patient.status === 'Checked' ? '✔️ Checked' : `<button onclick="updateStatus(${index})">Mark as Checked</button>`}
                        </td>
                    </tr>
                `;
            });
        })
        .catch(error => console.error('Error loading patient data:', error));
}

function updateStatus(index) {
    fetch(`https://script.google.com/macros/s/AKfycbxNXo8A1pvKDBYpy4J_y8tRdhWiFNqBzEREfL8GWCi-e32onfOcXWkjv4MG2YzQhQ_iBw/exec?index=${index}&status=Checked`)
        .then(response => response.text())
        .then(message => {
            alert(message);
            loadPatientData(); // Reload data after update
        })
        .catch(error => console.error('Error updating patient status:', error));
}

// Call the loadPatientData function when the page loads
window.onload = loadPatientData;
    
