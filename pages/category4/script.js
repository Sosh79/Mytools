// Category 4: DayZ XML Generator Logic

function generateXML(quiet = false) {
    const raw = document.getElementById('classInput').value || '';
    const classes = raw.split(/\r?\n/).filter(l => l.trim().length > 0).map(l => l.trim());

    if (classes.length === 0) {
        document.getElementById('xmlOutput').textContent = '';
        document.getElementById('stats').textContent = '0 items generated';
        return;
    }

    // Get settings
    const vals = {
        nominal: document.getElementById('nominal').value,
        lifetime: document.getElementById('lifetime').value,
        restock: document.getElementById('restock').value,
        min: document.getElementById('min').value,
        quantmin: document.getElementById('quantmin').value,
        quantmax: document.getElementById('quantmax').value,
        cost: document.getElementById('cost').value
    };

    // Get flags
    const flags = {
        cargo: document.getElementById('countInCargo').checked ? '1' : '0',
        hoarder: document.getElementById('countInHoarder').checked ? '1' : '0',
        map: document.getElementById('countInMap').checked ? '1' : '0',
        player: document.getElementById('countInPlayer').checked ? '1' : '0',
        crafted: document.getElementById('crafted').checked ? '1' : '0',
        deloot: document.getElementById('deloot').checked ? '1' : '0'
    };

    // Multi-selects
    const categories = Array.from(document.querySelectorAll('.category-checkbox:checked')).map(cb => cb.value);
    const usages = Array.from(document.querySelectorAll('.usage-checkbox:checked')).map(cb => cb.value);
    const values = Array.from(document.querySelectorAll('.value-checkbox:checked')).map(cb => cb.value);
    const tags = Array.from(document.querySelectorAll('.tag-checkbox:checked')).map(cb => cb.value);

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<types>\n';

    classes.forEach(cls => {
        xml += `    <type name="${cls}">\n`;
        xml += `        <nominal>${vals.nominal}</nominal>\n`;
        xml += `        <lifetime>${vals.lifetime}</lifetime>\n`;
        xml += `        <restock>${vals.restock}</restock>\n`;
        xml += `        <min>${vals.min}</min>\n`;
        xml += `        <quantmin>${vals.quantmin}</quantmin>\n`;
        xml += `        <quantmax>${vals.quantmax}</quantmax>\n`;
        xml += `        <cost>${vals.cost}</cost>\n`;
        xml += `        <flags count_in_cargo="${flags.cargo}" count_in_hoarder="${flags.hoarder}" count_in_map="${flags.map}" count_in_player="${flags.player}" crafted="${flags.crafted}" deloot="${flags.deloot}" />\n`;

        categories.forEach(c => xml += `        <category name="${c}" />\n`);
        usages.forEach(u => xml += `        <usage name="${u}" />\n`);
        values.forEach(v => xml += `        <value name="${v}" />\n`);
        tags.forEach(t => xml += `        <tag name="${t}" />\n`);

        xml += `    </type>\n`;
    });

    xml += '</types>';

    document.getElementById('xmlOutput').textContent = xml;
    document.getElementById('stats').textContent = `${classes.length} item(s) generated`;

    if (!quiet) {
        showMessage('XML generated successfully!', 'success');
    }
}

async function openClassFile() {
    try {
        if (!window.electronAPI || !window.electronAPI.openChatLog) {
            showMessage('Open API not available.', 'error');
            return;
        }
        const result = await window.electronAPI.openChatLog();
        if (!result || result.canceled) return;

        document.getElementById('classInput').value = result.content || '';
        generateXML(true);
        showMessage('File imported', 'success');
    } catch (err) {
        showMessage('Error: ' + err.message, 'error');
    }
}

async function saveXML() {
    const xmlContent = document.getElementById('xmlOutput').textContent;
    if (!xmlContent) {
        showMessage('Nothing to save.', 'error');
        return;
    }

    try {
        const result = await window.electronAPI.saveFile(xmlContent, 'types.xml');
        if (result && !result.canceled) {
            showMessage('types.xml saved!', 'success');
        }
    } catch (err) {
        showMessage('Save failed: ' + err.message, 'error');
    }
}

function copyXML() {
    const xmlContent = document.getElementById('xmlOutput').textContent;
    if (!xmlContent) return;

    navigator.clipboard.writeText(xmlContent).then(() => {
        showMessage('XML copied to clipboard', 'success');
    });
}

function clearAll() {
    document.getElementById('classInput').value = '';
    // Reset defaults
    document.getElementById('nominal').value = '0';
    document.getElementById('lifetime').value = '3888000';
    document.getElementById('restock').value = '0';
    document.getElementById('min').value = '0';
    document.getElementById('quantmin').value = '-1';
    document.getElementById('quantmax').value = '-1';
    document.getElementById('cost').value = '100';

    document.getElementById('countInCargo').checked = false;
    document.getElementById('countInHoarder').checked = false;
    document.getElementById('countInMap').checked = true;
    document.getElementById('countInPlayer').checked = false;
    document.getElementById('crafted').checked = false;
    document.getElementById('deloot').checked = false;

    document.querySelectorAll('input[type="checkbox"]').forEach(i => {
        if (!['countInMap'].includes(i.id)) i.checked = false;
    });

    generateXML(true);
    showMessage('Form cleared', 'success');
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 2500);
}
