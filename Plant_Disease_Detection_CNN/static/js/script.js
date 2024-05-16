document.getElementById('predict-button').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.getElementById('selected-photo');
            img.src = e.target.result;
            img.style.display = 'block';
            document.getElementById('predict-action').style.display = 'inline-block';
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById('predict-action').addEventListener('click', function() {
    const file = document.getElementById('predict-button').files[0];
    if (!file) {
        alert('Please select an image.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('/', {
        method: 'POST',
        body: formData
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    }).then(data => {
        const predictionResult = data.prediction;
        const confidence = data.confidence;
        const modal = document.getElementById('result-modal');
        const modalContent = modal.querySelector('#prediction-result');
        modalContent.innerHTML = `<br><p>Prediction: ${predictionResult}</p>`;
        modal.style.display = 'block';
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
});


document.querySelector('.close').addEventListener('click', function() {
    document.getElementById('result-modal').style.display = 'none';
});


window.addEventListener('click', function(event) {
    const modal = document.getElementById('result-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});
