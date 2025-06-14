from langchain_core.messages import AIMessage, BaseMessage, ToolMessage

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

