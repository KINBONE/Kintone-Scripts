(function () {
    'use strict';

    // Global style and interaction changes
    kintone.events.on(['app.record.index.show', 'app.record.create.show', 'app.record.edit.show'], function (event) {
        // Add custom CSS to the page
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://kinbone.github.io/Kintone-Scripts/global.css'; // Replace with your GitHub Pages CSS file
        document.head.appendChild(link);

        // Additional dynamic logic for the "View" screen
        if (event.type === 'app.record.index.show') {
            const records = event.records;

            // Modify the scaffold display for each record
            records.forEach((record) => {
                const scaffoldDimensions = record['Scaffold Dimensions'].value;
                const scaffoldModel = record['Scaffold Model'].value;
                const materialList = record['Material List'].value;

                const container = document.createElement('div');
                container.style.border = '1px solid #ccc';
                container.style.padding = '20px';
                container.style.marginBottom = '20px';
                container.style.borderRadius = '8px';
                container.style.backgroundColor = '#fff';

                const title = document.createElement('h3');
                title.textContent = `Scaffold: ${scaffoldDimensions}`;
                title.style.color = '#5a2d82';

                const image = document.createElement('img');
                image.src = scaffoldModel;
                image.alt = `Scaffold Model - ${scaffoldDimensions}`;
                image.style.maxWidth = '100%';
                image.style.marginTop = '10px';
                image.style.borderRadius = '8px';

                const list = document.createElement('ul');
                materialList.split('\n').forEach((item) => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    list.appendChild(li);
                });

                container.appendChild(title);
                container.appendChild(image);
                container.appendChild(list);

                // Append to the main view
                document.querySelector('.gaia-argoui-app-index').appendChild(container);
            });
        }
    });
})();
