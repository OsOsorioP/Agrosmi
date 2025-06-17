from typing import Literal,List
from pydantic import BaseModel, Field
from langgraph.graph import MessagesState

class AgentState(MessagesState):
    #messages: List[BaseMessage]
    user_input: str = Field(description="The current input being processed (might be enhanced)")
    original_input: str = Field(description="The initial input from the user")
    enhanced_input: str = Field(default="", description="Result of the enhancer")
    agent_output: str = Field(default="", description="The final output from the last agent before validation/finish")
    validated_output: str = Field(default="", description="The output after validation (might be corrected)")
    next_agent: str = Field(default="", description="Decision from supervisor")
    reason: str = Field(default="", description="Reason for supervisor decision")
    needs_tools: bool = Field(default=False, description="Flag if the agent needed tools")
    tool_results: str = Field(default="", description="String summary of tool results")
    validation_passed: bool = Field(default=False, description="Result of validation")
    enhancement_applied: bool = Field(default=False, description="Flag if enhancer modified the input")
    last_agent: str = Field(default="", description="The name of the agent that last ran")
    
class SupervisorDecision(BaseModel):
    next_agent: Literal[
        "enhancer", "water", "monitoring", "production", "sustainability",
        "supply_chain", "commercialization", "risk", "direct_response", "FINISH"
    ] = Field(description="Siguiente agente a activar")
    reason: str = Field(description="Justificación de la decisión")
    direct_response: str = Field(default="", description="Respuesta directa si aplica")

class EnhancementResult(BaseModel):
    enhanced_input: str = Field(description="Input mejorado y clarificado")
    needs_enhancement: bool = Field(description="Si el input necesitaba mejora")
    improvements: str = Field(description="Descripción de las mejoras aplicadas")

class ValidationResult(BaseModel):
    is_valid: bool = Field(description="Si la respuesta es válida y precisa")
    validation_score: int = Field(description="Puntuación de validación (0-100)")
    feedback: str = Field(description="Comentarios sobre la validación")
    corrected_response: str = Field(default="", description="Respuesta corregida si es necesario")