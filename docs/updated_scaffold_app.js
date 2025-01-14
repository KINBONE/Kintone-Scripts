(function() {
    'use strict';

    const apiToken = 'd1RlQonxULsmOdYCB3DRAx1gj4bPfxHw30furtZd';

    kintone.events.on('app.record.index.show', function(event) {
        const viewName = kintone.app.getHeaderMenuSpaceElement().parentNode.dataset.viewName;
        if (viewName !== 'Display') {
            return;
        }

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

        // Fetch records
        kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
            app: kintone.app.getId(),
            fields: ['Scaffold Dimensions']
        }, { headers: { 'X-Cybozu-API-Token': apiToken } })
        .then(function(resp) {
            console.log('API response:', resp);
            if (resp.records && resp.records.length) {
                const uniqueDimensions = new Set();
                resp.records.forEach(record => {
                    const dimension = record['Scaffold Dimensions']?.value;
                    console.log('Fetched dimension:', dimension);
                    if (dimension) {
                        uniqueDimensions.add(dimension);
                    }
                });
                uniqueDimensions.forEach(dimension => {
                    const option = document.createElement('option');
                    option.value = dimension;
                    option.textContent = dimension;
                    filterDropdown.appendChild(option);
                });
            } else {
                console.log('No records found or "Scaffold Dimensions" is empty.');
            }
        })
        .catch(function(err) {
            console.error('Error fetching records:', err);
        });

        filterDropdown.addEventListener('change', function() {
            const selectedDimension = filterDropdown.value;
            scaffoldDisplay.innerHTML = ''; // Clear previous results

            if (!selectedDimension) return;

            kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
                app: kintone.app.getId(),
                query: `Scaffold Dimensions = "${selectedDimension}"`
            }, { headers: { 'X-Cybozu-API-Token': apiToken } })
            .then(function(resp) {
                console.log('Filtered response:', resp);
                resp.records.forEach(record => {
                    const card = document.createElement('div');
                    card.className = 'scaffold-card';

                    const model = document.createElement('h3');
                    model.textContent = record['Scaffold Model']?.value || 'No Model';
                    card.appendChild(model);

                    const materialImage = document.createElement('img');
                    materialImage.src = record['Material List']?.value || '';
                    materialImage.alt = 'Material List';
                    materialImage.className = 'scaffold-image';
                    card.appendChild(materialImage);

                    const info = document.createElement('p');
                    info.textContent = `Man Hours: ${record['Man Hours']?.value || 'N/A'}, Crew Size: ${record['Crew Size']?.value || 'N/A'}`;
                    card.appendChild(info);

                    scaffoldDisplay.appendChild(card);
                });
            })
            .catch(function(err) {
                console.error('Error fetching filtered records:', err);
            });
        });
    });
})();
