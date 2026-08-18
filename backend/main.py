from pathlib import Path
import pickle
import os
from dotenv import load_dotenv

load_dotenv()

# pyrefly: ignore [missing-import]
import nltk

nltk.download("punkt_tab")
nltk.download("stopwords")

# pyrefly: ignore [missing-import]
from fastapi import FastAPI
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
# pyrefly: ignore [missing-import]
from pydantic import BaseModel

from preprocessing import transform_text


# --------------------------------------------------
# Paths
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_PATH = BASE_DIR / "model.pkl"
VECTORIZER_PATH = BASE_DIR / "vectorizer.pkl"

BASE_DIR = Path(__file__).resolve().parent

ENV_PATH = BASE_DIR / ".env"

load_dotenv(ENV_PATH)

FRONTEND_URL = os.getenv("FRONTEND_URL")

print("CORS FRONTEND_URL:", FRONTEND_URL)


# --------------------------------------------------
# Load trained model and vectorizer
# --------------------------------------------------

with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)

with open(VECTORIZER_PATH, "rb") as file:
    vectorizer = pickle.load(file)


# --------------------------------------------------
# FastAPI application
# --------------------------------------------------

app = FastAPI(
    title="Spam Detection API",
    description="API for detecting spam messages",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
        allow_credentials=True,

    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# Request schema
# --------------------------------------------------

class PredictionRequest(BaseModel):
    message: str


# --------------------------------------------------
# Health check
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Spam Detection API is running"
    }


# --------------------------------------------------
# Prediction endpoint
# --------------------------------------------------

@app.post("/predict")
def predict(request: PredictionRequest):

    message = request.message

    # 1. Preprocess message
    transformed_message = transform_text(message)

    # 2. Transform using trained TF-IDF vectorizer
    vectorized_message = vectorizer.transform([transformed_message])

    # 3. Predict using trained MultinomialNB model
    prediction = model.predict(vectorized_message)[0]

    # 4. Convert prediction to spam/ham
    if prediction == 1:
        result = "spam"
    else:
        result = "not spam"

    return {
        "message": message,
        "prediction": result
    }