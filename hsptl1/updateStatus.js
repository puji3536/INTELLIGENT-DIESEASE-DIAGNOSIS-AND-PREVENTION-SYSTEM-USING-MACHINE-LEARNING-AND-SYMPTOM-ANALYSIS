// Update Status of Patient and Mark as Checked

function updateStatus(index) {
    fetch(scriptURL + `?action=update&row=${rowNumber}`, {
      method: 'POST'
    })
      .then(response => {
        if (response.ok) {
          document.getElementById(`status-${index}`).innerText = 'Checked';
          document.getElementById(`btn-${index}`).disabled = true;
          alert('Status updated successfully!');
        } else {
          alert('Failed to update status!');
        }
      })
      .catch(error => console.error('Error updating status:', error));
  }
  