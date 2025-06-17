# app/models/models.py
from pydantic import BaseModel
from typing import List, Optional

class ApiChatMessageInput(BaseModel):
    role: str
    content: str
    name: Optional[str] = None
    tool_call_id: Optional[str] = None

class ChatRequest(BaseModel):
    user_input: str 
    messages_history: List[ApiChatMessageInput]
    thread_id: str