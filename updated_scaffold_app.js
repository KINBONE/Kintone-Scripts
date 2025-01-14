// Kintone App Configuration
const appId = kintone.app.getId();
const apiToken = 'your-api-token-here'; // Replace with your Kintone API token

// Run script after Kintone loads
(function () {
    'use strict';

    kintone.events.on('app.record.index.show', function (event) {
        // Only run this on the "Display" view
        if (kintone.app.getViewName() !== 'Display') {
            return;
        }

        // Create the dropdown and image elements
        const container = document.createElement('div');
        const dropdown = document.createElement('select');
        dropdown.id = 'scaffold-dropdown';
        dropdown.innerHTML = '<option>- - Select Dimensions - -</option>';

        const image = document.createElement('img');
        image.id = 'scaffold-image';

        // Append to container
        container.appendChild(dropdown);
        container.appendChild(image);
        kintone.app.getHeaderMenuSpaceElement().appendChild(container);

        // Fetch records from Kintone
        fetch(`https://${location.hostname}/k/v1/records.json?app=${appId}`, {
            method: 'GET',
            headers: {
                'X-Cybozu-API-Token': apiToken,
                'Content-Type': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((data) => {
                const records = data.records;
                records.forEach((record) => {
                    const option = document.createElement('option');
                    option.value = record['Record number'].value;
                    option.textContent = record['Scaffold Dimensions'].value;
                    dropdown.appendChild(option);
                });

                // Update image on dropdown change
                dropdown.addEventListener('change', () => {
                    const selectedRecord = records.find(
                        (r) => r['Record number'].value === dropdown.value
                    );

                    if (selectedRecord) {
                        image.src = selectedRecord['Scaffold Model'].value;
                        image.alt = `Image for ${selectedRecord['Scaffold Dimensions'].value}`;
                    } else {
                        image.src = '';
                        image.alt = '';
                    }
                });
            })
            .catch((err) => console.error('Failed to fetch records:', err));
    });
})();
