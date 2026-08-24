function parseData(raw) {
    const blocks = raw.split(/\n\s*\n/);
    const badges = [];
    blocks.forEach(block => {
        let lines = block.split('\n')
        .map(line => line.replace(/[#>Q]/g, '').trim())
        .filter(line => line);

        if (lines.length < 2) return;
        let repeat = 1;
        const priceLines = [];
        lines.forEach(line => {
            const match = line.match(/(?:buat|x)\s*(\d+)/i); //buat brp kalinya
            if (match) {
                repeat = parseInt(match[1], 10);
                line = line.replace(/(?:buat|x)\s*\d+/i, '').trim();
            }
            if (/\d/.test(line)) {
                priceLines.push(line);
            }
        });

        if (priceLines.length < 2) return;
        const priceOld = priceLines[priceLines.length - 2];
        const priceNew = priceLines[priceLines.length - 1];
        for (let i = 0; i < repeat; i++) {
            badges.push({ old: priceOld, new: priceNew });
        }
    });
    return badges;
}

function downloadPDF() {
    const rawData = document.getElementById('dataInput').value.trim();
    const badges = parseData(rawData);

    let element = document.getElementById('print-container');
    if (!element) {
        element = document.createElement('div');
        element.id = 'print-container';
        document.body.appendChild(element);
    }

    element.innerHTML = '';
    element.style.display = 'block';

    for (let i = 0; i < badges.length; i += 6) {
        const page = document.createElement('div');
        page.className = 'badge-page';

        const grid = document.createElement('div');
        grid.className = 'badge-grid';

        const chunk = badges.slice(i, i + 6);
        chunk.forEach(badge => {
            const circle = document.createElement('div');
            circle.className = 'badge-circle';
            circle.innerHTML = `
                <div class="badge-title">Harga Spesial</div>
                <div class="badge-old">${badge.old}</div>
                <div class="badge-new">${badge.new}</div>
            `;
            grid.appendChild(circle);
        });

        page.appendChild(grid);
        element.appendChild(page);
    }

    const opt = {
        margin: 4,
        filename: 'download1.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save().then(() => {
        element.style.display = 'none';
        element.innerHTML = '';
    });z
}