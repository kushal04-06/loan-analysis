// Chart Defaults
Chart.defaults.color = '#94a3b8';
Chart.defaults.font.family = "'Inter', sans-serif";

// Utility for Gradients
function createGradient(ctx, colorStart, colorEnd) {
    let gradient = ctx.createLinearGradient(0, 0, 0, 300);
    gradient.addColorStop(0, colorStart);
    gradient.addColorStop(1, colorEnd);
    return gradient;
}

// 1. Overview Chart
const ctxOverview = document.getElementById('overviewChart').getContext('2d');
let overviewChart = new Chart(ctxOverview, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Metric 1',
                data: [10, 60, 40, 90, 160, 60, 190],
                borderColor: '#10b981',
                backgroundColor: createGradient(ctxOverview, 'rgba(16, 185, 129, 0.4)', 'rgba(16, 185, 129, 0)'),
                tension: 0.4,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff',
                fill: true,
                borderWidth: 2
            },
            {
                label: 'Metric 2',
                data: [10, 40, 80, 50, 130, 90, 160],
                borderColor: '#38bdf8',
                backgroundColor: createGradient(ctxOverview, 'rgba(56, 189, 248, 0.4)', 'rgba(56, 189, 248, 0)'),
                tension: 0.4,
                pointBackgroundColor: '#38bdf8',
                pointBorderColor: '#fff',
                fill: true,
                borderWidth: 2
            },
            {
                label: 'Metric 3',
                data: [80, 60, 120, 100, 180, 140, 220],
                borderColor: '#6366f1',
                backgroundColor: 'transparent',
                tension: 0.4,
                pointBackgroundColor: '#6366f1',
                pointBorderColor: '#fff',
                fill: false,
                borderWidth: 2
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false } },
        scales: {
            x: { grid: { display: false, drawBorder: false } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, min: 0 }
        }
    }
});

// 2. Loan Analytics Chart
const ctxAnalytics = document.getElementById('analyticsChart').getContext('2d');
let analyticsChart = new Chart(ctxAnalytics, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
            {
                label: 'Payment History',
                data: [0, 20, 25, 15, 25, 35, 30, 35, 42, 38, 48, 55],
                borderColor: '#38bdf8',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#38bdf8',
                pointBorderColor: '#fff'
            },
            {
                label: 'Principal Paid',
                data: [0, 15, 15, 25, 25, 28, 24, 20, 35, 45, 35, 48],
                borderColor: '#10b981',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#10b981',
                pointBorderColor: '#fff'
            }
        ]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { color: 'rgba(255,255,255,0.05)' } },
            y: { grid: { color: 'rgba(255,255,255,0.05)' }, min: 0, max: 60 }
        }
    }
});


// 3. Donut Chart
const ctxDonut = document.getElementById('portfolioDonut').getContext('2d');
let donutChart = new Chart(ctxDonut, {
    type: 'doughnut',
    data: {
        labels: ['A', 'B', 'C'],
        datasets: [{
            data: [60, 25, 15],
            backgroundColor: ['#10b981', '#38bdf8', 'rgba(255,255,255,0.1)'],
            borderWidth: 0,
            hoverOffset: 4
        }]
    },
    options: {
        cutout: '75%',
        plugins: { legend: { display: false }, tooltip: { enabled: false } }
    }
});


// Custom Sparklines
function createSparkline(id, data, color) {
    const ctx = document.getElementById(id).getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map((_, i) => i),
            datasets: [{ data: data, borderColor: color, tension: 0.4, borderWidth: 2, pointRadius: 0 }]
        },
        options: {
            responsive: true, maintainAspectRatio: false,
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            scales: { x: { display: false }, y: { display: false } }
        }
    });
}
createSparkline('spark1', [10, 20, 15, 30, 25, 40], '#38bdf8');
createSparkline('spark2', [40, 25, 30, 15, 20, 10], '#10b981');
createSparkline('spark3', [5, 15, 10, 25, 20, 35], '#38bdf8');
createSparkline('spark4', [35, 20, 25, 10, 15, 5], '#10b981');


// Render Calendar
const calendarGrid = document.getElementById('calendarGrid');
const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
days.forEach(d => {
    let el = document.createElement('div');
    el.className = 'cal-head'; el.innerText = d;
    calendarGrid.appendChild(el);
});
for (let i = 1; i <= 30; i++) {
    let el = document.createElement('div');
    el.className = 'cal-day';
    el.innerText = i;
    if (i === 9) el.classList.add('teal');
    if (i === 13) el.classList.add('teal');
    if (i === 5 || i === 12 || i === 19 || i === 26) el.style.color = '#10b981';
    calendarGrid.appendChild(el);
}

// Render Growth Metrics
const growthContainer = document.getElementById('growthMetricsContainer');
const growthData = [
    { label: 'Savings', s1: 60, s2: 30 },
    { label: 'Investments', s1: 50, s2: 0 },
    { label: 'Wealth Growth', s1: 40, s2: 15 }
];
growthData.forEach(g => {
    let row = document.createElement('div');
    row.className = 'growth-row';
    row.innerHTML = `
        <div class="growth-label">${g.label}</div>
        <div class="growth-track">
            <div class="growth-segment seg-green" style="width: ${g.s1}%; left: 0;"></div>
            ${g.s2 > 0 ? `<div class="growth-segment seg-blue" style="width: ${g.s2}%; left: ${g.s1 + 2}%;"></div>` : ''}
        </div>
    `;
    growthContainer.appendChild(row);
});

let axis = document.createElement('div');
axis.className = 'growth-axis';
[0, 50, 100, 150, 200, 250, 300, 350, 400].forEach(n => {
    let s = document.createElement('span'); s.innerText = n; axis.appendChild(s);
});
growthContainer.appendChild(axis);


// User Input / Data Update Logic
const modal = document.getElementById('dataModal');
const openBtn = document.getElementById('openFormBtn');
const closeBtn = document.getElementById('closeFormBtn');
const form = document.getElementById('dashboardForm');

openBtn.onclick = () => modal.classList.add('show');
closeBtn.onclick = () => modal.classList.remove('show');
window.onclick = (e) => { if (e.target == modal) modal.classList.remove('show'); };

form.onsubmit = (e) => {
    e.preventDefault();
    
    // Update Text Values
    document.getElementById('val-balance').innerText = document.getElementById('in-balance').value;
    document.getElementById('val-progress').innerText = document.getElementById('in-progress').value;
    document.getElementById('val-rates').innerText = document.getElementById('in-rates').value;
    
    // Update Progress Bar
    let pct = document.getElementById('in-loan-progress').value;
    document.getElementById('val-loan-progress').style.width = pct + '%';
    
    // Update Overview Chart Data
    try {
        let d1 = document.getElementById('in-overview-1').value.split(',').map(Number);
        let d2 = document.getElementById('in-overview-2').value.split(',').map(Number);
        let d3 = document.getElementById('in-overview-3').value.split(',').map(Number);
        
        if(d1.length > 0) overviewChart.data.datasets[0].data = d1;
        if(d2.length > 0) overviewChart.data.datasets[1].data = d2;
        if(d3.length > 0) overviewChart.data.datasets[2].data = d3;
        
        overviewChart.update();
        
        // Randomize donut chart for effect
        donutChart.data.datasets[0].data = [Math.random() * 50 + 20, Math.random() * 30 + 10, Math.random() * 20 + 5];
        donutChart.update();
        
        // Randomize gauges
        document.getElementById('arc-balance').style.strokeDashoffset = Math.random() * 100;
        document.getElementById('arc-progress').style.strokeDashoffset = Math.random() * 100 + 20;
        document.getElementById('arc-rates').style.strokeDashoffset = Math.random() * 100 + 40;
        
    } catch(err) {
        console.error("Invalid data format", err);
        alert("Please enter comma-separated numbers for the chart data.");
    }
    
    modal.classList.remove('show');
    
    // FAB feedback
    openBtn.innerText = "✅ Updated!";
    setTimeout(() => openBtn.innerText = "⚙️ Update Data", 2000);
};
