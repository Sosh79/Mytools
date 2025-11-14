// Category 2 page logic - Zone Spawn System Generator

function goBack() {
    navigateToPage('home');
}

let zoneCounter = 0;
let zones = [];

// Add a new zone
function addZone() {
    const zoneId = zoneCounter++;
    const zoneData = {
        id: zoneId,
        spawnPoints: []
    };
    zones.push(zoneData);

    const zonesContainer = document.getElementById('zonesContainer');
    const zoneDiv = document.createElement('div');
    zoneDiv.className = 'zone-card';
    zoneDiv.id = `zone-${zoneId}`;

    zoneDiv.innerHTML = `
        <div class="zone-header">
            <h4>Zone ${zoneId + 1}</h4>
            <button class="btn-remove" onclick="removeZone(${zoneId})">✕ Remove Zone</button>
        </div>
        
        <div class="form-grid">
            <div class="form-group">
                <label>Zone Name</label>
                <input type="text" id="zoneName-${zoneId}" class="input-field" placeholder="Pulkovo" value="Zone_${zoneId + 1}">
            </div>
            
            <div class="form-group">
                <label>Enabled</label>
                <select id="zoneEnabled-${zoneId}" class="input-field">
                    <option value="1">Enabled (1)</option>
                    <option value="0">Disabled (0)</option>
                </select>
            </div>
            
            <div class="form-group full-width">
                <label>Position (X Y Z)</label>
                <input type="text" id="zonePosition-${zoneId}" class="input-field" placeholder="4896.864746 319.264923 5683.656250" value="0 0 0">
            </div>
            
            <div class="form-group">
                <label>Trigger Radius</label>
                <input type="number" id="zoneTriggerRadius-${zoneId}" class="input-field" value="150" step="any">
            </div>
            
            <div class="form-group">
                <label>Spawn Chance (0-1)</label>
                <input type="number" id="zoneSpawnChance-${zoneId}" class="input-field" value="1" min="0" max="1" step="0.1">
            </div>
            
            <div class="form-group">
                <label>Despawn On Exit</label>
                <select id="zoneDespawnOnExit-${zoneId}" class="input-field">
                    <option value="1">Yes (1)</option>
                    <option value="0">No (0)</option>
                </select>
            </div>
            
            <div class="form-group">
                <label>Despawn Distance</label>
                <input type="number" id="zoneDespawnDistance-${zoneId}" class="input-field" value="150" step="any">
            </div>
            
            <div class="form-group">
                <label>Respawn Cooldown (seconds)</label>
                <input type="number" id="zoneRespawnCooldown-${zoneId}" class="input-field" value="300" min="0">
            </div>
        </div>
        
        <div class="spawn-points-section">
            <h5>Spawn Points</h5>
            <div id="spawnPointsContainer-${zoneId}"></div>
            <button class="btn btn-secondary" onclick="addSpawnPoint(${zoneId})">+ Add Spawn Point</button>
        </div>
    `;

    zonesContainer.appendChild(zoneDiv);
    showMessage('Zone added successfully!', 'success');
}

// Remove a zone
function removeZone(zoneId) {
    const zoneElement = document.getElementById(`zone-${zoneId}`);
    if (zoneElement) {
        zoneElement.remove();
        zones = zones.filter(z => z.id !== zoneId);
        showMessage('Zone removed!', 'success');
    }
}

// Add spawn point to a zone
function addSpawnPoint(zoneId) {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;

    const spawnPointId = zone.spawnPoints.length;
    zone.spawnPoints.push(spawnPointId);

    const container = document.getElementById(`spawnPointsContainer-${zoneId}`);
    const spawnPointDiv = document.createElement('div');
    spawnPointDiv.className = 'spawn-point-card';
    spawnPointDiv.id = `spawnPoint-${zoneId}-${spawnPointId}`;

    spawnPointDiv.innerHTML = `
        <div class="spawn-point-header">
            <strong>Spawn Point ${spawnPointId + 1}</strong>
            <button class="btn-remove-small" onclick="removeSpawnPoint(${zoneId}, ${spawnPointId})">✕</button>
        </div>
        
        <div class="form-grid-compact">
            <div class="form-group">
                <label>Position (X Y Z)</label>
                <input type="text" id="spPosition-${zoneId}-${spawnPointId}" class="input-field" placeholder="4884.697266 319.066681 5694.229004" value="0 0 0">
            </div>
            
            <div class="form-group">
                <label>Radius</label>
                <input type="number" id="spRadius-${zoneId}-${spawnPointId}" class="input-field" value="5" step="any">
            </div>
            
            <div class="form-group">
                <label>Tier IDs (comma separated)</label>
                <input type="text" id="spTierIds-${zoneId}-${spawnPointId}" class="input-field" placeholder="1,2,3" value="1">
            </div>
            
            <div class="form-group">
                <label>Entities Count</label>
                <input type="number" id="spEntities-${zoneId}-${spawnPointId}" class="input-field" value="7" min="1">
            </div>
            
            <div class="form-group">
                <label>Use Fixed Height</label>
                <select id="spFixedHeight-${zoneId}-${spawnPointId}" class="input-field">
                    <option value="0">No (0)</option>
                    <option value="1">Yes (1)</option>
                </select>
            </div>
        </div>
    `;

    container.appendChild(spawnPointDiv);
}

// Remove spawn point
function removeSpawnPoint(zoneId, spawnPointId) {
    const element = document.getElementById(`spawnPoint-${zoneId}-${spawnPointId}`);
    if (element) {
        element.remove();
        const zone = zones.find(z => z.id === zoneId);
        if (zone) {
            zone.spawnPoints = zone.spawnPoints.filter(sp => sp !== spawnPointId);
        }
    }
}

// Generate JSON
function generateJSON() {
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
        const zoneElement = document.getElementById(`zone-${zone.id}`);
        if (!zoneElement) return;

        const spawnPoints = [];
        zone.spawnPoints.forEach(spId => {
            const spElement = document.getElementById(`spawnPoint-${zone.id}-${spId}`);
            if (!spElement) return;

            const position = document.getElementById(`spPosition-${zone.id}-${spId}`).value;
            const tierIdsString = document.getElementById(`spTierIds-${zone.id}-${spId}`).value;
            const tierIds = tierIdsString.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

            spawnPoints.push({
                position: position,
                radius: parseFloat(document.getElementById(`spRadius-${zone.id}-${spId}`).value),
                tierIds: tierIds,
                entities: parseInt(document.getElementById(`spEntities-${zone.id}-${spId}`).value),
                useFixedHeight: parseInt(document.getElementById(`spFixedHeight-${zone.id}-${spId}`).value)
            });
        });

        config.zones.push({
            name: document.getElementById(`zoneName-${zone.id}`).value,
            enabled: parseInt(document.getElementById(`zoneEnabled-${zone.id}`).value),
            position: document.getElementById(`zonePosition-${zone.id}`).value,
            triggerRadius: parseFloat(document.getElementById(`zoneTriggerRadius-${zone.id}`).value),
            spawnChance: parseFloat(document.getElementById(`zoneSpawnChance-${zone.id}`).value),
            despawnOnExit: parseInt(document.getElementById(`zoneDespawnOnExit-${zone.id}`).value),
            despawnDistance: parseFloat(document.getElementById(`zoneDespawnDistance-${zone.id}`).value),
            respawnCooldown: parseInt(document.getElementById(`zoneRespawnCooldown-${zone.id}`).value),
            spawnPoints: spawnPoints
        });
    });

    const jsonOutput = document.getElementById('jsonOutput');
    const formattedJSON = JSON.stringify(config, null, 2);
    jsonOutput.textContent = formattedJSON;

    showMessage('JSON generated successfully!', 'success');
}

// Copy JSON to clipboard
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

// Clear all
function clearAll() {
    if (!confirm('Are you sure you want to clear all zones?')) return;

    document.getElementById('zonesContainer').innerHTML = '';
    document.getElementById('jsonOutput').textContent = '';
    zones = [];
    zoneCounter = 0;

    // Reset global settings
    document.getElementById('systemEnabled').value = '1';
    document.getElementById('checkInterval').value = '7';
    document.getElementById('maxEntities').value = '100';
    document.getElementById('entityLifetime').value = '600';
    document.getElementById('minSpawnDistance').value = '100';

    showMessage('All cleared!', 'success');
}

// Show message
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
    console.log('Category 2 page loaded');

    // Add one default zone
    addZone();
    addSpawnPoint(0);
    addSpawnPoint(0);
});
