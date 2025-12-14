// Category 4 - DayZ XML Generator

function goBack() {
    navigateToPage('home');
}

async function openClassFile() {
    try {
        if (!window.electronAPI || !window.electronAPI.openChatLog) {
            showMessage('Open File is not available in this build.', 'error');
            return;
        }
        const result = await window.electronAPI.openChatLog();
        if (!result || result.canceled) return;
        if (result.error) {
            showMessage('Failed to open file: ' + result.error, 'error');
            return;
        }
        const textarea = document.getElementById('classInput');
        textarea.value = result.content || '';
        const name = (result.filePath || '').split(/[/\\]/).pop() || 'file';
        showMessage('Loaded ' + name, 'success');
    } catch (err) {
        showMessage('Error: ' + err, 'error');
    }
}

function generateXML() {
    const raw = document.getElementById('classInput').value || '';
    const classes = raw.split(/\r?\n/).filter(l => l.trim().length > 0).map(l => l.trim());

    if (classes.length === 0) {
        showMessage('Please enter at least one class name', 'error');
        return;
    }

    // Get settings
    const nominal = document.getElementById('nominal').value;
    const lifetime = document.getElementById('lifetime').value;
    const restock = document.getElementById('restock').value;
    const min = document.getElementById('min').value;
    const quantmin = document.getElementById('quantmin').value;
    const quantmax = document.getElementById('quantmax').value;
    const cost = document.getElementById('cost').value;

    // Get flags
    const countInCargo = document.getElementById('countInCargo').checked ? '1' : '0';
    const countInHoarder = document.getElementById('countInHoarder').checked ? '1' : '0';
    const countInMap = document.getElementById('countInMap').checked ? '1' : '0';
    const countInPlayer = document.getElementById('countInPlayer').checked ? '1' : '0';
    const crafted = document.getElementById('crafted').checked ? '1' : '0';
    const deloot = document.getElementById('deloot').checked ? '1' : '0';

    // Get selected options
    const selectedCategories = Array.from(document.querySelectorAll('.category-checkbox:checked')).map(cb => cb.value);
    const selectedUsages = Array.from(document.querySelectorAll('.usage-checkbox:checked')).map(cb => cb.value);
    const selectedValues = Array.from(document.querySelectorAll('.value-checkbox:checked')).map(cb => cb.value);
    const selectedTags = Array.from(document.querySelectorAll('.tag-checkbox:checked')).map(cb => cb.value);

    // Build XML
    let xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n<types>\n';

    for (const cls of classes) {
        xml += `    <type name="${cls}">\n`;
        xml += `        <nominal>${nominal}</nominal>\n`;
        xml += `        <lifetime>${lifetime}</lifetime>\n`;
        xml += `        <restock>${restock}</restock>\n`;
        xml += `        <min>${min}</min>\n`;
        xml += `        <quantmin>${quantmin}</quantmin>\n`;
        xml += `        <quantmax>${quantmax}</quantmax>\n`;
        xml += `        <cost>${cost}</cost>\n`;
        xml += `        <flags count_in_cargo="${countInCargo}" count_in_hoarder="${countInHoarder}" count_in_map="${countInMap}" count_in_player="${countInPlayer}" crafted="${crafted}" deloot="${deloot}" />\n`;

        // Add categories
        for (const category of selectedCategories) {
            xml += `        <category name="${category}" />\n`;
        }

        // Add usages
        for (const usage of selectedUsages) {
            xml += `        <usage name="${usage}" />\n`;
        }

        // Add values
        for (const value of selectedValues) {
            xml += `        <value name="${value}" />\n`;
        }

        // Add tags
        for (const tag of selectedTags) {
            xml += `        <tag name="${tag}" />\n`;
        }

        xml += `    </type>\n`;
    }

    xml += '</types>';

    document.getElementById('xmlOutput').textContent = xml;
    document.getElementById('stats').textContent = `Generated ${classes.length} item(s)`;
    showMessage('XML generated successfully!', 'success');
}

async function saveXML() {
    const xmlOutput = document.getElementById('xmlOutput').textContent;

    if (!xmlOutput || xmlOutput.trim() === '') {
        showMessage('Please generate XML first!', 'error');
        return;
    }

    try {
        if (!window.electronAPI || !window.electronAPI.saveFile) {
            showMessage('Save File is not available in this build.', 'error');
            return;
        }
        const result = await window.electronAPI.saveFile(xmlOutput, 'items.xml');
        if (!result || result.canceled) return;
        if (result.error) {
            showMessage('Failed to save file: ' + result.error, 'error');
            return;
        }
        showMessage('XML saved successfully!', 'success');
    } catch (err) {
        showMessage('Error: ' + err, 'error');
    }
}

function copyXML() {
    const xmlOutput = document.getElementById('xmlOutput').textContent;

    if (!xmlOutput || xmlOutput.trim() === '') {
        showMessage('Please generate XML first!', 'error');
        return;
    }

    navigator.clipboard.writeText(xmlOutput).then(() => {
        showMessage('XML copied to clipboard!', 'success');
    }).catch(err => {
        showMessage('Failed to copy: ' + err, 'error');
    });
}

function clearAll() {
    document.getElementById('classInput').value = '';
    document.getElementById('xmlOutput').textContent = '';
    document.getElementById('stats').textContent = '';
    // Reset to defaults
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
    // Uncheck all options
    document.querySelectorAll('.category-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('.usage-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('.value-checkbox').forEach(cb => cb.checked = false);
    document.querySelectorAll('.tag-checkbox').forEach(cb => cb.checked = false);
}

function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.textContent = message;

    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);

    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Page initialization
document.addEventListener('DOMContentLoaded', () => {
    console.log('Category 4 - DayZ XML Generator loaded');
});
