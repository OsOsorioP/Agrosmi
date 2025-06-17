from typing import List, Optional
from langchain_core.messages import HumanMessage, AIMessage, ToolMessage, SystemMessage, BaseMessage

from .models.models import ApiChatMessageInput
from typing import List
import json

def format_messages_for_prompt(messages: List[BaseMessage]) -> str:
    formatted = []
    for msg in messages:
        prefix = f"{msg.__class__.__name__}: " # Use class name for type
        content = msg.content
        if isinstance(msg, AIMessage) and msg.tool_calls:
            # Add tool calls representation if present
            content += f"\nTool Calls: {json.dumps(msg.tool_calls, indent=2)}"
        if isinstance(msg, ToolMessage):
             prefix = f"Tool Result ({msg.tool_call_id}): "
        formatted.append(f"{prefix}{content}")
    return "\n".join(formatted)

def convert_to_langchain_message(msg_input: ApiChatMessageInput) -> BaseMessage:
    """Convierte un mensaje de la API (Pydantic) a un mensaje de Langchain."""
    if msg_input.role == "human":
        return HumanMessage(content=msg_input.content)
    elif msg_input.role == "ai":
        # Aquí no estamos reconstruyendo tool_calls desde el cliente,
        # solo el contenido textual de un AIMessage.
        return AIMessage(content=msg_input.content)
    elif msg_input.role == "system":
        return SystemMessage(content=msg_input.content)
    elif msg_input.role == "tool" and msg_input.name and msg_input.tool_call_id:
        return ToolMessage(content=msg_input.content, name=msg_input.name, tool_call_id=msg_input.tool_call_id)
    else:
        print(f"Advertencia: Rol de mensaje desconocido o incompleto '{msg_input.role}' en convert_to_langchain_message. Tratando como HumanMessage.")
        return HumanMessage(content=f"({msg_input.role} - original): {msg_input.content}")

def convert_from_langchain_message(lc_msg: BaseMessage) -> ApiChatMessageInput:
    """Convierte un mensaje de Langchain a un mensaje para la API (Pydantic)."""
    role: str = "unknown"
    name: Optional[str] = None
    tool_call_id: Optional[str] = None
    content: str = ""

    if hasattr(lc_msg, 'content'):
        content = str(lc_msg.content)
    
    # Si es un AIMessage y tiene tool_calls, podríamos querer representarlos
    # de alguna manera si el frontend necesita saber sobre ellos.
    # Por ahora, si hay tool_calls y no hay contenido textual, creamos una representación.
    if isinstance(lc_msg, AIMessage) and not content and hasattr(lc_msg, 'tool_calls') and lc_msg.tool_calls:
        tool_calls_str_parts = []
        for tc in lc_msg.tool_calls:
            args_str = ", ".join([f"{k}={v}" for k, v in tc.get('args', {}).items()])
            tool_calls_str_parts.append(f"{tc.get('name', 'unknown_tool')}({args_str})")
        content = f"[Llamando herramientas: {', '.join(tool_calls_str_parts)}]"

    if isinstance(lc_msg, HumanMessage):
        role = "human"
    elif isinstance(lc_msg, AIMessage):
        role = "ai"
    elif isinstance(lc_msg, SystemMessage):
        role = "system"
    elif isinstance(lc_msg, ToolMessage):
        role = "tool"
        name = lc_msg.name
        tool_call_id = lc_msg.tool_call_id
        # El contenido ya está en lc_msg.content
    
    return ApiChatMessageInput(role=role, content=content, name=name, tool_call_id=tool_call_id)