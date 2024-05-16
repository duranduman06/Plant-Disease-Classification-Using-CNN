from flask import Flask, render_template, request, jsonify
import tensorflow as tf
from keras.models import load_model
from keras.preprocessing import image
import numpy as np
import os

def predict(model, img_path, class_names):
    # Resmi yükle ve modele uygun formata getir
    img = tf.keras.preprocessing.image.load_img(img_path, target_size=(256, 256))
    img_array = tf.keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)

    # Tahmin yap
    predictions = model.predict(img_array)

    # Print predictions with values in [0, 1] range
    predictions_decimals = [f'{value:.10f}' for value in predictions[0]]
    print(predictions_decimals)

    # Tahmin edilen sınıfı bul
    predicted_class_index = np.argmax(predictions[0])
    predicted_class = class_names[predicted_class_index]
    #confidence = predictions[0][predicted_class_index] * 100

    return predicted_class

app = Flask(__name__)

MODEL_PATH = 'model.h5'
model = load_model(MODEL_PATH)
class_names =['Potato___Early_blight','Potato___Late_blight', 'Potato___healthy']


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = request.files['file']
        if file:

            file_path = os.path.join('static/uploads', file.filename)
            file.save(file_path)

            prediction = predict(model,file_path,class_names)

            return jsonify({'prediction': prediction})

    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
