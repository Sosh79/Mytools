// Category 2: Zone Spawn System Logic

let zoneCounter = 0;
let zones = [];

/**
 * Add a new spawn zone card
 */
function addZone(zoneData = null) {
    const zoneId = zoneCounter++;
    const zoneObj = {
        id: zoneId,
        spawnPoints: []
    };
    zones.push(zoneObj);

    const zonesContainer = document.getElementById('zonesContainer');
    const zoneDiv = document.createElement('div');
    zoneDiv.className = 'zone-card glass-card';
    zoneDiv.id = `zone-${zoneId}`;

    const data = zoneData || {
        name: `Pulkovo_${zoneId + 1}`,
        enabled: 1,
        position: "4896.86 319.26 5683.65",
        triggerRadius: 150,
        spawnChance: 1.0,
        despawnOnExit: 1,
        despawnDistance: 150,
        respawnCooldown: 300,
        spawnPoints: []
    };

    zoneDiv.innerHTML = `
        <div class="zone-header">
            <h4><span class="nav-icon">🛡️</span> Zone: ${data.name}</h4>
            <button class="btn-remove" onclick="removeZone(${zoneId})">✕ Remove Zone</button>
        </div>
        
        <div class="form-grid" oninput="generateJSON(true)">
            <div class="form-group">
                <label>Zone Name</label>
                <input type="text" id="zoneName-${zoneId}" class="input-field" value="${data.name}">
            </div>
            
            <div class="form-group">
                <label>Status</label>
                <select id="zoneEnabled-${zoneId}" class="input-field">
                    <option value="1" ${data.enabled == 1 ? 'selected' : ''}>Enabled</option>
                    <option value="0" ${data.enabled == 0 ? 'selected' : ''}>Disabled</option>
                </select>
            </div>
            
            <div class="form-group full-width">
                <label>Center Position (X Y Z)</label>
                <input type="text" id="zonePosition-${zoneId}" class="input-field" value="${data.position}">
            </div>
            
            <div class="form-group">
                <label>Trigger Radius</label>
                <input type="number" id="zoneTriggerRadius-${zoneId}" class="input-field" value="${data.triggerRadius}" step="any">
            </div>
            
            <div class="form-group">
                <label>Spawn Chance (0-1)</label>
                <input type="number" id="zoneSpawnChance-${zoneId}" class="input-field" value="${data.spawnChance}" min="0" max="1" step="0.1">
            </div>
            
            <div class="form-group">
                <label>Despawn On Exit</label>
                <select id="zoneDespawnOnExit-${zoneId}" class="input-field">
                    <option value="1" ${data.despawnOnExit == 1 ? 'selected' : ''}>Yes</option>
                    <option value="0" ${data.despawnOnExit == 0 ? 'selected' : ''}>No</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Despawn Distance</label>
                <input type="number" id="zoneDespawnDistance-${zoneId}" class="input-field" value="${data.despawnDistance}" step="any">
            </div>
            
            <div class="form-group full-width">
                <label>Respawn Cooldown (seconds)</label>
                <input type="number" id="zoneRespawnCooldown-${zoneId}" class="input-field" value="${data.respawnCooldown}" min="0">
            </div>
        </div>
        
        <div class="spawn-points-section">
            <div class="section-header-compact">
                <span class="icon">📍</span>
                <h5>Spawn Points</h5>
            </div>
            <div id="spawnPointsContainer-${zoneId}" class="entries-list"></div>
            <div style="margin-top: 1rem;">
                <button class="btn-premium" style="padding: 0.5rem 1rem; font-size: 0.8rem;" onclick="addSpawnPoint(${zoneId})">+ Add Point</button>
            </div>
        </div>
    `;

    zonesContainer.appendChild(zoneDiv);

    // Load existing spawn points if any
    if (data.spawnPoints && data.spawnPoints.length > 0) {
        data.spawnPoints.forEach(sp => addSpawnPoint(zoneId, sp));
    } else if (!zoneData) {
        // Add one default if creating new
        addSpawnPoint(zoneId);
    }

    if (!zoneData) {
        generateJSON(true);
    }
}

/**
 * Remove a zone
 */
function removeZone(zoneId) {
    const element = document.getElementById(`zone-${zoneId}`);
    if (element) {
        element.remove();
        zones = zones.filter(z => z.id !== zoneId);
        generateJSON(true);
    }
}

/**
 * Add a spawn point to a specific zone
 */
function addSpawnPoint(zoneId, spData = null) {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;

    const spId = zone.spawnPoints.length;
    zone.spawnPoints.push(spId);

    const container = document.getElementById(`spawnPointsContainer-${zoneId}`);
    const spDiv = document.createElement('div');
    spDiv.className = 'spawn-point-card glass';
    spDiv.id = `spawnPoint-${zoneId}-${spId}`;

    const data = spData || {
        position: "0 0 0",
        radius: 5,
        tierIds: [1],
        entities: 7,
        useFixedHeight: 0
    };

    spDiv.innerHTML = `
        <div class="spawn-point-header">
            <span>POINT #${spId + 1}</span>
            <button class="btn-remove btn-remove-small" onclick="removeSpawnPoint(${zoneId}, ${spId})">✕</button>
        </div>
        
        <div class="form-grid" oninput="generateJSON(true)">
            <div class="form-group full-width">
                <label>Position (X Y Z)</label>
                <input type="text" id="spPosition-${zoneId}-${spId}" class="input-field" value="${data.position}">
            </div>
            
            <div class="form-group">
                <label>Radius</label>
                <input type="number" id="spRadius-${zoneId}-${spId}" class="input-field" value="${data.radius}" step="any">
            </div>
            
            <div class="form-group">
                <label>Entities Count</label>
                <input type="number" id="spEntities-${zoneId}-${spId}" class="input-field" value="${data.entities}" min="1">
            </div>
            
            <div class="form-group">
                <label>Tier IDs (comma separated)</label>
                <input type="text" id="spTierIds-${zoneId}-${spId}" class="input-field" value="${Array.isArray(data.tierIds) ? data.tierIds.join(',') : data.tierIds}">
            </div>
            
            <div class="form-group">
                <label>Fixed Height</label>
                <select id="spFixedHeight-${zoneId}-${spId}" class="input-field">
                    <option value="0" ${data.useFixedHeight == 0 ? 'selected' : ''}>No</option>
                    <option value="1" ${data.useFixedHeight == 1 ? 'selected' : ''}>Yes</option>
                </select>
            </div>
        </div>
    `;

    container.appendChild(spDiv);
    if (!spData) {
        generateJSON(true);
    }
}

/**
 * Remove a spawn point
 */
function removeSpawnPoint(zoneId, spId) {
    const element = document.getElementById(`spawnPoint-${zoneId}-${spId}`);
    if (element) {
        element.remove();
        const zone = zones.find(z => z.id === zoneId);
        if (zone) {
            zone.spawnPoints = zone.spawnPoints.filter(id => id !== spId);
        }
        generateJSON(true);
    }
}

/**
 * Generate JSON from current state
 */
function generateJSON(quiet = false) {
    const config = {
        globalSettings: {
            systemEnabled: parseInt(document.getElementById('systemEnabled').value),
            checkInterval: parseInt(document.getElementById('checkInterval').value),
            maxEntitiesPerZone: parseInt(document.getElementById('maxEntities').value),
            entityLifetime: parseInt(document.getElementById('entityLifetime').value),
            minSpawnDistanceFromPlayer: parseInt(document.getElementById('minSpawnDistance').value)
        },
        zones: []
    };

    zones.forEach(zone => {
        const zoneEl = document.getElementById(`zone-${zone.id}`);
        if (!zoneEl) return;

        const spawnPoints = [];
        zone.spawnPoints.forEach(spId => {
            const spEl = document.getElementById(`spawnPoint-${zone.id}-${spId}`);
            if (!spEl) return;

            const tierIdsStr = document.getElementById(`spTierIds-${zone.id}-${spId}`).value;
            const tierIds = tierIdsStr.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n));

            spawnPoints.push({
                position: document.getElementById(`spPosition-${zone.id}-${spId}`).value,
                radius: parseFloat(document.getElementById(`spRadius-${zone.id}-${spId}`).value) || 0,
                tierIds: tierIds,
                entities: parseInt(document.getElementById(`spEntities-${zone.id}-${spId}`).value) || 0,
                useFixedHeight: parseInt(document.getElementById(`spFixedHeight-${zone.id}-${spId}`).value)
            });
        });

        config.zones.push({
            name: document.getElementById(`zoneName-${zone.id}`).value,
            enabled: parseInt(document.getElementById(`zoneEnabled-${zone.id}`).value),
            position: document.getElementById(`zonePosition-${zone.id}`).value,
            triggerRadius: parseFloat(document.getElementById(`zoneTriggerRadius-${zone.id}`).value) || 0,
            spawnChance: parseFloat(document.getElementById(`zoneSpawnChance-${zone.id}`).value) || 0,
            despawnOnExit: parseInt(document.getElementById(`zoneDespawnOnExit-${zone.id}`).value),
            despawnDistance: parseFloat(document.getElementById(`zoneDespawnDistance-${zone.id}`).value) || 0,
            respawnCooldown: parseInt(document.getElementById(`zoneRespawnCooldown-${zone.id}`).value) || 0,
            spawnPoints: spawnPoints
        });
    });

    const output = document.getElementById('jsonOutput');
    const formatted = JSON.stringify(config, null, 2);
    output.textContent = formatted;

    if (!quiet) {
        showMessage('JSON synchronized!', 'success');
    }
}

async function saveJSON() {
    generateJSON(true);
    const text = document.getElementById('jsonOutput').textContent;

    if (!text || text === '{}') {
        showMessage('Nothing to save.', 'error');
        return;
    }

    try {
        if (!window.electronAPI || !window.electronAPI.saveFile) {
            showMessage('Save API not available.', 'error');
            return;
        }
        const result = await window.electronAPI.saveFile(text, 'spawn-zones.json');
        if (!result || result.canceled) return;
        if (result.error) {
            showMessage('Save failed: ' + result.error, 'error');
            return;
        }
        showMessage('Configuration saved!', 'success');
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

        const data = JSON.parse(result.content);

        // Reset
        document.getElementById('zonesContainer').innerHTML = '';
        zones = [];
        zoneCounter = 0;

        if (data.globalSettings) {
            document.getElementById('systemEnabled').value = data.globalSettings.systemEnabled !== undefined ? data.globalSettings.systemEnabled : 1;
            document.getElementById('checkInterval').value = data.globalSettings.checkInterval || 7;
            document.getElementById('maxEntities').value = data.globalSettings.maxEntitiesPerZone || 100;
            document.getElementById('entityLifetime').value = data.globalSettings.entityLifetime || 600;
            document.getElementById('minSpawnDistance').value = data.globalSettings.minSpawnDistanceFromPlayer || 100;
        }

        if (data.zones && Array.isArray(data.zones)) {
            data.zones.forEach(z => addZone(z));
        }

        generateJSON(true);
        showMessage('Configuration imported!', 'success');
    } catch (err) {
        showMessage('Import error: ' + err.message, 'error');
    }
}

function copyJSON() {
    const text = document.getElementById('jsonOutput').textContent;
    if (!text) return;

    navigator.clipboard.writeText(text).then(() => {
        showMessage('Copied to clipboard!', 'success');
    });
}

function clearAll() {
    if (!confirm('Discard all zones?')) return;

    document.getElementById('zonesContainer').innerHTML = '';
    zones = [];
    zoneCounter = 0;

    // Reset Globals
    document.getElementById('systemEnabled').value = "1";
    document.getElementById('checkInterval').value = "7";
    document.getElementById('maxEntities').value = "100";
    document.getElementById('entityLifetime').value = "600";
    document.getElementById('minSpawnDistance').value = "100";

    generateJSON(true);
    showMessage('Workspace cleared.', 'success');
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

document.addEventListener('DOMContentLoaded', () => {
    // Initial zone
    addZone();
});
