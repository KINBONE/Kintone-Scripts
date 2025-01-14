(function () {
    'use strict';

    // Event: Runs only on the "Display" view
    kintone.events.on('app.record.index.show', function (event) {
        // Ensure we are on the "Display" view
        if (kintone.app.getViewName() !== 'Display') {
            return;
        }

        // Select elements from the Custom View HTML
        const dropdown = document.getElementById('scaffold-dropdown');
        const image = document.getElementById('scaffold-image');
        const materialList = document.getElementById('material-list');

        // Fetch records from Kintone
        fetch('https://g6dtxg679agk.kintone.com/k/v1/records.json?app=4', {
            method: 'GET',
            headers: {
                'X-Cybozu-API-Token': 'd1RlQonxULsmOdYCB3DRAx1gj4bPfxHw30furtZd',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                const records = data.records;

                // Populate dropdown with scaffold dimensions
                records.forEach((record) => {
                    const option = document.createElement('option');
                    option.value = record['Record number'].value; // Use record number as the key
                    option.textContent = record['Scaffold Dimensions'].value;
                    dropdown.appendChild(option);
                });

                // Event: On dropdown change, update image and material list
                dropdown.addEventListener('change', () => {
                    const selectedRecord = records.find(
                        (record) => record['Record number'].value === dropdown.value
                    );

                    // Update image
                    if (selectedRecord && selectedRecord['Scaffold Model'].value) {
                        image.src = selectedRecord['Scaffold Model'].value;
                        image.alt = `Scaffold Model for ${selectedRecord['Scaffold Dimensions'].value}`;
                        image.style.display = 'block';
                    } else {
                        image.src = '';
                        image.alt = '';
                        image.style.display = 'none';
                    }

                    // Update material list
                    materialList.innerHTML = '';
                    if (selectedRecord && selectedRecord['Material List'].value) {
                        const materials = selectedRecord['Material List'].value.split('\n');
                        materials.forEach((material) => {
                            const li = document.createElement('li');
                            li.textContent = material;
                            materialList.appendChild(li);
                        });
                    }
                });
            })
            .catch((error) => {
                console.error('Error fetching Kintone records:', error);
            });
    });
})();
