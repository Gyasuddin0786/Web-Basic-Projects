const display = document.getElementById('display');

function appendNumber(value) {
    if (display.value === '0' && value !== '.') {
        display.value = value; 
    } else {
        display.value += value; 
    }
}

function clearDisplay() {
    display.value = '0';
}

function calculate() {
    try {
        display.value = eval(display.value);
    } catch (error) {
        display.value = 'Error'; 
    }
}
