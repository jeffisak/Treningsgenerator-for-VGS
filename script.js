class ProblemGenerator {
    constructor() {
        this.currentLevel = 1;
        this.currentProblem = null;
        this.chartInstance = null; // Store chart instance
    }

    setLevel(level) {
        this.currentLevel = parseInt(level);
    }

    generate() {
        switch (this.currentLevel) {
            case 1:
                return this.generateLevel1();
            case 2:
                return this.generateLevel2();
            case 3:
                return this.generateLevel3();
            default:
                return this.generateLevel1();
        }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    round(num, decimals = 2) {
        return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals);
    }

    // Generate points for chart
    generatePoints(func, xMin, xMax, step = 1) {
        let points = [];
        for (let x = xMin; x <= xMax; x += step) {
            points.push({ x: x, y: func(x) });
        }
        return points;
    }

    // --- NIVÅ 1: Grunnleggende (y = kx) ---
    generateLevel1() {
        const type = this.getRandomInt(1, 4); // Added type 4 for graph
        let problem = {};

        if (type === 1) {
            // Find k from context
            const k = this.getRandomInt(15, 150);
            const x = this.getRandomInt(3, 12);
            const y = k * x;

            const scenarios = [
                { item: "epler", unit: "kg", priceUnit: "kr" },
                { item: "bensin", unit: "liter", priceUnit: "kr" },
                { item: "arbeid", unit: "timer", priceUnit: "kr" }
            ];
            const scenario = scenarios[this.getRandomInt(0, scenarios.length - 1)];

            problem.text = `Du kjøper ${x} ${scenario.unit} ${scenario.item} og betaler ${y} ${scenario.priceUnit}. <br><br>
                            a) Hva er prisen per ${scenario.unit}? (Finn proporsjonalitetskonstanten k)<br>
                            b) Sett opp en formel y = kx for prisen y ved kjøp av x ${scenario.unit}.`;

            problem.solution = `a) Prisen per ${scenario.unit} er forholdet mellom totalpris og antall: <br>
                                k = y/x = ${y}/${x} = ${k} ${scenario.priceUnit}/${scenario.unit} <br>
                                b) Formelen blir da: y = ${k}x`;
        } else if (type === 2) {
            // Use k to find y
            const k = this.getRandomInt(5, 25) * 10;
            const x = this.getRandomInt(2, 8);

            problem.text = `En bil kjører med en konstant fart på ${k} km/t. <br><br>
                            Hvor langt kommer bilen på ${x} timer hvis farten holder seg konstant?`;

            problem.solution = `Her er det en direkte proporsjonal sammenheng der s = vt. <br>
                                k = v = ${k} km/t og x = t = ${x} timer. <br>
                                s = ${k} · ${x} = ${k * x} km`;
        } else if (type === 3) {
            // Table fill
            const k = this.getRandomInt(2, 9);
            const x1 = this.getRandomInt(2, 5);
            const x3 = x1 * 3;

            problem.text = `Gitt at y er direkte proporsjonal med x, og y = ${k * x1} når x = ${x1}.<br>
                             Hva er y når x = ${x3}?`;
            problem.solution = `Først finner vi proporsjonalitetskonstanten k: <br>
                                 k = y/x = ${k * x1}/${x1} = ${k} <br>
                                 Da kan vi finne y når x = ${x3}: <br>
                                 y = ${k} · ${x3} = ${k * x3}`;
        } else {
            // GRAPH PROBLEM NO. 1: Find k from graph
            const k = this.getRandomInt(2, 5);
            problem.text = `Se på grafen over. Den viser en proporsjonal sammenheng y = kx. <br>
                            Hva er proporsjonalitetskonstanten k?`;
            problem.solution = `Velg et punkt på grafen, for eksempel der x = 1. <br>
                                Da ser vi at y = ${k}. <br>
                                k = y/x = ${k}/1 = ${k}.`;

            problem.chartData = {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'y = kx',
                        data: this.generatePoints(x => k * x, 0, 10),
                        borderColor: '#6366f1',
                        backgroundColor: 'rgba(99, 102, 241, 0.2)',
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: { type: 'linear', position: 'bottom', title: { display: true, text: 'x' } },
                        y: { title: { display: true, text: 'y' }, beginAtZero: true }
                    }
                }
            };
        }

        return problem;
    }

    // --- NIVÅ 2: Middels (y = kx vs y = k/x) ---
    generateLevel2() {
        const type = this.getRandomInt(1, 2);
        let problem = {};

        if (type === 1) {
            // Inverse proportion
            const workers1 = this.getRandomInt(2, 5);
            const hours1 = this.getRandomInt(10, 40);
            const totalWork = workers1 * hours1;
            const workers2 = workers1 + this.getRandomInt(2, 4);
            const ans = this.round(totalWork / workers2);

            problem.text = `Det tar ${workers1} personer ${hours1} timer å male et hus. <br>
                            Vi antar at alle jobber like effektivt (omvendt proporsjonalitet). <br><br>
                            Hvor lang tid vil det ta hvis ${workers2} personer gjør samme jobben?
                            Oppgi svaret med to desimaler.`;

            problem.solution = `Dette er omvendt proporsjonalitet: y = k/x eller x · y = k. <br>
                                Konstant arbeidsmengde k = ${workers1} · ${hours1} = ${totalWork} timeverk. <br>
                                Med ${workers2} personer blir tiden: <br>
                                y = ${totalWork}/${workers2} = ca. ${ans} timer`;
        } else {
            // GRAPH PROBLEM NO 2: Identify inverse proportion
            const k = 12;
            problem.text = `Se på grafen over. Hvilken type sammenheng viser denne? <br>
                            A) Direkte proporsjonal ("jo mer, jo mer") <br>
                            B) Omvendt proporsjonal ("jo mer, jo mindre") <br>
                            C) Lineær men ikke proporsjonal`;

            problem.solution = `<strong>B) Omvendt proporsjonal.</strong> <br><br>
                                Grafen er en hyperbel. Når x øker, minker y, og produktet x·y er konstant (${k}).`;

            problem.chartData = {
                type: 'line',
                data: {
                    datasets: [{
                        label: 'y = 12/x',
                        data: this.generatePoints(x => k / x, 0.5, 12, 0.5),
                        borderColor: '#ec4899',
                        fill: false
                    }]
                },
                options: {
                    scales: {
                        x: { type: 'linear', position: 'bottom', title: { display: true, text: 'x' } },
                        y: { title: { display: true, text: 'y' } }
                    }
                }
            };
        }
        return problem;
    }

    // --- NIVÅ 3: Avansert (Sammensatte, Anvendelser) ---
    generateLevel3() {
        const type = this.getRandomInt(1, 2);
        let problem = {};

        if (type === 1) {
            const fixed = this.getRandomInt(50, 200);
            const perUnit = this.getRandomInt(10, 30);
            const units = this.getRandomInt(50, 200);

            problem.text = `En drosjetur koster ${fixed} kr i startpris (påslag) og deretter ${perUnit} kr per kilometer. <br><br>
                           a) Er prisen direkte proporsjonal med antall kilometer? Begrunn svaret. <br>
                           b) Regn ut prisen for en tur på ${units} km.`;

            problem.solution = `a) <strong>Nei.</strong> For at det skal være direkte proporsjonalitet (y=kx), må prisen være 0 hvis turen er 0 km. Her er det en startpris på ${fixed} kr. <br><br>
                               b) Funksjonen er lineær: y = ${perUnit}x + ${fixed} <br>
                               y = ${perUnit} · ${units} + ${fixed} = ${perUnit * units + fixed} kr`;
        } else {
            const scale = this.getRandomInt(2, 5);
            const areaOriginal = this.getRandomInt(10, 50);
            const newArea = areaOriginal * (scale * scale);

            problem.text = `En figur på et kart har arealet ${areaOriginal} cm². <br>
                           Vi forstørrer figuren slik at alle sidelengder blir ${scale} ganger så lange (lengdeforholdet er ${scale}:1). <br><br>
                           Hva blir arealet av den forstørrede figuren? (Hint: Arealforholdet er kvadratet av lengdeforholdet)`;

            problem.solution = `Når lengdeforholdet er k = ${scale}, er arealforholdet k² = ${scale}² = ${scale * scale}. <br>
                               Det nye arealet blir derfor: <br>
                               Any = Agml · k² = ${areaOriginal} · ${scale * scale} = ${newArea} cm²`;
        }

        return problem;
    }
}

// UI Setup
document.addEventListener('DOMContentLoaded', () => {
    const generator = new ProblemGenerator();
    const generateBtn = document.getElementById('generate-btn');
    const problemCard = document.getElementById('problem-area');
    const problemText = document.getElementById('problem-text');
    const levelSelect = document.getElementById('level');
    const levelBadge = document.getElementById('level-badge');
    const chartCanvas = document.getElementById('problem-chart');
    const chartContainer = document.querySelector('.chart-container');

    const toggleSolBtn = document.getElementById('toggle-solution-btn');
    const solutionArea = document.getElementById('solution-area');
    const solutionText = document.getElementById('solution-text');

    function displayProblem() {
        const level = parseInt(levelSelect.value);
        generator.setLevel(level);
        const problem = generator.generate();

        levelBadge.textContent = 'Nivå ' + level;
        problemText.innerHTML = problem.text;
        solutionText.innerHTML = problem.solution;

        // Handle Chart
        if (generator.chartInstance) {
            generator.chartInstance.destroy();
            generator.chartInstance = null;
        }

        if (problem.chartData) {
            chartContainer.style.display = 'block';
            const ctx = chartCanvas.getContext('2d');
            // Apply common chart options for dark theme
            const commonOptions = {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#f8fafc' } }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: '#94a3b8' }
                    },
                    y: {
                        grid: { color: 'rgba(255,255,255,0.1)' },
                        ticks: { color: '#94a3b8' }
                    }
                }
            };

            // Merge options
            const options = { ...commonOptions, ...problem.chartData.options };
            // Merge scales deeply if needed (simplified here)
            if (problem.chartData.options.scales) {
                options.scales.x = { ...commonOptions.scales.x, ...problem.chartData.options.scales.x };
                options.scales.y = { ...commonOptions.scales.y, ...problem.chartData.options.scales.y };
            }

            generator.chartInstance = new Chart(ctx, {
                type: problem.chartData.type,
                data: problem.chartData.data,
                options: options
            });
        } else {
            chartContainer.style.display = 'none';
        }

        // Reset UI
        problemCard.style.display = 'block';
        solutionArea.classList.add('hidden');
        toggleSolBtn.textContent = 'Vis Løsning';
    }

    generateBtn.addEventListener('click', () => {
        // Animation effect
        problemCard.style.opacity = '0.5';
        setTimeout(() => {
            displayProblem();
            problemCard.style.opacity = '1';
        }, 150);
    });

    toggleSolBtn.addEventListener('click', () => {
        if (solutionArea.classList.contains('hidden')) {
            solutionArea.classList.remove('hidden');
            toggleSolBtn.textContent = 'Skjul Løsning';
        } else {
            solutionArea.classList.add('hidden');
            toggleSolBtn.textContent = 'Vis Løsning';
        }
    });

    // Initial load
    displayProblem();
});
