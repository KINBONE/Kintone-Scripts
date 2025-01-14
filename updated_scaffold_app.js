(function() {
    'use strict';

    // Event: App Record List Page Loaded
    kintone.events.on('app.record.index.show', function(event) {
        // Only apply this customization to the "Display" view
        const viewName = kintone.app.getHeaderMenuSpaceElement().parentNode.dataset.viewName;
        if (viewName !== 'Display') {
            return;
        }

        // DOM Elements
        const customViewSpace = document.createElement('div');
        customViewSpace.id = 'custom-view';
        const filterDropdown = document.createElement('select');
        filterDropdown.id = 'dimension-filter';
        filterDropdown.innerHTML = '<option value="">-- Select Dimensions --</option>';

        const scaffoldDisplay = document.createElement('div');
        scaffoldDisplay.id = 'scaffold-display';
        
        customViewSpace.appendChild(filterDropdown);
        customViewSpace.appendChild(scaffoldDisplay);
        kintone.app.getHeaderSpaceElement().appendChild(customViewSpace);

        // Fetch unique dimensions and populate dropdown
        kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
            app: kintone.app.getId(),
            fields: ['Scaffold Dimensions'],
            query: ''
        }).then(function(resp) {
            const uniqueDimensions = new Set();
            resp.records.forEach(record => {
                if (record['Scaffold Dimensions'].value) {
                    uniqueDimensions.add(record['Scaffold Dimensions'].value);
                }
            });
            uniqueDimensions.forEach(dimension => {
                const option = document.createElement('option');
                option.value = dimension;
                option.textContent = dimension;
                filterDropdown.appendChild(option);
            });
        }).catch(function(err) {
            console.error('Error fetching records:', err);
        });

        // Handle filter changes
        filterDropdown.addEventListener('change', function() {
            const selectedDimension = filterDropdown.value;
            scaffoldDisplay.innerHTML = ''; // Clear previous results

            if (!selectedDimension) return; // Do nothing if no dimension is selected

            // Fetch records matching the selected dimension
            kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
                app: kintone.app.getId(),
                query: `Scaffold Dimensions = "${selectedDimension}"`
            }).then(function(resp) {
                resp.records.forEach(record => {
                    const card = document.createElement('div');
                    card.className = 'scaffold-card';

                    // Populate card details
                    card.innerHTML = `
                        <h3>${record['Scaffold Dimensions'].value}</h3>
                        <p><strong>Length:</strong> ${record['Length (ft)'].value} ft</p>
                        <p><strong>Width:</strong> ${record['Width (ft)'].value} ft</p>
                        <p><strong>Height:</strong> ${record['Height (ft)'].value} ft</p>
                        <p><strong>Decks:</strong> ${record['number of Decks'].value}</p>
                        <p><strong>Crew Size:</strong> ${record['Crew Size'].value}</p>
                        <p><strong>Man Hours:</strong> ${record['Man Hours'].value}</p>
                        <img class="model-image" src="${record['Scaffold Model'].value}" alt="Scaffold Model">
                        <img class="material-image" src="${record['Material List'].value}" alt="Material List">
                    `;

                    scaffoldDisplay.appendChild(card);
                });
            }).catch(function(err) {
                console.error('Error fetching filtered records:', err);
            });
        });
    });
})();
