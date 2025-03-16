from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

app = FastAPI()

w_final = np.array([-0.35767389,3.00613964,1.29421557,-9.9650363,0.60955287])
b_final = 43.86

mean_values = np.array([2.28955016e+03, 6.43213592e+02, 3.46779935e+02, 2.05448001e-01,1.04482799e+01])  # Example mean values
std_values = np.array( [3.56607420e+03, 7.88993976e+02, 4.69894339e+02, 1.03975411e-01,5.56703628e+00])  # Example standard deviation values

# Define request body model
class InputData(BaseModel):
    a: float
    b: float
    c: float
    d: float
    e: float

def predict(input_data):
    input_array = np.array(input_data)
    input_scaled = (input_array - mean_values) / std_values  # Normalize input
    prediction = np.dot(input_scaled, w_final) + b_final
    
    if(prediction>100):
        prediction = 100
    return prediction

@app.post("/points")
def calculate(data: InputData):
    input_values = [data.a, data.b, data.c, data.d, data.e]
    result = predict(input_values)
    return {"result": result}

