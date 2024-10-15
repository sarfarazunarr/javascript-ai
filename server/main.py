from fastapi import FastAPI, Body
from pydantic import BaseModel
from generateCode import get_chat_completion
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Payload(BaseModel):
    prompt: str
    mode: str

@app.post("/generate")
async def generate(payload: Payload = Body(...)):
    responsetext = get_chat_completion(payload.prompt, payload.mode)
    response_data = {"message": f"{responsetext}"}
    return response_data