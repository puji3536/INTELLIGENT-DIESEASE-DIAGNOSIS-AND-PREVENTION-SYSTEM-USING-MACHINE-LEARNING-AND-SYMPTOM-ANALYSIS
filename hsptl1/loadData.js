// Load Patient Data when the page loads
document.addEventListener('DOMContentLoaded', loadPatientData);
const scriptURL = 'https://script.google.com/macros/s/AKfycbzRCJPiF03Zon52EwNH3w31ZPgmGAR6JIV0kaZ3vHuyTaXXIzk22lh8iwKyMHjDuK7gUg/exec';
// Fetch and Load Patient Data
function loadPatientData() {
  fetch(scriptURL + '?action=load')
    .then(response => response.json())
    .then(data => {
      const queueBody = document.getElementById('queueBody');
      queueBody.innerHTML = '';

      data.forEach(patient => {
        const row = `
          <tr id="row-${patient.index}">
            <td>${patient.name}</td>
            <td>${patient.disease}</td>
            <td>${new Date(patient.appointmentDate).toLocaleString()}</td>
            <td>${patient.tokenNumber}</td>
            <td id="status-${patient.index}">${patient.status}</td>
            <td>
              <button onclick="updateStatus(${patient.index})" id="btn-${patient.index}" ${patient.status === 'Checked' ? 'disabled' : ''}>Mark as Checked</button>
            </td>
          </tr>
        `;
        queueBody.innerHTML += row;
      });
    })
    .catch(error => console.error('Error loading data:', error));
}
