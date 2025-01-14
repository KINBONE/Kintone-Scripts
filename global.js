/* eslint-disable vars-on-top */
(function () {
  'use strict';

  // Constants for app and custom view
  var APP_ID = 4; // Your Kintone App ID
  var CUSTOM_VIEW_ID = 20; // Your Custom View ID

  var client = new KintoneRestAPIClient({}); // Initialize Kintone REST API Client

  /**
   * Fetch all records from the app
   * @return {Promise} - Returns a promise with all records
   */
  function fetchAllRecords() {
    var query = ''; // Define any query conditions here if needed
    return client.record.getAllRecords({ app: APP_ID, query: query });
  }

  /**
   * Populate data into the custom view
   * @param {Array} records - Records fetched from Kintone
   */
  function populateCustomView(records) {
    var container = document.getElementById('custom-view-container');
    if (!container) return;

    // Clear existing content
    container.innerHTML = '';

    // Build table structure
    var table = document.createElement('table');
    table.style.width = '100%';
    table.style.borderCollapse = 'collapse';

    // Add table header
    var headerRow = document.createElement('tr');
    var headers = [
      'Record Number',
      'Scaffold Dimensions',
      'Length (ft)',
      'Width (ft)',
      'Height (ft)',
      'Number of Decks',
      'Scaffold Model',
      'Material List',
      'Man Hours',
      'Crew Size',
    ];

    headers.forEach(function (header) {
      var th = document.createElement('th');
      th.textContent = header;
      th.style.border = '1px solid #ccc';
      th.style.padding = '8px';
      th.style.backgroundColor = '#f4f4f4';
      th.style.textAlign = 'left';
      table.appendChild(headerRow);
      headerRow.appendChild(th);
    });

    // Add data rows
    records.forEach(function (record) {
      var row = document.createElement('tr');
      var fields = [
        record['Record number'].value,
        record['Scaffold Dimensions'].value,
        record['Length (ft)'].value,
        record['Width (ft)'].value,
        record['Height (ft)'].value,
        record['Number of Decks'].value,
        record['Scaffold Model'].value,
        record['Material List'].value,
        record['Man Hours'].value,
        record['Crew Size'].value,
      ];

      fields.forEach(function (field) {
        var td = document.createElement('td');
        td.textContent = field || '-';
        td.style.border = '1px solid #ccc';
        td.style.padding = '8px';
        row.appendChild(td);
      });

      table.appendChild(row);
    });

    container.appendChild(table);
  }

  /**
   * Event handler for app.record.index.show
   * @param {Object} event - kintone event object
   */
  function indexShowHandler(event) {
    if (event.viewId !== CUSTOM_VIEW_ID) {
      return event; // Exit if not the custom view
    }

    // Fetch records and populate the custom view
    fetchAllRecords()
      .then(function (records) {
        populateCustomView(records);
      })
      .catch(function (error) {
        console.error('Error fetching records:', error);
      });

    return event;
  }

  // Attach event handler to app.record.index.show
  kintone.events.on('app.record.index.show', indexShowHandler);
})();
