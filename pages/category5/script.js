let admins = ['76500000000000000'];
let rules = [
    "<h1> ZoneX - General Server Rules</h1>",
    "<p>Welcome to <b>ZoneX Server!</b></p>",
    "<p>In this harsh world, survival means fighting <b>against nature and other players</b>.</p>"
];

document.addEventListener('DOMContentLoaded', () => {
    // Initial Render
    renderAdmins();
    renderRules();
    generateJSON();

    // Setup inputs
    document.getElementById('serverName').value = "Welcome on ZoneX server !! - Hosted By Rebal";
    document.getElementById('discordLink').value = "";
    document.getElementById('donationLink').value = "";
});

function addAdmin(id = "") {
    admins.push(id);
    renderAdmins();
    generateJSON();
}

function removeAdmin(index) {
    admins.splice(index, 1);
    renderAdmins();
    generateJSON();
}

function updateAdmin(index, value) {
    admins[index] = value;
    generateJSON();
}

function renderAdmins() {
    const container = document.getElementById('adminsContainer');
    container.innerHTML = '';

    admins.forEach((admin, index) => {
        const div = document.createElement('div');
        div.className = 'admin-entry';
        div.innerHTML = `
            <span class="icon">👤</span>
            <input type="text" class="input-field" style="flex:1" value="${admin}" oninput="updateAdmin(${index}, this.value)" placeholder="Steam64 ID">
            <button class="btn-remove btn-remove-small" onclick="removeAdmin(${index})">✕</button>
        `;
        container.appendChild(div);
    });
}

// Helper to separate tag from content
function parseRule(ruleHtml) {
    const match = ruleHtml.match(/^<(\w+)>(.*)<\/\1>$/);
    if (match) {
        return { tag: match[1], text: match[2] };
    }
    // Default to paragraph if parsing fails
    return { tag: 'p', text: ruleHtml };
}

function addRule() {
    // Default new rule
    rules.push("<p>New Rule</p>");
    renderRules();
    generateJSON();
}

function removeRule(index) {
    rules.splice(index, 1);
    renderRules();
    generateJSON();
}

function updateRuleType(index, newTag) {
    const current = parseRule(rules[index]);
    rules[index] = `<${newTag}>${current.text}</${newTag}>`;
    renderRules(); // Re-render to update the input/textarea if needed (optional)
    generateJSON();
}

function updateRuleText(index, newText) {
    const current = parseRule(rules[index]);
    rules[index] = `<${current.tag}>${newText}</${current.tag}>`;
    generateJSON();
}

function renderRules() {
    const container = document.getElementById('rulesContainer');
    container.innerHTML = '';

    rules.forEach((rule, index) => {
        const parsed = parseRule(rule);
        const div = document.createElement('div');
        div.className = 'rule-entry';

        div.innerHTML = `
            <div class="rule-controls">
                <select class="input-field tag-select" onchange="updateRuleType(${index}, this.value)">
                    <option value="h1" ${parsed.tag === 'h1' ? 'selected' : ''}>H1 - Header</option>
                    <option value="h2" ${parsed.tag === 'h2' ? 'selected' : ''}>H2 - Subheader</option>
                    <option value="p" ${parsed.tag === 'p' ? 'selected' : ''}>P - Text</option>
                </select>
                <button class="btn-remove btn-remove-small" onclick="removeRule(${index})">✕</button>
            </div>
            <textarea class="textarea-field rule-content" oninput="updateRuleText(${index}, this.value)" placeholder="Rule content...">${parsed.text}</textarea>
        `;
        container.appendChild(div);
    });
}

function generateJSON() {
    const data = {
        CONFIG_VERSION: document.getElementById('configVersion').value,
        SERVERNAME: document.getElementById('serverName').value,
        DISPLAYPLAYERSTATUS: parseInt(document.getElementById('displayPlayerStatus').value),
        DISPLAYSERVER: parseInt(document.getElementById('displayServer').value),
        DiscordLink: document.getElementById('discordLink').value,
        DonationLink: document.getElementById('donationLink').value,
        AdminSteamIDs: admins.filter(a => a.trim() !== ''),
        ServerRules: rules
    };

    const json = JSON.stringify(data, null, 4);
    const output = document.getElementById('jsonOutput');
    // Simple syntax highlighting
    output.innerHTML = syntaxHighlight(json);
}

async function copyJSON() {
    const text = document.getElementById('jsonOutput').textContent;
    await navigator.clipboard.writeText(text);
    showToast('JSON copied to clipboard!', 'success');
}

async function saveJSON() {
    const content = document.getElementById('jsonOutput').textContent;
    if (window.electronAPI) {
        const result = await window.electronAPI.saveFile(content, 'server-config.json');
        if (!result.canceled) {
            showToast('File saved successfully!', 'success');
        }
    }
}

async function openJSONFile() {
    // For now simple alert as parsing logic is complex
    // In real app we would read file, parse JSON, and populate fields
    showToast('Open feature coming soon to this category!', 'info');
}

function clearForm() {
    if (confirm("Are you sure you want to clear all fields?")) {
        document.getElementById('serverName').value = "";
        document.getElementById('discordLink').value = "";
        document.getElementById('donationLink').value = "";
        admins = [];
        rules = [];
        renderAdmins();
        renderRules();
        generateJSON();
    }
}

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `message message-${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// Simple JSON syntax highlighter
function syntaxHighlight(json) {
    if (typeof json != 'string') {
        json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
                return `<span style="color:#93c5fd">${match}</span>`;
            } else {
                cls = 'string';
                return `<span style="color:#a5f3fc">${match}</span>`;
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
            return `<span style="color:#f9a8d4">${match}</span>`;
        } else if (/null/.test(match)) {
            cls = 'null';
            return `<span style="color:#cbd5e1">${match}</span>`;
        }
        return `<span style="color:#fca5a5">${match}</span>`;
    });
}
