document.addEventListener("DOMContentLoaded", function () {
    const diseaseDropdown = document.getElementById("disease");
    const stateDropdown = document.getElementById("state");
    const districtDropdown = document.getElementById("district");

    // Fetch diseases on page load
    fetch("/get-diseases")
        .then(response => response.json())
        .then(data => {
            populateDropdown(diseaseDropdown, data, "--Select Disease--");
        })
        .catch(error => console.error("Error loading diseases:", error));

    // Fetch states when a disease is selected
    diseaseDropdown.addEventListener("change", function () {
        const selectedDisease = diseaseDropdown.value;
        if (!selectedDisease) return;

        fetch(`/get-states?disease=${selectedDisease}`)
            .then(response => response.json())
            .then(data => {
                populateDropdown(stateDropdown, data, "--Select State--");
                stateDropdown.disabled = false;
            })
            .catch(error => console.error("Error loading states:", error));
    });

    // Fetch districts when a state is selected
    stateDropdown.addEventListener("change", function () {
        const selectedState = stateDropdown.value;
        if (!selectedState) return;

        fetch(`/get-districts?state=${selectedState}`)
            .then(response => response.json())
            .then(data => {
                populateDropdown(districtDropdown, data, "--Select District--");
                districtDropdown.disabled = false;
            })
            .catch(error => console.error("Error loading districts:", error));
    });

    // Fetch hospitals when the button is clicked
    document.getElementById("fetch-hospitals").addEventListener("click", function () {
        const disease = diseaseDropdown.value;
        const state = stateDropdown.value;
        const district = districtDropdown.value;

        if (!disease || !state || !district) {
            alert("Please select disease, state, and district.");
            return;
        }

        fetch(`/find-hospitals?disease=${disease}&state=${state}&district=${district}`)
            .then(response => response.json())
            .then(data => {
                displayHospitals(data);
            })
            .catch(error => console.error("Error fetching hospitals:", error));
    });
});

// Function to populate dropdown
function populateDropdown(dropdown, data, defaultText) {
    dropdown.innerHTML = `<option value="">${defaultText}</option>`;
    data.forEach(item => {
        let option = document.createElement("option");
        option.value = item;
        option.textContent = item;
        dropdown.appendChild(option);
    });
}
fetch(`/find-hospitals?disease=${disease}&state=${state}&district=${district}`)
    .then(response => response.json())
    .then(data => {
        console.log("Hospitals Data:", data);  // Check returned data
        displayHospitals(data);
    })
    .catch(error => console.error("Error fetching hospitals:", error));

// Function to display hospitals
// Function to display hospitals
function displayHospitals(data) {
    const hospitalsContainer = document.getElementById("hospitals-container");
    hospitalsContainer.innerHTML = "";

    if (data.length === 0) {
        hospitalsContainer.innerHTML = "<p>No hospitals found.</p>";
    } else {
        data.forEach(hospital => {
            const hospitalDiv = document.createElement("div");
            hospitalDiv.className = "hospital-entry";

            // Hospital Name
            const nameElement = document.createElement("span");
            nameElement.textContent = hospital.name;
            hospitalDiv.appendChild(nameElement);

            // Map Link
            if (hospital.link) {
                const mapLink = document.createElement("a");
                mapLink.href = hospital.link;
                mapLink.target = "_blank";
                mapLink.textContent = " View on Map";
                mapLink.style.marginLeft = "10px";
                hospitalDiv.appendChild(mapLink);
            }

            // Registration Link
            if (hospital.register_link) {
                const registerLink = document.createElement("a");
                registerLink.href = hospital.register_link;
                registerLink.target = "_blank";
                registerLink.textContent = " Register for Token";
                registerLink.style.marginLeft = "10px";
                hospitalDiv.appendChild(registerLink);
            }

            hospitalsContainer.appendChild(hospitalDiv);
        });
    }
}
