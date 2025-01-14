(function () {
    'use strict';

    // Run this script only on the "Display" view
    kintone.events.on('app.record.index.show', function (event) {
        if (kintone.app.getViewName() !== 'Display') {
            return;
        }

        // Avoid duplicate elements
        if (document.getElementById('scaffold-container')) {
            return;
        }

        // Create container for UI
        const container = document.createElement('div');
        container.id = 'scaffold-container';
        container.style.margin = '20px';
        container.style.textAlign = 'center';

        // Create dropdown
        const dropdown = document.createElement('select');
        dropdown.id = 'scaffold-dropdown';
        dropdown.style.marginBottom = '20px';
        dropdown.style.padding = '10px';
        dropdown.style.fontSize = '16px';
        dropdown.innerHTML = '<option value="">- - Select Dimensions - -</option>';

        // Create image display
        const image = document.createElement('img');
        image.id = 'scaffold-image';
        image.style.display = 'none'; // Hidden by default
        image.style.maxWidth = '80%';
        image.style.border = '2px solid #ccc';
        image.style.borderRadius = '8px';
        image.style.marginTop = '20px';

        // Append elements to the container
        container.appendChild(dropdown);
        container.appendChild(image);

        // Inject container into Kintone header menu space
        kintone.app.getHeaderMenuSpaceElement().appendChild(container);

        // Fetch records from Kintone and populate dropdown
        fetch(`https://${location.hostname}/k/v1/records.json?app=${kintone.app.getId()}`, {
            method: 'GET',
            headers: {
                'X-Cybozu-API-Token': 'your-api-token-here', // Replace with your actual API token
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                const records = data.records;

                // Populate dropdown with dimensions
                records.forEach((record) => {
                    const option = document.createElement('option');
                    option.value = record['Record number'].value;
                    option.textContent = record['Scaffold Dimensions'].value;
                    dropdown.appendChild(option);
                });

                // Update image on dropdown change
                dropdown.addEventListener('change', () => {
                    const selectedRecord = records.find(
                        (record) => record['Record number'].value === dropdown.value
                    );

                    if (selectedRecord && selectedRecord['Scaffold Model'].value) {
                        image.src = selectedRecord['Scaffold Model'].value;
                        image.alt = `Scaffold Model for ${selectedRecord['Scaffold Dimensions'].value}`;
                        image.style.display = 'block';
                    } else {
                        image.src = '';
                        image.alt = '';
                        image.style.display = 'none';
                    }
                });
            })
            .catch((error) => {
                console.error('Error fetching Kintone records:', error);
            });
    });
})();
