<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kintone Scaffold App</title>
    <style>
        /* Global Styles */
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h3, h4 {
            color: #5a2d82;
        }
        .container {
            max-width: 800px;
            margin: auto;
        }
        #scaffold-selector {
            width: 100%;
            padding: 10px;
            font-size: 16px;
        }
        #scaffold-details {
            display: none;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #f9f9f9;
            margin-top: 20px;
        }
        #model-image {
            max-width: 100%;
            border: 1px solid #ccc;
            margin: 10px 0;
        }
        ul {
            padding-left: 20px;
        }
        ul li {
            list-style-type: disc;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Dropdown Menu -->
        <div>
            <label for="scaffold-selector" style="font-size: 16px; font-weight: bold;">Select a Scaffold:</label>
            <select id="scaffold-selector">
                <option value="">-- Select a Scaffold --</option>
            </select>
        </div>

        <!-- Scaffold Details -->
        <div id="scaffold-details">
            <h3>Scaffold Details</h3>
            <p><strong>Dimensions:</strong> <span id="scaffold-dimensions"></span></p>
            <p><strong>Length:</strong> <span id="length"></span> ft</p>
            <p><strong>Width:</strong> <span id="width"></span> ft</p>
            <p><strong>Height:</strong> <span id="height"></span> ft</p>
            <p><strong>Number of Decks:</strong> <span id="decks"></span></p>
            <p><strong>Crew Size:</strong> <span id="crew-size"></span></p>
            <p><strong>Man Hours:</strong> <span id="man-hours"></span></p>
            <h4>Scaffold Model</h4>
            <img id="model-image" src="" alt="Scaffold Model">
            <h4>Material List</h4>
            <ul id="material-list"></ul>
        </div>
    </div>

    <script>
        (function () {
            'use strict';

            // Trigger this script when the record index view is shown
            kintone.events.on('app.record.index.show', async function (event) {
                const APP_ID = kintone.app.getId();
                const dropdown = document.getElementById('scaffold-selector');
                const scaffoldDetails = document.getElementById('scaffold-details');

                // Fetch records from Kintone
                async function fetchRecords() {
                    const response = await kintone.api(kintone.api.url('/k/v1/records', true), 'GET', { app: APP_ID });
                    return response.records;
                }

                // Populate the dropdown
                async function populateDropdown() {
                    const records = await fetchRecords();

                    records.forEach(record => {
                        const option = document.createElement('option');
                        option.value = record['Record number'].value;
                        option.textContent = record['Scaffold Dimensions'].value;
                        dropdown.appendChild(option);
                    });

                    dropdown.addEventListener('change', () => {
                        const selectedRecord = records.find(record => record['Record number'].value === dropdown.value);

                        if (selectedRecord) {
                            scaffoldDetails.style.display = 'block';
                            document.getElementById('scaffold-dimensions').textContent = selectedRecord['Scaffold Dimensions'].value || 'N/A';
                            document.getElementById('length').textContent = selectedRecord['Length (ft)'].value || 'N/A';
                            document.getElementById('width').textContent = selectedRecord['Width (ft)'].value || 'N/A';
                            document.getElementById('height').textContent = selectedRecord['Height (ft)'].value || 'N/A';
                            document.getElementById('decks').textContent = selectedRecord['Number of Decks'].value || 'N/A';
                            document.getElementById('crew-size').textContent = selectedRecord['Crew Size'].value || 'N/A';
                            document.getElementById('man-hours').textContent = selectedRecord['Man Hours'].value || 'N/A';

                            const modelImage = document.getElementById('model-image');
                            modelImage.src = selectedRecord['Scaffold Model'].value || '';
                            modelImage.alt = 'Scaffold Model';

                            const materialList = document.getElementById('material-list');
                            materialList.innerHTML = '';
                            const materials = selectedRecord['Material List'].value.split(',') || [];
                            materials.forEach(material => {
                                const li = document.createElement('li');
                                li.textContent = material.trim();
                                materialList.appendChild(li);
                            });
                        }
                    });
                }

                await populateDropdown();
            });
        })();
    </script>
</body>
</html>
