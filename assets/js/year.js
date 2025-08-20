document.addEventListener('DOMContentLoaded', function() {
    const currentYearElements = document.querySelectorAll('#current-year');
    const currentYear = new Date().getFullYear();
    
    currentYearElements.forEach(function(element) {
        if (element) {
            element.textContent = currentYear;
        }
    });
});