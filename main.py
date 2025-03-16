from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import requests

app = FastAPI()

class Location(BaseModel):
    latitude: float = Field(..., example=40.7128)
    longitude: float = Field(..., example=-74.0060)

def get_ward_name(latitude: float, longitude: float) -> str:
    """Fetch the ward name using OpenStreetMap (Nominatim) API."""
    url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={latitude}&lon={longitude}"
    headers = {"User-Agent": "WardFinder/1.0"}
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        raise HTTPException(status_code=response.status_code, detail="Error retrieving data from OpenStreetMap")
    
    data = response.json()
    if "address" in data:
        # Try to return the ward name using different address keys.
        return data["address"].get("borough") or data["address"].get("suburb") or "Ward name not found"
    return "Ward name not found"

@app.post("/get-ward")
def get_ward(location: Location):
    ward_name = get_ward_name(location.latitude, location.longitude)
    return {"ward_name": ward_name}
