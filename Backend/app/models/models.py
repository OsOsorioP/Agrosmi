from pydantic import BaseModel 

class ChatRequest(BaseModel):
    consulta: str
    thread_id: str = "default_thread"