(function() {
    "use strict";

    // Run this function when the custom view (view ID: 20) is loaded
    kintone.events.on('app.record.index.show', function(event) {
        const viewId = event.viewId;
        
        // Check if we are in the correct view (ID: 20)
        if (viewId !== 20) {
            return;
        }

        // Fetch all records from the app
        const appId = kintone.app.getId();
        const query = ''; // Fetch all records
        const limit = 100; // Max records per request

        kintone.api(kintone.api.url('/k/v1/records', true), 'GET', {
            app: appId,
            query: query,
            fields: [
                'Record number', 
                'Scaffold Dimensions', 
                'Length (ft)', 
                'Width (ft)', 
                'Height (ft)', 
                'Number of Decks', 
                'Crew Size', 
                'Man Hours', 
                'Scaffold Model', 
                'Material List'
            ],
            totalCount: true,
            size: limit
        }).then(function(response) {
            const records = response.records;

            // Get the table body element
            const tableBody = document.getElementById('scaffold-data');
            if (!tableBody) {
                console.error('Table body element not found');
                return;
            }

            // Clear existing table data
            tableBody.innerHTML = '';

            // Populate the table with records
            records.forEach(record => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${record['Record number'].value || '-'}</td>
                    <td>${record['Scaffold Dimensions'].value || '-'}</td>
                    <td>${record['Length (ft)'].value || '-'}</td>
                    <td>${record['Width (ft)'].value || '-'}</td>
                    <td>${record['Height (ft)'].value || '-'}</td>
                    <td>${record['Number of Decks'].value || '-'}</td>
                    <td>${record['Crew Size'].value || '-'}</td>
                    <td>${record['Man Hours'].value || '-'}</td>
                    <td>${record['Scaffold Model'].value || '-'}</td>
                    <td>${record['Material List'].value || '-'}</td>
                `;
                tableBody.appendChild(row);
            });
        }).catch(function(error) {
            console.error('Failed to fetch records:', error);
        });
    });
})();
