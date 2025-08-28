// Loads and displays the roster by week, sectioned by team side and position

// CSV file path
const CSV_PATH = 'roster_info.csv';

// Utility: Parse CSV to array of objects
function parseCSV(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        // Handle quoted URLs and commas
        const values = [];
        let current = '', inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) { values.push(current); current = ''; }
            else current += char;
        }
        values.push(current);
        const obj = {};
        headers.forEach((h, i) => obj[h] = values[i]);
        return obj;
    });
}

// Utility: Group by key
function groupBy(arr, key) {
    return arr.reduce((acc, item) => {
        (acc[item[key]] = acc[item[key]] || []).push(item);
        return acc;
    }, {});
}

// Fetch and process CSV
fetch(CSV_PATH)
    .then(res => res.text())
    .then(text => {
        const data = parseCSV(text);
        const weeks = [...new Set(data.map(row => row.week))].sort((a, b) => a - b);
        const weekSelect = document.getElementById('week');
        weeks.forEach(week => {
            const opt = document.createElement('option');
            opt.value = week;
            opt.textContent = week;
            weekSelect.appendChild(opt);
        });
        weekSelect.value = weeks[0];
        weekSelect.addEventListener('change', () => renderRoster(data, weekSelect.value));
        renderRoster(data, weekSelect.value);
    });

function renderRoster(data, week) {
    const rosterDiv = document.getElementById('roster');
    rosterDiv.innerHTML = '';
    const filtered = data.filter(row => row.week === week);
    const sides = groupBy(filtered, 'team_side');
    ['Offense', 'Defense', 'Special Teams'].forEach(side => {
        if (!sides[side]) return;
        const section = document.createElement('div');
        section.className = 'section';
        section.innerHTML = `<h2>${side}</h2>`;
        const positions = groupBy(sides[side], 'position');
        Object.keys(positions).forEach(pos => {
            const posGroup = document.createElement('div');
            posGroup.className = 'position-group';
            posGroup.innerHTML = `<h3>${pos}</h3>`;
            const playersDiv = document.createElement('div');
            playersDiv.className = 'players';
            positions[pos].forEach(player => {
                const card = document.createElement('div');
                card.className = 'player-card';
                card.innerHTML = `
                    <img src="${player.headshot_url}" alt="${player.player_name}">
                    <div class="player-name">${player.player_name}</div>
                    <div class="player-info">${player.position} | #${player.jersey_number}</div>
                `;
                playersDiv.appendChild(card);
            });
            posGroup.appendChild(playersDiv);
            section.appendChild(posGroup);
        });
        rosterDiv.appendChild(section);
    });
}
