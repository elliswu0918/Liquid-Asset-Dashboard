let alertedTransactions = new Set(); 

function clearAlert() {
    document.getElementById('alertBox').style.display = 'none';
}

async function fetchAssetTransactions() {
    const assetId = document.getElementById('assetId').value.trim();
    const apiUrl = `https://blockstream.info/liquid/api/asset/${assetId}/txs`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Server error! Status: ${response.status}`);
        const transactions = await response.json();
        buildTopology(transactions);
        document.getElementById('dashboard').style.display = 'block';
    } catch (error) {
        showAlert(`Error fetching data: ${error.message}`);
    }
}

function buildTopology(transactions) {
    const container = document.getElementById('network');
    container.innerHTML = '';

    const cy = cytoscape({
        container: container,
        elements: [],
        style: [
            {
                selector: 'node',
                style: { 'background-color': '#00adb5', 'label': 'data(id)', 'color': '#fff', 'font-size': '10px' }
            },
            {
                selector: 'edge',
                style: { 'width': 2, 'line-color': '#ff5722', 'target-arrow-color': '#ff5722', 'target-arrow-shape': 'triangle' }
            }
        ],
        layout: { name: 'cose', idealEdgeLength: 100, nodeOverlap: 20, fit: true, padding: 30 }
    });

    transactions.forEach(tx => {
        addTransaction(cy, tx);
        checkAlerts(tx);
    });

    cy.on('tap', 'node', async function(evt) {
        const nodeId = evt.target.id();
        const apiUrl = `https://blockstream.info/liquid/api/tx/${nodeId}`;
        cy.nodes().style('background-color', '#00adb5');
        evt.target.style('background-color', '#ff0000');

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Failed to fetch transaction data: ${response.status}`);
            const details = await response.json();
            showNodeDetails(details);
        } catch (error) {
            showAlert(`Error fetching transaction data: ${error.message}`);
        }
    });

    cy.layout({ name: 'cose', idealEdgeLength: 100, nodeOverlap: 20, fit: true, padding: 30 }).run();
}

function addTransaction(cy, tx) {
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
                data: { id: `${input.txid}->${tx.txid}`, source: input.txid, target: tx.txid }
            });
        }
    });
}

function checkAlerts(tx) {
    const amountThreshold = parseFloat(document.getElementById('amountThreshold').value);
    const feeThreshold = parseInt(document.getElementById('feeThreshold').value);

    if (alertedTransactions.has(tx.txid)) return;

    if (tx.fee > feeThreshold) {
        showAlert(`High Fee Alert! Transaction ${tx.txid} has a fee of ${tx.fee} satoshis.`);
        alertedTransactions.add(tx.txid);
    }
}

function showAlert(message) {
    const alertBox = document.getElementById('alertBox');
    alertBox.textContent = message;
    alertBox.style.display = 'block';
}

function showNodeDetails(details) {
    const tableBody = document.getElementById('nodeDetailsTable');
    tableBody.innerHTML = '';
    ['size', 'weight', 'fee'].forEach(key => {
        if (details[key] !== undefined) {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${key}</td><td>${details[key]}</td>`;
            tableBody.appendChild(row);
        }
    });
    document.getElementById('details').style.display = 'block';
}
