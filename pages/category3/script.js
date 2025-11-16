// Category 3 - DiscordChat log parser

function goBack() {
    navigateToPage('home');
}

function parseLog() {
    const raw = document.getElementById('logInput').value || '';
    const channelFilter = document.getElementById('channelFilter').value;
    const senderFilter = (document.getElementById('senderFilter').value || '').toLowerCase();

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

    // Sort by time so newest is on top (oldest at bottom)
    const toDate = (s) => {
        // s format: dd.MM.yyyy HH:mm:ss
        const [datePart, timePart] = s.split(' ');
        const [dd, MM, yyyy] = datePart.split('.').map(Number);
        const [HH, mm, ss] = timePart.split(':').map(Number);
        return new Date(yyyy, MM - 1, dd, HH, mm, ss);
    };
    results.sort((a, b) => toDate(b.time) - toDate(a.time));

    renderResults(results);
}

async function openLogFile() {
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
        const textarea = document.getElementById('logInput');
        textarea.value = result.content || '';
        parseLog();
        const name = (result.filePath || '').split(/[/\\]/).pop() || 'log file';
        showMessage('Loaded ' + name, 'success');
    } catch (err) {
        showMessage('Error: ' + err, 'error');
    }
}

function renderResults(items) {
    const tbody = document.getElementById('resultsBody');
    tbody.innerHTML = '';

    for (const item of items) {
        const tr = document.createElement('tr');

        const tdTime = document.createElement('td');
        tdTime.textContent = item.time;

        const tdChannel = document.createElement('td');
        const span = document.createElement('span');
        span.className = `channel-badge channel-${item.channel}`;
        span.textContent = item.channel;
        tdChannel.appendChild(span);

        const tdSender = document.createElement('td');
        tdSender.textContent = item.sender;

        const tdMsg = document.createElement('td');
        tdMsg.textContent = item.message;

        tr.appendChild(tdTime);
        tr.appendChild(tdChannel);
        tr.appendChild(tdSender);
        tr.appendChild(tdMsg);

        tbody.appendChild(tr);
    }

    const stats = document.getElementById('stats');
    const total = items.length;
    const globals = items.filter(i => i.channel === 'Global').length;
    const directs = items.filter(i => i.channel === 'Direct').length;
    stats.textContent = `Total: ${total} | Global: ${globals} | Direct: ${directs}`;
}

function copyTable() {
    // Copy the rendered results as TSV
    const rows = [['Time', 'Channel', 'Sender', 'Message']];
    document.querySelectorAll('#resultsBody tr').forEach(tr => {
        const cols = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.replace(/\t|\n/g, ' '));
        rows.push(cols);
    });
    const tsv = rows.map(r => r.join('\t')).join('\n');
    navigator.clipboard.writeText(tsv).then(() => {
        showMessage('Results copied to clipboard!', 'success');
    }).catch(err => showMessage('Failed to copy: ' + err, 'error'));
}

function clearAll() {
    document.getElementById('logInput').value = '';
    document.getElementById('senderFilter').value = '';
    document.getElementById('channelFilter').value = 'all';
    document.getElementById('resultsBody').innerHTML = '';
    document.getElementById('stats').textContent = '';
}

// Quick demo fill for testing
document.addEventListener('DOMContentLoaded', () => {
    // Optionally preload sample from description if needed.
});

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
