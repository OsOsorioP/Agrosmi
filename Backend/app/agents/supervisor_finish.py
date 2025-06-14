from langchain_core.messages import AIMessage

from .state import AgentState

async def supervisor_finish(state: AgentState) -> AgentState:
    """🎯 Supervisor final que presenta la respuesta validada."""
    print("\n--- Entering supervisor_finish ---")

    validated_output = state.get("validated_output", "")
    agent_output = state.get("agent_output", "")
    messages = state.get("messages", []) 
    
    final_response_content = validated_output if validated_output else agent_output
    if not final_response_content:
         final_response_content = "No se pudo generar una respuesta final."

    if not messages or not (isinstance(messages[-1], AIMessage) and messages[-1].content == final_response_content):
        state["messages"].append(AIMessage(
            content=final_response_content,
            # You can add metadata here if needed
            # metadata={
            #     "agent": state.get("last_agent", "unknown"), # Access using .get()
            #     "validated": state.get("validation_passed", False), # Access using .get()
            #     "enhanced": state.get("enhancement_applied", False) # Access using .get()
            # }
        ))

    state["agent_output"] = final_response_content
    state["last_agent"] = "supervisor_finish"

    return state