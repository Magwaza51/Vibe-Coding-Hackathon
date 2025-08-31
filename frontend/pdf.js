// Handles PDF generation for prescriptions/certificates
export function downloadPrescription() {
    const element = document.createElement('a');
    const text = 'Prescription: \n' + document.getElementById('aiResult').innerText;
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'prescription.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
