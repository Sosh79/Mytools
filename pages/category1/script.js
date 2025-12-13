// Category 1 page logic

function goBack() {
    navigateToPage('home');
}

let teleportCounter = 0;
let teleports = [];

// Add a new teleport entry
function addTeleport() {
    const teleportId = teleportCounter++;
    teleports.push(teleportId);

    const container = document.getElementById('teleportsContainer');
    const teleportDiv = document.createElement('div');
    teleportDiv.className = 'teleport-card';
    teleportDiv.id = `teleport-${teleportId}`;

    teleportDiv.innerHTML = `
        <div class="teleport-header">
            <h4>Teleport Entry ${teleportId + 1}</h4>
            <button class="btn-remove" onclick="removeTeleport(${teleportId})">✕ Remove</button>
        </div>
        
        <div class="form-grid">
            <div class="form-group">
                <label>Enable Teleport</label>
                <select id="enableTeleport-${teleportId}" class="input-field">
                    <option value="1">Enabled (1)</option>
                    <option value="0">Disabled (0)</option>
                </select>
            </div>

            <div class="form-group">
                <label>Teleport Name</label>
                <input type="text" id="teleportName-${teleportId}" class="input-field" placeholder="Trade_TO_ArenaBlueTeam" value="Teleport_${teleportId + 1}">
            </div>

            <div class="form-group full-width">
                <label>Object Type</label>
                <input type="text" id="objectType-${teleportId}" class="input-field" placeholder="StaticObj_Furniture_radar_panel" value="StaticObj_Furniture_radar_panel">
            </div>

            <div class="form-group full-width">
                <label>Object Coordinates [X, Y, Z]</label>
                <div class="coordinate-inputs">
                    <input type="number" id="objCoordX-${teleportId}" class="input-field" placeholder="X" value="0" step="any">
                    <input type="number" id="objCoordY-${teleportId}" class="input-field" placeholder="Y" value="0" step="any">
                    <input type="number" id="objCoordZ-${teleportId}" class="input-field" placeholder="Z" value="0" step="any">
                </div>
            </div>

            <div class="form-group full-width">
                <label>Object Orientation [X, Y, Z]</label>
                <div class="coordinate-inputs">
                    <input type="number" id="objOrientX-${teleportId}" class="input-field" placeholder="X" value="0" step="any">
                    <input type="number" id="objOrientY-${teleportId}" class="input-field" placeholder="Y" value="0" step="any">
                    <input type="number" id="objOrientZ-${teleportId}" class="input-field" placeholder="Z" value="0" step="any">
                </div>
            </div>

            <div class="form-group full-width">
                <label>Teleport Position [X, Y, Z]</label>
                <div class="coordinate-inputs">
                    <input type="number" id="tpPosX-${teleportId}" class="input-field" placeholder="X" value="0" step="any">
                    <input type="number" id="tpPosY-${teleportId}" class="input-field" placeholder="Y" value="0" step="any">
                    <input type="number" id="tpPosZ-${teleportId}" class="input-field" placeholder="Z" value="0" step="any">
                </div>
            </div>

            <div class="form-group">
                <label>Check Radius</label>
                <input type="number" id="checkRadius-${teleportId}" class="input-field" placeholder="3" value="3" step="any">
            </div>

            <div class="form-group">
                <label>Required Item</label>
                <input type="text" id="requiredItem-${teleportId}" class="input-field" placeholder="DLT_Paintball_Mask_Classic_Blue" value="">
            </div>

            <div class="form-group">
                <label>Required Item Damage %</label>
                <input type="number" id="requiredItemDamage-${teleportId}" class="input-field" placeholder="0" value="0" min="0" max="100">
            </div>

            <div class="form-group">
                <label>Teleport Active Time (seconds)</label>
                <input type="number" id="activeTime-${teleportId}" class="input-field" placeholder="0" value="0" min="0">
            </div>

            <div class="form-group">
                <label>Teleport Cooldown (seconds)</label>
                <input type="number" id="cooldownTime-${teleportId}" class="input-field" placeholder="0" value="0" min="0">
            </div>

            <div class="form-group full-width">
                <label>Missing Item Message</label>
                <input type="text" id="missingItemMsg-${teleportId}" class="input-field" placeholder="You need item in your hand to open Teleport!" value="">
            </div>
        </div>
    `;

    container.appendChild(teleportDiv);
    showMessage('Teleport entry added!', 'success');
}

// Remove a teleport entry
function removeTeleport(teleportId) {
    const element = document.getElementById(`teleport-${teleportId}`);
    if (element) {
        element.remove();
        teleports = teleports.filter(id => id !== teleportId);
        showMessage('Teleport entry removed!', 'success');
    }
}

// Teleport Entry Generator Functions
function generateJSON() {
    const teleportEntries = [];

    teleports.forEach(id => {
        const element = document.getElementById(`teleport-${id}`);
        if (!element) return;

        teleportEntries.push({
            "EnableTeleport": parseInt(document.getElementById(`enableTeleport-${id}`).value),
            "TeleportName": document.getElementById(`teleportName-${id}`).value,
            "ObjectType": document.getElementById(`objectType-${id}`).value,
            "ObjectCoordinates": [
                parseFloat(document.getElementById(`objCoordX-${id}`).value),
                parseFloat(document.getElementById(`objCoordY-${id}`).value),
                parseFloat(document.getElementById(`objCoordZ-${id}`).value)
            ],
            "ObjectOrientation": [
                parseFloat(document.getElementById(`objOrientX-${id}`).value),
                parseFloat(document.getElementById(`objOrientY-${id}`).value),
                parseFloat(document.getElementById(`objOrientZ-${id}`).value)
            ],
            "TeleportPosition": [
                parseFloat(document.getElementById(`tpPosX-${id}`).value),
                parseFloat(document.getElementById(`tpPosY-${id}`).value),
                parseFloat(document.getElementById(`tpPosZ-${id}`).value)
            ],
            "CheckRadius": parseFloat(document.getElementById(`checkRadius-${id}`).value),
            "RequiredItem": document.getElementById(`requiredItem-${id}`).value,
            "RequiredItemDamagePercent": parseInt(document.getElementById(`requiredItemDamage-${id}`).value),
            "TeleportActiveTimeSeconds": parseInt(document.getElementById(`activeTime-${id}`).value),
            "TeleportCooldownSeconds": parseInt(document.getElementById(`cooldownTime-${id}`).value),
            "MissingItemMessage": document.getElementById(`missingItemMsg-${id}`).value
        });
    });

    const teleportEntry = {
        "TeleportEntries": teleportEntries
    };

    const jsonOutput = document.getElementById('jsonOutput');
    const formattedJSON = JSON.stringify(teleportEntry, null, 2);
    jsonOutput.textContent = formattedJSON;

    showMessage('JSON generated successfully!', 'success');
}

async function saveJSON() {
    const jsonOutput = document.getElementById('jsonOutput');
    const text = jsonOutput.textContent;

    if (!text || text.trim() === '') {
        showMessage('Please generate JSON first!', 'error');
        return;
    }

    try {
        if (!window.electronAPI || !window.electronAPI.saveFile) {
            showMessage('Save File is not available in this build.', 'error');
            return;
        }
        const result = await window.electronAPI.saveFile(text, 'teleports.json');
        if (!result || result.canceled) return;
        if (result.error) {
            showMessage('Failed to save file: ' + result.error, 'error');
            return;
        }
        showMessage('JSON saved successfully!', 'success');
    } catch (err) {
        showMessage('Error: ' + err, 'error');
    }
}

async function openJSONFile() {
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

        const content = result.content || '';
        try {
            const data = JSON.parse(content);

            // Clear existing entries
            document.getElementById('teleportsContainer').innerHTML = '';
            document.getElementById('jsonOutput').textContent = '';
            teleports = [];
            teleportCounter = 0;

            // Load TeleportEntries if available
            if (data.TeleportEntries && Array.isArray(data.TeleportEntries)) {
                data.TeleportEntries.forEach(entry => {
                    const teleportId = teleportCounter++;
                    teleports.push(teleportId);

                    const container = document.getElementById('teleportsContainer');
                    const teleportDiv = document.createElement('div');
                    teleportDiv.className = 'teleport-card';
                    teleportDiv.id = `teleport-${teleportId}`;

                    teleportDiv.innerHTML = `
                        <div class="teleport-header">
                            <h4>Teleport Entry ${teleportId + 1}</h4>
                            <button class="btn-remove" onclick="removeTeleport(${teleportId})">✕ Remove</button>
                        </div>
                        
                        <div class="form-grid">
                            <div class="form-group">
                                <label>Enable Teleport</label>
                                <select id="enableTeleport-${teleportId}" class="input-field">
                                    <option value="1">Enabled (1)</option>
                                    <option value="0">Disabled (0)</option>
                                </select>
                            </div>

                            <div class="form-group">
                                <label>Teleport Name</label>
                                <input type="text" id="teleportName-${teleportId}" class="input-field" placeholder="Trade_TO_ArenaBlueTeam" value="Teleport_${teleportId + 1}">
                            </div>

                            <div class="form-group full-width">
                                <label>Object Type</label>
                                <input type="text" id="objectType-${teleportId}" class="input-field" placeholder="StaticObj_Furniture_radar_panel" value="StaticObj_Furniture_radar_panel">
                            </div>

                            <div class="form-group full-width">
                                <label>Object Coordinates [X, Y, Z]</label>
                                <div class="coordinate-inputs">
                                    <input type="number" id="objCoordX-${teleportId}" class="input-field" placeholder="X" value="0" step="any">
                                    <input type="number" id="objCoordY-${teleportId}" class="input-field" placeholder="Y" value="0" step="any">
                                    <input type="number" id="objCoordZ-${teleportId}" class="input-field" placeholder="Z" value="0" step="any">
                                </div>
                            </div>

                            <div class="form-group full-width">
                                <label>Object Orientation [X, Y, Z]</label>
                                <div class="coordinate-inputs">
                                    <input type="number" id="objOrientX-${teleportId}" class="input-field" placeholder="X" value="0" step="any">
                                    <input type="number" id="objOrientY-${teleportId}" class="input-field" placeholder="Y" value="0" step="any">
                                    <input type="number" id="objOrientZ-${teleportId}" class="input-field" placeholder="Z" value="0" step="any">
                                </div>
                            </div>

                            <div class="form-group full-width">
                                <label>Teleport Position [X, Y, Z]</label>
                                <div class="coordinate-inputs">
                                    <input type="number" id="tpPosX-${teleportId}" class="input-field" placeholder="X" value="0" step="any">
                                    <input type="number" id="tpPosY-${teleportId}" class="input-field" placeholder="Y" value="0" step="any">
                                    <input type="number" id="tpPosZ-${teleportId}" class="input-field" placeholder="Z" value="0" step="any">
                                </div>
                            </div>

                            <div class="form-group">
                                <label>Check Radius</label>
                                <input type="number" id="checkRadius-${teleportId}" class="input-field" placeholder="3" value="3" step="any">
                            </div>

                            <div class="form-group">
                                <label>Required Item</label>
                                <input type="text" id="requiredItem-${teleportId}" class="input-field" placeholder="DLT_Paintball_Mask_Classic_Blue" value="">
                            </div>

                            <div class="form-group">
                                <label>Required Item Damage %</label>
                                <input type="number" id="requiredItemDamage-${teleportId}" class="input-field" placeholder="0" value="0" min="0" max="100">
                            </div>

                            <div class="form-group">
                                <label>Teleport Active Time (seconds)</label>
                                <input type="number" id="activeTime-${teleportId}" class="input-field" placeholder="0" value="0" min="0">
                            </div>

                            <div class="form-group">
                                <label>Teleport Cooldown (seconds)</label>
                                <input type="number" id="cooldownTime-${teleportId}" class="input-field" placeholder="0" value="0" min="0">
                            </div>

                            <div class="form-group full-width">
                                <label>Missing Item Message</label>
                                <input type="text" id="missingItemMsg-${teleportId}" class="input-field" placeholder="You need item in your hand to open Teleport!" value="">
                            </div>
                        </div>
                    `;

                    container.appendChild(teleportDiv);

                    // Fill values from JSON
                    document.getElementById(`enableTeleport-${teleportId}`).value = entry.EnableTeleport || 1;
                    document.getElementById(`teleportName-${teleportId}`).value = entry.TeleportName || '';
                    document.getElementById(`objectType-${teleportId}`).value = entry.ObjectType || '';

                    if (entry.ObjectCoordinates && Array.isArray(entry.ObjectCoordinates)) {
                        document.getElementById(`objCoordX-${teleportId}`).value = entry.ObjectCoordinates[0] || 0;
                        document.getElementById(`objCoordY-${teleportId}`).value = entry.ObjectCoordinates[1] || 0;
                        document.getElementById(`objCoordZ-${teleportId}`).value = entry.ObjectCoordinates[2] || 0;
                    }

                    if (entry.ObjectOrientation && Array.isArray(entry.ObjectOrientation)) {
                        document.getElementById(`objOrientX-${teleportId}`).value = entry.ObjectOrientation[0] || 0;
                        document.getElementById(`objOrientY-${teleportId}`).value = entry.ObjectOrientation[1] || 0;
                        document.getElementById(`objOrientZ-${teleportId}`).value = entry.ObjectOrientation[2] || 0;
                    }

                    if (entry.TeleportPosition && Array.isArray(entry.TeleportPosition)) {
                        document.getElementById(`tpPosX-${teleportId}`).value = entry.TeleportPosition[0] || 0;
                        document.getElementById(`tpPosY-${teleportId}`).value = entry.TeleportPosition[1] || 0;
                        document.getElementById(`tpPosZ-${teleportId}`).value = entry.TeleportPosition[2] || 0;
                    }

                    document.getElementById(`checkRadius-${teleportId}`).value = entry.CheckRadius || 3;
                    document.getElementById(`requiredItem-${teleportId}`).value = entry.RequiredItem || '';
                    document.getElementById(`requiredItemDamage-${teleportId}`).value = entry.RequiredItemDamagePercent || 0;
                    document.getElementById(`activeTime-${teleportId}`).value = entry.TeleportActiveTimeSeconds || 0;
                    document.getElementById(`cooldownTime-${teleportId}`).value = entry.TeleportCooldownSeconds || 0;
                    document.getElementById(`missingItemMsg-${teleportId}`).value = entry.MissingItemMessage || '';
                });

                const name = (result.filePath || '').split(/[/\\]/).pop() || 'JSON file';
                showMessage(`Loaded ${data.TeleportEntries.length} entries from ${name}`, 'success');
            } else {
                showMessage('Invalid JSON format. Expected TeleportEntries array.', 'error');
            }
        } catch (parseErr) {
            showMessage('Failed to parse JSON: ' + parseErr.message, 'error');
        }
    } catch (err) {
        showMessage('Error: ' + err, 'error');
    }
}

function copyJSON() {
    const jsonOutput = document.getElementById('jsonOutput');
    const text = jsonOutput.textContent;

    if (!text || text.trim() === '') {
        showMessage('Please generate JSON first!', 'error');
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showMessage('JSON copied to clipboard!', 'success');
    }).catch(err => {
        showMessage('Failed to copy: ' + err, 'error');
    });
}

function clearForm() {
    if (!confirm('Are you sure you want to clear all teleport entries?')) return;

    document.getElementById('teleportsContainer').innerHTML = '';
    document.getElementById('jsonOutput').textContent = '';
    teleports = [];
    teleportCounter = 0;

    showMessage('All cleared!', 'success');
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
    console.log('Category 1 page loaded');

    // Add one default teleport entry
    addTeleport();
});
