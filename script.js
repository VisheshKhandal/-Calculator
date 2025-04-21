// Particle Animation
class ParticleAnimation {
    constructor() {
        this.container = document.getElementById('particleContainer');
        this.particles = [];
        this.particleCount = 50;
        this.init();
    }

    init() {
        for (let i = 0; i < this.particleCount; i++) {
            this.createParticle();
        }
    }

    createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random initial position
        const x = Math.random() * window.innerWidth;
        const delay = Math.random() * 20;
        
        particle.style.left = `${x}px`;
        particle.style.animationDelay = `${delay}s`;
        
        this.container.appendChild(particle);
        this.particles.push(particle);
        
        // Remove and recreate particle after animation ends
        particle.addEventListener('animationend', () => {
            particle.remove();
            this.particles = this.particles.filter(p => p !== particle);
            this.createParticle();
        });
    }
}

// Calculator Class
class Calculator {
    constructor() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.memory = 0;
        this.history = [];
        this.isNewNumber = true;
        this.isScientificMode = false;
        
        this.display = document.getElementById('currentInput');
        this.historyDisplay = document.getElementById('history');
        this.themeToggle = document.getElementById('themeToggle');
        this.calculator = document.getElementById('calculator');
        this.calculatorContainer = document.getElementById('calculatorContainer');
        this.welcomeContainer = document.getElementById('welcomeContainer');
        this.startButton = document.getElementById('startButton');
        this.endButton = document.getElementById('endButton');
        this.goodbyeMessage = document.getElementById('goodbyeMessage');
        
        this.initializeEventListeners();
        this.updateDisplay();
        
        // Initialize particle animation
        new ParticleAnimation();
    }

    initializeEventListeners() {
        // Number buttons
        document.querySelectorAll('.btn[data-action]').forEach(button => {
            const action = button.dataset.action;
            if (!isNaN(action) || action === 'decimal') {
                button.addEventListener('click', () => this.handleNumberInput(action));
            }
        });

        // Operation buttons
        document.querySelectorAll('.btn[data-action]').forEach(button => {
            const action = button.dataset.action;
            if (['add', 'subtract', 'multiply', 'divide'].includes(action)) {
                button.addEventListener('click', () => this.handleOperator(action));
            }
        });

        // Equals button
        document.querySelector('.btn[data-action="equals"]').addEventListener('click', () => this.calculate());

        // Clear button
        document.querySelector('.btn[data-action="clear"]').addEventListener('click', () => this.clear());

        // Backspace button
        document.querySelector('.btn[data-action="backspace"]').addEventListener('click', () => this.backspace());

        // Memory buttons
        document.getElementById('mc').addEventListener('click', () => this.clearMemory());
        document.getElementById('mr').addEventListener('click', () => this.recallMemory());
        document.getElementById('mPlus').addEventListener('click', () => this.addToMemory());
        document.getElementById('mMinus').addEventListener('click', () => this.subtractFromMemory());

        // Scientific functions
        document.querySelectorAll('.btn.scientific').forEach(button => {
            const action = button.dataset.action;
            if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'pow', 'fact'].includes(action)) {
                button.addEventListener('click', () => this.handleScientificFunction(action));
            }
        });

        // Theme toggle
        this.themeToggle.addEventListener('click', () => this.toggleTheme());

        // Start button
        this.startButton.addEventListener('click', () => this.startCalculator());

        // End button
        this.endButton.addEventListener('click', () => this.endCalculator());
    }

    handleNumberInput(number) {
        if (this.isNewNumber) {
            this.currentInput = number;
            this.isNewNumber = false;
        } else {
            if (this.currentInput.length < 15) {
                this.currentInput += number;
            }
        }
        this.updateDisplay();
    }

    handleOperator(operator) {
        if (this.operation && !this.isNewNumber) {
            this.calculate();
        }
        this.operation = operator;
        this.previousInput = this.currentInput;
        this.isNewNumber = true;
        this.updateDisplay();
    }

    calculate() {
        if (!this.operation || this.isNewNumber) return;

        const prev = parseFloat(this.previousInput);
        const current = parseFloat(this.currentInput);
        let result;

        switch (this.operation) {
            case 'add':
                result = prev + current;
                break;
            case 'subtract':
                result = prev - current;
                break;
            case 'multiply':
                result = prev * current;
                break;
            case 'divide':
                result = prev / current;
                break;
        }

        this.addToHistory(`${prev} ${this.getOperatorSymbol()} ${current} = ${result}`);
        this.currentInput = result.toString();
        this.operation = null;
        this.isNewNumber = true;
        this.updateDisplay();
    }

    clear() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operation = null;
        this.isNewNumber = true;
        this.updateDisplay();
    }

    backspace() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
            this.isNewNumber = true;
        }
        this.updateDisplay();
    }

    clearMemory() {
        this.memory = 0;
    }

    recallMemory() {
        this.currentInput = this.memory.toString();
        this.isNewNumber = true;
        this.updateDisplay();
    }

    addToMemory() {
        this.memory += parseFloat(this.currentInput);
    }

    subtractFromMemory() {
        this.memory -= parseFloat(this.currentInput);
    }

    handleScientificFunction(func) {
        const num = parseFloat(this.currentInput);
        let result;

        switch (func) {
            case 'sin':
                result = Math.sin(num * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(num * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(num * Math.PI / 180);
                break;
            case 'log':
                result = Math.log10(num);
                break;
            case 'ln':
                result = Math.log(num);
                break;
            case 'sqrt':
                result = Math.sqrt(num);
                break;
            case 'pow':
                this.operation = 'pow';
                this.previousInput = this.currentInput;
                this.isNewNumber = true;
                return;
            case 'fact':
                result = this.factorial(num);
                break;
        }

        this.currentInput = result.toString();
        this.addToHistory(`${func}(${num}) = ${result}`);
        this.updateDisplay();
    }

    factorial(n) {
        if (n < 0) return NaN;
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    getOperatorSymbol() {
        switch (this.operation) {
            case 'add': return '+';
            case 'subtract': return '-';
            case 'multiply': return '×';
            case 'divide': return '÷';
            case 'pow': return '^';
            default: return '';
        }
    }

    toggleTheme() {
        document.body.classList.toggle('dark-theme');
        this.themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? 
            '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    }

    addToHistory(entry) {
        this.history.unshift(entry);
        if (this.history.length > 5) {
            this.history.pop();
        }
        this.historyDisplay.textContent = this.history.join('\n');
    }

    updateDisplay() {
        this.display.textContent = this.currentInput;
    }

    startCalculator() {
        // Hide welcome container with animation
        this.welcomeContainer.classList.add('hide');
        
        // Show calculator with animation after a short delay
        setTimeout(() => {
            this.welcomeContainer.style.display = 'none';
            this.calculatorContainer.style.display = 'block';
            setTimeout(() => {
                this.calculatorContainer.classList.add('show');
            }, 50);
        }, 500);
        
        this.clear();
    }

    endCalculator() {
        // Hide calculator with animation
        this.calculatorContainer.classList.remove('show');
        
        // Show goodbye message after calculator is hidden
        setTimeout(() => {
            this.calculatorContainer.style.display = 'none';
            this.goodbyeMessage.style.display = 'block';
            setTimeout(() => {
                this.goodbyeMessage.classList.add('show');
            }, 50);
            
            // Reset after showing goodbye message
            setTimeout(() => {
                this.goodbyeMessage.classList.remove('show');
                setTimeout(() => {
                    this.goodbyeMessage.style.display = 'none';
                    this.welcomeContainer.style.display = 'block';
                    this.welcomeContainer.classList.remove('hide');
                }, 500);
            }, 3000);
        }, 500);
    }
}

// Initialize calculator
const calculator = new Calculator(); 