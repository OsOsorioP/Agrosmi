from pydantic_geojson import PolygonModel
from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional

# Para chat

class ApiChatMessageInput(BaseModel):
    role: str
    content: str
    name: Optional[str] = None
    tool_call_id: Optional[str] = None

class ChatRequest(BaseModel):
    user_input: str 
    messages_history: List[ApiChatMessageInput]
    thread_id: str
    
# Para parcelas

class ParcelCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=255, description="Nombre de la parcela")
    description: Optional[str] = Field(None, description="Descripción opcional de la parcela")
    geometry: PolygonModel = Field(..., description="Geometría GeoJSON de la parcela (Polígono)")

class ParcelResponse(ParcelCreate):
    id: int = Field(..., description="ID único de la parcela")
    created_at: datetime = Field(..., description="Fecha y hora de creación de la parcela")

    class Config:
        from_attributes = True # Permite crear el modelo desde atributos de objeto (ej. de un row de DB)