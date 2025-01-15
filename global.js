(function () {
  'use strict';

  // Constants for your app setup
  const APP_ID = 4; // Your app ID
  const SOURCE_VIEW_ID = 20; // View ID to fetch data from
  const TARGET_VIEW_ID = 9311; // View ID to display data
  const client = new KintoneRestAPIClient(); // Initialize Kintone REST API client

  /**
   * Fetch records from View ID 20
   * @returns {Promise<Array>} - Array of fetched records
   */
  const fetchRecordsFromView = async () => {
    try {
      // Use the Kintone REST API to get records from the source view
      const response = await client.record.getRecords({
        app: APP_ID,
        query: `viewId = ${SOURCE_VIEW_ID}`, // Filter records by View ID 20
      });
      return response.records;
    } catch (error) {
      console.error('Error fetching records:', error);
      throw new Error('Failed to fetch records. Please check the view ID or API settings.');
    }
  };

  /**
   * Generate HTML for the table
   * @param {Array} records - Array of records fetched from Kintone
   * @returns {string} - HTML string for the table
   */
  const generateTableHTML = (records) => {
    if (!records.length) {
      return '<p>No data found for this view.</p>';
    }

    // Construct table header
    const tableHeader = `
      <thead>
        <tr>
          <th>Record Number</th>
          <th>Scaffold Dimensions</th>
          <th>Other Fields</th>
        </tr>
      </thead>
    `;

    // Construct table body
    const tableBody = records
      .map((record) => {
        // Dynamically populate fields for each record
        const otherFields = Object.keys(record)
          .filter((key) => key !== 'Record_number' && key !== 'Scaffold_Dimensions')
          .map((key) => `<strong>${key}</strong>: ${record[key].value || 'N/A'}`)
          .join('<br>');

        return `
          <tr>
            <td>${record.Record_number.value || 'N/A'}</td>
            <td>${record.Scaffold_Dimensions.value || 'N/A'}</td>
            <td>${otherFields}</td>
          </tr>
        `;
      })
      .join('');

    return `
      <table class="modern-table">
        ${tableHeader}
        <tbody>
          ${tableBody}
        </tbody>
      </table>
    `;
  };

  /**
   * Render table in the target view (View ID 9311)
   */
  const renderTable = async () => {
    const container = document.getElementById('container');
    if (!container) {
      console.error('Container element not found.');
      return;
    }

    try {
      const records = await fetchRecordsFromView(); // Fetch records
      container.innerHTML = generateTableHTML(records); // Insert table HTML
    } catch (error) {
      container.innerHTML = '<p>Error loading data. Please try again later.</p>';
    }
  };

  /**
   * Kintone event handler for custom view rendering
   * @param {Object} event - Kintone event object
   * @returns {Object} - Event object
   */
  const customViewHandler = (event) => {
    if (event.viewId === TARGET_VIEW_ID) {
      renderTable(); // Render table when the target view is shown
    }
    return event;
  };

  // Attach event listener
  kintone.events.on('app.record.index.show', customViewHandler);
})();