document.addEventListener('DOMContentLoaded', () => {
    initDateSelectors();
});

// Tyson Conversion Map (Standard Togel Algorithm)
const tysonMap = {
    0: 7, 1: 4, 2: 9, 3: 6, 4: 1, 
    5: 8, 6: 3, 7: 0, 8: 5, 9: 2
};

// Initialize Date Dropdowns
function initDateSelectors() {
    const today = new Date();
    const dateSelect = document.getElementById('selDate');
    const yearSelect = document.getElementById('selYear');
    
    // Populate Dates 1-31
    for(let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        if(i === today.getDate()) option.selected = true;
        dateSelect.appendChild(option);
    }

    // Populate Month
    const monthSelect = document.getElementById('selMonth');
    monthSelect.value = today.getMonth() + 1;

    // Populate Years (Current -1 to +1)
    const currentYear = today.getFullYear();
    for(let i = currentYear - 1; i <= currentYear + 1; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        if(i === currentYear) option.selected = true;
        yearSelect.appendChild(option);
    }
}

// Core Logic Generator
function generateNumbers() {
    const lastOutput = document.getElementById('lastOutput').value;
    
    // Validation
    if(!lastOutput || lastOutput.length !== 4 || isNaN(lastOutput)) {
        alert("Mohon masukkan 4 digit angka keluaran terakhir dengan benar.");
        return;
    }

    const d = parseInt(document.getElementById('selDate').value);
    const m = parseInt(document.getElementById('selMonth').value);
    const y = parseInt(document.getElementById('selYear').value);
    
    // Calculate Seed based on Tyson & Date
    let seed = 0;
    
    // 1. Sum of Date
    seed += (d + m + y);
    
    // 2. Tyson Value of Last Output
    let tysonVal = 0;
    for(let char of lastOutput) {
        tysonVal += tysonMap[parseInt(char)];
    }
    
    // 3. Formula String for Display
    const formulaText = `(TYSON[${lastOutput}] + DATE[${d}/${m}/${y}]) x ALGO_V2`;
    document.getElementById('formulaDetail').innerText = formulaText;

    // Generate 200 Lines using Pseudo-Random Deterministic logic based on seed
    const generatedNumbers = [];
    let currentVal = seed + parseInt(lastOutput);

    for(let i = 0; i < 200; i++) {
        // Linear Congruential Generator logic for consistency
        currentVal = (currentVal * 1664525 + 1013904223) % 4294967296;
        
        // Extract 4 digits
        let num = Math.abs(currentVal % 10000).toString().padStart(4, '0');
        generatedNumbers.push(num);
    }

    renderResults(generatedNumbers);
}

// Render to Grid
function renderResults(numbers) {
    const grid = document.getElementById('numbersGrid');
    grid.innerHTML = '';
    
    numbers.forEach(num => {
        const div = document.createElement('div');
        div.className = 'bg-slate-50 border border-slate-200 text-slate-700 text-center py-2 rounded font-mono font-bold text-sm hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 cursor-pointer transition number-box';
        div.innerText = num;
        grid.appendChild(div);
    });

    // Show Result Section
    const section = document.getElementById('resultSection');
    section.classList.remove('hidden');
    section.scrollIntoView({ behavior: 'smooth' });
}

// Copy Functionality
function copyToClipboard() {
    const numbers = Array.from(document.querySelectorAll('#numbersGrid div'))
        .map(div => div.innerText)
        .join(', '); // Format: 1234, 5678, ...
    
    if(!numbers) return;

    navigator.clipboard.writeText(numbers).then(() => {
        alert('200 LN berhasil disalin ke clipboard!');
    }).catch(err => {
        console.error('Gagal menyalin:', err);
        alert('Gagal menyalin. Izin browser mungkin dibatasi.');
    });
}