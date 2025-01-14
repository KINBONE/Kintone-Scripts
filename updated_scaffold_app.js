(function() {
    'use strict';

    // API Token
    const apiToken = 'd1RlQonxULsmOdYCB3DRAx1gj4bPfxHw30furtZd';

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
        }, { headers: { 'X-Cybozu-API-Token': apiToken } }).then(function(resp) {
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
            }, { headers: { 'X-Cybozu-API-Token': apiToken } }).then(function(resp) {
                resp.records.forEach(record => {
                    const card = document.createElement('div');
                    card.className = 'scaffold-card';

                    // Scaffold Model
                    const model = document.createElement('h3');
                    model.textContent = record['Scaffold Model'].value;
                    card.appendChild(model);

                    // Material List Image
                    const materialImage = document.createElement('img');
                    materialImage.src = record['Material List'].value;
                    materialImage.alt = 'Material List';
                    materialImage.className = 'scaffold-image';
                    card.appendChild(materialImage);

                    // Man Hours and Crew Size
                    const info = document.createElement('p');
                    info.textContent = `Man Hours: ${record['Man Hours'].value}, Crew Size: ${record['Crew Size'].value}`;
                    card.appendChild(info);

                    scaffoldDisplay.appendChild(card);
                });
            }).catch(function(err) {
                console.error('Error fetching records:', err);
            });
        });
    });
})();
