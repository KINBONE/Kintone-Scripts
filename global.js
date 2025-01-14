(function() {
    "use strict";

    // Kintone Event Listener for the custom view
    kintone.events.on('app.record.index.show', async function(event) {
        const apiToken = 'd1RlQonxULsmOdYCB3DRAx1gj4bPfxHw30furtZd'; // Your API token
        const appId = 4; // Your App ID
        const url = `https://g6dtxg679agk.kintone.com/k/v1/records.json?app=${appId}`;

        const headers = {
            'X-Cybozu-API-Token': apiToken,
            'Content-Type': 'application/json',
        };

        try {
            const response = await fetch(url, { headers });
            const data = await response.json();

            if (!data.records || data.records.length === 0) {
                console.log("No records found");
                return;
            }

            // Get the table body element where records will be populated
            const tableContainer = document.getElementById("scaffold-data");
            if (!tableContainer) {
                console.error("Table container not found in the DOM");
                return;
            }

            // Clear existing table rows
            tableContainer.innerHTML = "";

            // Populate table rows with Kintone records
            data.records.forEach(record => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td>${record["Record number"].value}</td>
                    <td>${record["Scaffold Dimensions"].value}</td>
                    <td>${record["Length (ft)"].value}</td>
                    <td>${record["Width (ft)"].value}</td>
                    <td>${record["Height (ft)"].value}</td>
                    <td>${record["Number of Decks"].value}</td>
                    <td>${record["Crew Size"].value}</td>
                    <td>${record["Man Hours"].value}</td>
                    <td>${record["Scaffold Model"].value}</td>
                    <td>${record["Material List"].value}</td>
                `;

                tableContainer.appendChild(row);
            });

        } catch (error) {
            console.error("Error fetching Kintone records:", error);
        }
    });
})();
