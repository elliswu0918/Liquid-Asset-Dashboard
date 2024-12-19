async function fetchAssetTransactions() {
    const assetId = document.getElementById('assetId').value.trim();
    const apiUrl = `https://blockstream.info/liquid/api/asset/${assetId}/txs`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Server error! Status: ${response.status}`);
        }
        const transactions = await response.json();
        buildTopology(transactions);
        document.getElementById('dashboard').style.display = 'block';
    } catch (error) {
        alert(`Error fetching data: ${error.message}`);
    }
}

function buildTopology(transactions) {
    const container = document.getElementById('network');
    container.innerHTML = ''; // Clear previous topology

    const cy = cytoscape({
        container: container,
        elements: [],
        style: [
            {
                selector: 'node',
                style: {
                    'background-color': '#00adb5',
                    'label': 'data(id)',
                    'color': '#fff',
                    'text-wrap': 'wrap',
                    'text-max-width': '100px',
                    'font-size': '10px'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 2,
                    'line-color': '#ff5722',
                    'target-arrow-color': '#ff5722',
                    'target-arrow-shape': 'triangle'
                }
            }
        ],
        layout: {
            name: 'cose',
            idealEdgeLength: 100,
            nodeOverlap: 20,
            fit: true,
            padding: 30
        }
    });

    transactions.forEach(tx => {
        if (!cy.getElementById(tx.txid).length) {
            cy.add({ group: 'nodes', data: { id: tx.txid } });
        }

        tx.vin.forEach(input => {
            if (input.txid && !cy.getElementById(input.txid).length) {
                cy.add({ group: 'nodes', data: { id: input.txid } });
            }
            if (input.txid && !cy.getElementById(`${input.txid}->${tx.txid}`).length) {
                cy.add({
                    group: 'edges',
                    data: {
                        id: `${input.txid}->${tx.txid}`,
                        source: input.txid,
                        target: tx.txid
                    }
                });
            }
        });
    });

    cy.on('tap', 'node', async function(evt) {
        const nodeId = evt.target.id();
        const apiUrl = `https://blockstream.info/liquid/api/tx/${nodeId}`;
        cy.nodes().style('background-color', '#00adb5');
        evt.target.style('background-color', '#ff0000');

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch transaction data: ${response.status}`);
            }
            const details = await response.json();
            showNodeDetails(details);
        } catch (error) {
            console.error(`Error fetching transaction data: ${error.message}`);
        }
    });

    cy.layout({ name: 'cose', idealEdgeLength: 100, nodeOverlap: 20, fit: true, padding: 30 }).run();
}

function showNodeDetails(details) {
    const tableBody = document.getElementById('nodeDetailsTable');
    tableBody.innerHTML = '';
    ['size', 'weight', 'fee'].forEach(key => {
        if (details[key] !== undefined) {
            const row = document.createElement('tr');
            const fieldCell = document.createElement('td');
            const valueCell = document.createElement('td');
            fieldCell.textContent = key;
            valueCell.textContent = details[key];
            row.appendChild(fieldCell);
            row.appendChild(valueCell);
            tableBody.appendChild(row);
        }
    });
    document.getElementById('details').style.display = 'block';
}
