// Category 1: Teleport Generator Logic

let teleportCounter = 0;
let teleports = [];

/**
 * Add a new teleport entry card
 */
function addTeleport(entryData = null) {
    const teleportId = teleportCounter++;
    teleports.push(teleportId);

    const container = document.getElementById('teleportsContainer');
    const teleportDiv = document.createElement('div');
    teleportDiv.className = 'teleport-card glass-card';
    teleportDiv.id = `teleport-${teleportId}`;

    // Default values if no entryData provided
    const data = entryData || {
        EnableTeleport: 1,
        TeleportName: `Teleport_${teleportId + 1}`,
        ObjectType: 'StaticObj_Furniture_radar_panel',
        ObjectCoordinates: [0, 0, 0],
        ObjectOrientation: [0, 0, 0],
        TeleportPosition: [0, 0, 0],
        CheckRadius: 3,
        RequiredItem: '',
        RequiredItemDamagePercent: 0,
        TeleportActiveTimeSeconds: 0,
        TeleportCooldownSeconds: 0,
        MissingItemMessage: 'You need item in your hand to open Teleport!'
    };

    teleportDiv.innerHTML = `
        <div class="teleport-header">
            <h4><span class="nav-icon">📍</span> Entry #${teleportId + 1}</h4>
            <button class="btn-remove" onclick="removeTeleport(${teleportId})">✕ Remove</button>
        </div>
        
        <div class="form-grid" oninput="generateJSON(true)">
            <div class="form-group">
                <label>Status</label>
                <select id="enableTeleport-${teleportId}" class="input-field">
                    <option value="1" ${data.EnableTeleport == 1 ? 'selected' : ''}>Enabled</option>
                    <option value="0" ${data.EnableTeleport == 0 ? 'selected' : ''}>Disabled</option>
                </select>
            </div>

            <div class="form-group">
                <label>Identifier Name</label>
                <input type="text" id="teleportName-${teleportId}" class="input-field" value="${data.TeleportName}">
            </div>

            <div class="form-group full-width">
                <label>Object Type (Classname)</label>
                <input type="text" id="objectType-${teleportId}" class="input-field" value="${data.ObjectType}">
            </div>

            <div class="form-group full-width">
                <label>Object Coordinates (X, Y, Z)</label>
                <div class="coordinate-inputs">
                    <input type="number" id="objCoordX-${teleportId}" class="input-field" value="${data.ObjectCoordinates[0]}" step="any">
                    <input type="number" id="objCoordY-${teleportId}" class="input-field" value="${data.ObjectCoordinates[1]}" step="any">
                    <input type="number" id="objCoordZ-${teleportId}" class="input-field" value="${data.ObjectCoordinates[2]}" step="any">
                </div>
            </div>

            <div class="form-group full-width">
                <label>Object Orientation (Pitch, Yaw, Roll)</label>
                <div class="coordinate-inputs">
                    <input type="number" id="objOrientX-${teleportId}" class="input-field" value="${data.ObjectOrientation[0]}" step="any">
                    <input type="number" id="objOrientY-${teleportId}" class="input-field" value="${data.ObjectOrientation[1]}" step="any">
                    <input type="number" id="objOrientZ-${teleportId}" class="input-field" value="${data.ObjectOrientation[2]}" step="any">
                </div>
            </div>

            <div class="form-group full-width">
                <label>Arrival Position (X, Y, Z)</label>
                <div class="coordinate-inputs">
                    <input type="number" id="tpPosX-${teleportId}" class="input-field" value="${data.TeleportPosition[0]}" step="any">
                    <input type="number" id="tpPosY-${teleportId}" class="input-field" value="${data.TeleportPosition[1]}" step="any">
                    <input type="number" id="tpPosZ-${teleportId}" class="input-field" value="${data.TeleportPosition[2]}" step="any">
                </div>
            </div>

            <div class="form-group">
                <label>Interact Radius</label>
                <input type="number" id="checkRadius-${teleportId}" class="input-field" value="${data.CheckRadius}" step="any">
            </div>

            <div class="form-group">
                <label>Required Item (Optional)</label>
                <input type="text" id="requiredItem-${teleportId}" class="input-field" value="${data.RequiredItem}">
            </div>

            <div class="form-group">
                <label>Item Damage %</label>
                <input type="number" id="requiredItemDamage-${teleportId}" class="input-field" value="${data.RequiredItemDamagePercent}" min="0" max="100">
            </div>

            <div class="form-group">
                <label>Active Time (sec)</label>
                <input type="number" id="activeTime-${teleportId}" class="input-field" value="${data.TeleportActiveTimeSeconds}" min="0">
            </div>

            <div class="form-group">
                <label>Cooldown (sec)</label>
                <input type="number" id="cooldownTime-${teleportId}" class="input-field" value="${data.TeleportCooldownSeconds}" min="0">
            </div>

            <div class="form-group full-width">
                <label>Failure Message</label>
                <input type="text" id="missingItemMsg-${teleportId}" class="input-field" value="${data.MissingItemMessage}">
            </div>
        </div>
    `;

    container.appendChild(teleportDiv);
    if (!entryData) {
        generateJSON(true);
    }
}

/**
 * Remove a teleport entry card
 */
function removeTeleport(teleportId) {
    const element = document.getElementById(`teleport-${teleportId}`);
    if (element) {
        element.remove();
        teleports = teleports.filter(id => id !== teleportId);
        generateJSON(true);
    }
}

/**
 * Generate JSON from current inputs
 * @param {boolean} quiet - If true, doesn't show success message
 */
function generateJSON(quiet = false) {
    const teleportEntries = [];

    teleports.forEach(id => {
        const element = document.getElementById(`teleport-${id}`);
        if (!element) return;

        teleportEntries.push({
            "EnableTeleport": parseInt(document.getElementById(`enableTeleport-${id}`).value),
            "TeleportName": document.getElementById(`teleportName-${id}`).value,
            "ObjectType": document.getElementById(`objectType-${id}`).value,
            "ObjectCoordinates": [
                parseFloat(document.getElementById(`objCoordX-${id}`).value) || 0,
                parseFloat(document.getElementById(`objCoordY-${id}`).value) || 0,
                parseFloat(document.getElementById(`objCoordZ-${id}`).value) || 0
            ],
            "ObjectOrientation": [
                parseFloat(document.getElementById(`objOrientX-${id}`).value) || 0,
                parseFloat(document.getElementById(`objOrientY-${id}`).value) || 0,
                parseFloat(document.getElementById(`objOrientZ-${id}`).value) || 0
            ],
            "TeleportPosition": [
                parseFloat(document.getElementById(`tpPosX-${id}`).value) || 0,
                parseFloat(document.getElementById(`tpPosY-${id}`).value) || 0,
                parseFloat(document.getElementById(`tpPosZ-${id}`).value) || 0
            ],
            "CheckRadius": parseFloat(document.getElementById(`checkRadius-${id}`).value) || 0,
            "RequiredItem": document.getElementById(`requiredItem-${id}`).value,
            "RequiredItemDamagePercent": parseInt(document.getElementById(`requiredItemDamage-${id}`).value) || 0,
            "TeleportActiveTimeSeconds": parseInt(document.getElementById(`activeTime-${id}`).value) || 0,
            "TeleportCooldownSeconds": parseInt(document.getElementById(`cooldownTime-${id}`).value) || 0,
            "MissingItemMessage": document.getElementById(`missingItemMsg-${id}`).value
        });
    });

    const teleportEntry = {
        "TeleportEntries": teleportEntries
    };

    const jsonOutput = document.getElementById('jsonOutput');
    const formattedJSON = JSON.stringify(teleportEntry, null, 2);
    jsonOutput.textContent = formattedJSON;

    if (!quiet) {
        showMessage('JSON synchronized!', 'success');
    }
}

async function saveJSON() {
    generateJSON(true);
    const jsonOutput = document.getElementById('jsonOutput');
    const text = jsonOutput.textContent;

    if (!text || text === '{}' || text === '{\n  "TeleportEntries": []\n}') {
        showMessage('Empty configuration cannot be saved.', 'error');
        return;
    }

    try {
        if (!window.electronAPI || !window.electronAPI.saveFile) {
            showMessage('Save API not available.', 'error');
            return;
        }
        const result = await window.electronAPI.saveFile(text, 'teleports.json');
        if (!result || result.canceled) return;
        if (result.error) {
            showMessage('Save failed: ' + result.error, 'error');
            return;
        }
        showMessage('Configuration saved successfully!', 'success');
    } catch (err) {
        showMessage('Runtime error: ' + err.message, 'error');
    }
}

async function openJSONFile() {
    try {
        if (!window.electronAPI || !window.electronAPI.openChatLog) {
            showMessage('Open API not available.', 'error');
            return;
        }
        const result = await window.electronAPI.openChatLog();
        if (!result || result.canceled) return;
        if (result.error) {
            showMessage('Load failed: ' + result.error, 'error');
            return;
        }

        const content = result.content || '';
        try {
            const data = JSON.parse(content);

            // Clear existing
            document.getElementById('teleportsContainer').innerHTML = '';
            teleports = [];
            teleportCounter = 0;

            if (data.TeleportEntries && Array.isArray(data.TeleportEntries)) {
                data.TeleportEntries.forEach(entry => addTeleport(entry));
                showMessage(`Imported ${data.TeleportEntries.length} entries.`, 'success');
                generateJSON(true);
            } else {
                showMessage('JSON does not contain TeleportEntries.', 'error');
            }
        } catch (parseErr) {
            showMessage('Malformed JSON: ' + parseErr.message, 'error');
        }
    } catch (err) {
        showMessage('Runtime error: ' + err.message, 'error');
    }
}

function copyJSON() {
    const jsonOutput = document.getElementById('jsonOutput');
    const text = jsonOutput.textContent;

    if (!text || text === '') {
        showMessage('Nothing to copy.', 'error');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showMessage('Copied to clipboard!', 'success');
    }).catch(err => {
        showMessage('Clipboard error: ' + err, 'error');
    });
}

function clearForm() {
    if (!confirm('Discard all entries? This cannot be undone.')) return;

    document.getElementById('teleportsContainer').innerHTML = '';
    document.getElementById('jsonOutput').textContent = '';
    teleports = [];
    teleportCounter = 0;

    showMessage('Workspace cleared.', 'success');
    generateJSON(true);
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

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Add first entry automatically
    addTeleport();
});
