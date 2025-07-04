from langchain_core.messages import HumanMessage, SystemMessage

from ..core.llm_setup import llm
from .state import AgentState, SupervisorDecision
from ..utils import format_messages_for_prompt

async def supervisor_node(state: AgentState) -> AgentState:
    """🎯 Supervisor principal que orquesta todos los agentes."""
    print("\n--- Entering supervisor_node ---")
    
    input_for_routing = state.get("user_input")

    messages = state.get("messages", []) # messages should be a list of BaseMessage

    system_prompt_content = f"""
    🎯 SUPERVISOR AGRÍCOLA MULTI-AGENTE

    Eres el orquestador principal. Tu tarea es analizar la consulta del usuario y el historial
    para decidir qué agente especializado debe procesar la solicitud a continuación.

    📝 CONSULTA ACTUAL: {input_for_routing}
    📚 HISTORIAL DE MENSAJES:{messages}

    🤖 AGENTES DISPONIBLES:

    🚀 enhancer: SIEMPRE PRIMERO si la consulta es ambigua, incompleta o necesita parámetros, al menos que esta sea un saludo, en este caso no es necesario el enhancer (ej. falta ID de parcela, tipo de cultivo).
    🌊 water: Recursos hídricos, riego, humedad, calidad agua.
    🌱 monitoring: Monitoreo cultivos, salud plantas, NDVI, plagas.
    📈 production: Optimización producción, rendimientos, recursos.
    🌍 sustainability: Sostenibilidad, huella carbono, biodiversidad.
    🚛 supply_chain: Cadena suministro, logística, inventarios.
    💰 commercialization: Comercialización, precios, demanda mercado.
    ⚠️ risk: Gestión riesgos, pronósticos, prevención plagas.

    🎯 LÓGICA DE DECISIÓN:
    1. Si es la primera vez procesando esta consulta O si el enhancer acaba de correr y la consulta aún parece necesitar clarificación/parámetros → enhancer (aunque enhancer ya corrió, el supervisor puede decidir que necesita otra pasada si el resultado no fue suficiente, pero generalmente enhancer corre una vez al inicio si es necesario).
    2. Si la consulta es un simple saludo, responde directamente, no es necesario enrutar a el agente enhancer.
    3. Si la consulta es clara y se relaciona con agua/riego/humedad/calidad agua → water
    4. Si la consulta es clara y se relaciona con salud/plagas/monitoreo/NDVI → monitoring
    5. Si la consulta es clara y se relaciona con producción/rendimiento/recursos → production
    6. Si la consulta es clara y se relaciona con sostenible/carbono/biodiversidad → sustainability
    7. Si la consulta es clara y se relaciona con logística/transporte/inventario → supply_chain
    8. Si la consulta es clara y se relaciona con precio/mercado/venta → commercialization
    9. Si la consulta es clara y se relaciona con riesgo/clima/pronóstico → risk
    10. Si la consulta es una pregunta general simple que no requiere un especialista o herramientas → `direct_response` (proporciona la respuesta tú mismo en 'direct_response')
    11. Si la tarea parece completada (ej. un agente ya proporcionó una respuesta y fue validada) → FINISH

    🚨 IMPORTANTE: Considera el historial para evitar bucles y recordar la conversación con el usuario. Si un agente ya corrió y no resolvió la consulta, decide si otro agente es más apropiado o si la tarea no se puede completar.

    Responde con un JSON que contenga 'next_agent' ('enhancer', 'water', etc., 'direct_response', o 'FINISH'), 'reason', y opcionalmente 'direct_response'.
    """
    system_message = SystemMessage(content=system_prompt_content)
    if not input_for_routing or input_for_routing.strip() == "":
        print("❌ Error: input_for_routing está vacío. No se puede invocar al LLM.")
        state["agent_output"] = "Por favor, proporciona una consulta."
        state["next_agent"] = "FINISH" # O pedir al usuario que reintente
        state["reason"] = "Input vacío para el supervisor."
        state["last_agent"] = "supervisor"
        return state
    user_message = HumanMessage(content=input_for_routing) # Use the potentially enhanced input

    try:
        # Use the potentially enhanced input for the supervisor's decision
        response = await llm.with_structured_output(SupervisorDecision).ainvoke([
            system_message,
            user_message
        ])

        # Update state fields using dictionary assignment
        state["next_agent"] = response.next_agent
        state["reason"] = response.reason

        # Handle direct response
        if response.next_agent == "direct_response":
            state["agent_output"] = response.direct_response
            state["next_agent"] = "validator" 
            print(f"🎯 ROUTING: direct_response -> validator")
            print(f"📝 RAZÓN: {response.reason}")
            print(f"✍️ RESPUESTA DIRECTA: {response.direct_response}")
        else:
            print(f"🎯 ROUTING: {response.next_agent}")
            print(f"📝 RAZÓN: {response.reason}")

    except Exception as e:
        print(f"❌ Error en supervisor: {e}")
        state["agent_output"] = "Lo siento, hubo un error procesando tu consulta."
        state["next_agent"] = "FINISH"
        state["reason"] = f"Error interno del supervisor: {e}"
        print(f"🎯 ROUTING: FINISH (Error)")

    state["last_agent"] = "supervisor"
    print("--- Exiting supervisor_node ---")
    return state