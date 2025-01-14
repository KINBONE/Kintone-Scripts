
(function() {
    'use strict';

    // Run when the app's record list is loaded
    kintone.events.on('app.record.index.show', function(event) {
        // Check if the custom view is already added to prevent duplication
        if (document.getElementById('custom-view')) return;

        // Create custom view container
        var customView = document.createElement('div');
        customView.id = 'custom-view';
        customView.style.margin = '20px';

        // Create dropdown filter for dimensions
        var filterDropdown = document.createElement('select');
        filterDropdown.id = 'dimension-filter';
        filterDropdown.style.marginBottom = '10px';
        customView.appendChild(filterDropdown);

        // Placeholder for the scaffold display area
        var scaffoldDisplay = document.createElement('div');
        scaffoldDisplay.id = 'scaffold-display';
        customView.appendChild(scaffoldDisplay);

        // Append the custom view to the Kintone app's main container
        var appContainer = kintone.app.getHeaderSpaceElement();
        appContainer.appendChild(customView);

        // Fetch unique dimensions and populate dropdown
        kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
            app: kintone.app.getId(),
            query: '',
            fields: ['Scaffold Dimensions']
        }).then(function(resp) {
            var uniqueDimensions = [...new Set(resp.records.map(record => record['Scaffold Dimensions'].value))];
            filterDropdown.innerHTML = '<option value="">-- Select Dimensions --</option>';
            uniqueDimensions.forEach(dim => {
                var option = document.createElement('option');
                option.value = dim;
                option.textContent = dim;
                filterDropdown.appendChild(option);
            });
        });

        // Handle dropdown change event to display scaffold details
        filterDropdown.addEventListener('change', function() {
            var selectedDimension = filterDropdown.value;
            if (!selectedDimension) {
                scaffoldDisplay.innerHTML = '<p>Please select a dimension to view scaffolds.</p>';
                return;
            }

            // Fetch records matching the selected dimension
            kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
                app: kintone.app.getId(),
                query: `"Scaffold Dimensions" = "${selectedDimension}"`
            }).then(function(resp) {
                scaffoldDisplay.innerHTML = '';
                resp.records.forEach(record => {
                    var scaffoldCard = document.createElement('div');
                    scaffoldCard.className = 'scaffold-card';

                    // Scaffold Model Image
                    var modelImage = document.createElement('img');
                    modelImage.src = record['Scaffold Model'].value;
                    modelImage.alt = 'Scaffold Model';
                    modelImage.className = 'model-image';
                    scaffoldCard.appendChild(modelImage);

                    // Material List Image
                    var materialImage = document.createElement('img');
                    materialImage.src = record['Material List'].value;
                    materialImage.alt = 'Material List';
                    materialImage.className = 'material-image';
                    scaffoldCard.appendChild(materialImage);

                    // Additional details
                    scaffoldCard.innerHTML += `<p>Length: ${record['Length (ft)'].value} ft</p>`;
                    scaffoldCard.innerHTML += `<p>Width: ${record['Width (ft)'].value} ft</p>`;
                    scaffoldCard.innerHTML += `<p>Height: ${record['Height (ft)'].value} ft</p>`;
                    scaffoldCard.innerHTML += `<p>Number of Decks: ${record['Number of Decks'].value}</p>`;
                    scaffoldCard.innerHTML += `<p>Crew Size: ${record['Crew Size'].value}</p>`;
                    scaffoldCard.innerHTML += `<p>Man Hours: ${record['Man Hours'].value}</p>`;

                    scaffoldDisplay.appendChild(scaffoldCard);
                });
            });
        });
    });
})();
