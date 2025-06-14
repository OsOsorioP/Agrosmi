from fastapi import APIRouter, HTTPException
from langchain_core.messages import HumanMessage 

from ..agents.graph import app_with_checkpoint
from ..models.models import ChatRequest

router = APIRouter()

@router.post("/chat")
async def chat_with_agent(request: ChatRequest):
    print(f"\nRecibida consulta: {request.consulta} para thread: {request.thread_id}")
    try:
        initial_state = {
            "user_input": request.consulta,
            "original_input": request.consulta,
            "messages": [HumanMessage(content=request.consulta)], 
        }

        config = {"configurable": {"thread_id": request.thread_id}}

        final_state_snapshot = await app_with_checkpoint.ainvoke(initial_state, config=config)
        final_state_values = final_state_snapshot.values

        final_response = final_state_values.get("validated_output", final_state_values.get("agent_output", "Lo siento, no pude procesar la consulta."))
        tool_results = final_state_values.get("tool_results", "")
        last_agent = final_state_values.get("last_agent", "unknown")
        validation_passed = final_state_values.get("validation_passed", False)


        # Retorna la respuesta como JSON
        return {
            "response": final_response,
            "thread_id": request.thread_id,
            "tool_results": tool_results,
            "last_agent": last_agent,
            "validation_passed": validation_passed
        }

    except Exception as e:
        print(f"Error en el endpoint /chat: {e}")
        return {
            "response": f"Ocurrió un error interno: {e}",
            "thread_id": request.thread_id,
            "error": str(e)
        }, 500 