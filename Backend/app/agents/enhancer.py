from langchain_core.messages import HumanMessage, SystemMessage

from ..core.llm_setup import llm
from .state import AgentState, EnhancementResult

async def enhancer_node(state: AgentState) -> AgentState:
    """🚀 Agente que mejora el input del usuario."""

    user_input = state.get("user_input", "")

    system_prompt_content = f"""
    🚀 MEJORADOR DE CONSULTAS AGRÍCOLAS

    Tu misión: Mejorar y clarificar la consulta del usuario para optimizar las respuestas de los agentes especializados.

    📝 CONSULTA ORIGINAL: {user_input}

    🎯 MEJORAS A APLICAR:
    1. Clarificar términos ambiguos
    2. Agregar contexto técnico relevante
    3. Especificar parámetros faltantes (ej. ID de parcela, tipo de cultivo, región) si son necesarios para la consulta.
    4. Estructurar la consulta de forma óptima para un agente especializado.
    5. Identificar información implícita.

    💡 EJEMPLOS:
    - "humedad parcela" → "¿Cuál es el nivel de humedad del suelo en la parcela [ID] para determinar necesidades de riego?"
    - "problema cultivo" → "¿Qué problemas de salud, plagas o nutrientes presenta el cultivo [tipo] en la parcela [ID]?"

    ⚡ Si la consulta ya es clara y específica, indica que no necesita mejora y devuelve el input original.
    """
    system_message = SystemMessage(content=system_prompt_content)
    user_message = HumanMessage(content=user_input)
    

    try:
        response = await llm.with_structured_output(EnhancementResult).ainvoke([
            system_message,
            user_message
        ])

        state["enhanced_input"] = response.enhanced_input
        state["enhancement_applied"] = response.needs_enhancement
        

    except Exception as e:
        state["enhanced_input"] = user_input
        state["enhancement_applied"] = False

    state["last_agent"] = "enhancer"

    return state