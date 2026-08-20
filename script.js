function downloadPDF() {
    // Ambil container buat pdf
    const element = document.getElementById('print-container');
    
    // ketentuan pdf
    const opt = {
        margin: 4,
        filename: 'download1.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // generate pdf
    html2pdf().set(opt).from(element).save();
}