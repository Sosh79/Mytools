// Category 3: DiscordChat Log Parser Logic

function parseLog(quiet = false) {
    const raw = document.getElementById('logInput').value || '';
    const channelFilter = document.getElementById('channelFilter').value;
    const senderFilter = (document.getElementById('senderFilter').value || '').toLowerCase();

    if (!raw.trim()) {
        renderResults([]);
        return;
    }

    const lines = raw.split(/\r?\n/).filter(l => l.trim().length > 0);
    const regex = /^\[(?<datetime>\d{2}\.\d{2}\.\d{4}\s+\d{2}:\d{2}:\d{2})\]:\s*\[(?<channel>Global|Direct)\]\s+(?<sender>[^:]+):\s*(?<message>.*)$/;

    const results = [];
    for (const line of lines) {
        const m = line.match(regex);
        if (!m) continue;

        const { datetime, channel } = m.groups;
        const sender = m.groups.sender.trim();
        const message = m.groups.message || '';

        if (channelFilter !== 'all' && channel !== channelFilter) continue;
        if (senderFilter && !sender.toLowerCase().includes(senderFilter)) continue;

        results.push({ time: datetime, channel, sender, message });
    }

    // Sort: newest first
    const toDate = (s) => {
        const [datePart, timePart] = s.split(' ');
        const [dd, MM, yyyy] = datePart.split('.').map(Number);
        const [HH, mm, ss] = timePart.split(':').map(Number);
        return new Date(yyyy, MM - 1, dd, HH, mm, ss);
    };
    results.sort((a, b) => toDate(b.time) - toDate(a.time));

    renderResults(results);

    if (!quiet && results.length > 0) {
        showMessage(`Parsed ${results.length} entries`, 'success');
    }
}

async function openLogFile() {
    try {
        if (!window.electronAPI || !window.electronAPI.openChatLog) {
            showMessage('Open API not available.', 'error');
            return;
        }
        const result = await window.electronAPI.openChatLog();
        if (!result || result.canceled) return;

        document.getElementById('logInput').value = result.content || '';
        parseLog(true);

        const filename = (result.filePath || '').split(/[/\\]/).pop();
        showMessage(`Imported ${filename}`, 'success');
    } catch (err) {
        showMessage('Import failed: ' + err.message, 'error');
    }
}

function renderResults(items) {
    const tbody = document.getElementById('resultsBody');
    const statsEl = document.getElementById('stats');

    tbody.innerHTML = '';

    if (items.length === 0) {
        statsEl.textContent = '0 entries found';
        return;
    }

    items.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.time}</td>
            <td><span class="channel-badge channel-${item.channel}">${item.channel}</span></td>
            <td><strong>${item.sender}</strong></td>
            <td>${item.message}</td>
        `;
        tbody.appendChild(tr);
    });

    const globals = items.filter(i => i.channel === 'Global').length;
    const directs = items.filter(i => i.channel === 'Direct').length;
    statsEl.textContent = `${items.length} entries (Global: ${globals}, Direct: ${directs})`;
}

function copyTable() {
    const rows = [['Time', 'Channel', 'Sender', 'Message']];
    document.querySelectorAll('#resultsBody tr').forEach(tr => {
        const cols = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.replace(/\t|\n/g, ' '));
        rows.push(cols);
    });

    if (rows.length <= 1) {
        showMessage('No results to copy.', 'error');
        return;
    }

    const tsv = rows.map(r => r.join('\t')).join('\n');
    navigator.clipboard.writeText(tsv).then(() => {
        showMessage('Table copied to clipboard!', 'success');
    });
}

function clearAll() {
    document.getElementById('logInput').value = '';
    document.getElementById('senderFilter').value = '';
    document.getElementById('channelFilter').value = 'all';
    renderResults([]);
    showMessage('Log cleared', 'success');
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
