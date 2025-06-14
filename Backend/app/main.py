from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.endpoints import router
from dotenv import load_dotenv
load_dotenv()

app_fastapi = FastAPI(
    title="Plataforma Multiagente de Agricultura Sostenible v1",
    description="API para interactuar con el sistema multiagente iterativo.",
    version="0.1.0"
)

origins = ["http://localhost:5173",]

app_fastapi.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True, 
    allow_methods=["*"],    
    allow_headers=["*"],    
    expose_headers=["Content-Type"]
)

app_fastapi.include_router(router, prefix="/api/v1") 