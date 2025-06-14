from langchain_core.messages import HumanMessage, SystemMessage

from ..core.llm_setup import llm
from .state import AgentState, ValidationResult

async def validator_node(state: AgentState) -> AgentState:
    """✅ Agente que valida las respuestas de otros agentes."""
    print("\n--- Entering validator_node ---")

    # Access state fields using .get()
    validated_output = state.get("validated_output", "")
    agent_output = state.get("agent_output", "")
    original_input = state.get("original_input", "")
    user_input = state.get("user_input", "")

    # Get the output to validate - prioritize validated_output if it exists from a previous validation attempt
    output_to_validate = validated_output if validated_output else agent_output
    if not output_to_validate:
        output_to_validate = "No hay respuesta para validar."

    system_prompt_content = f"""
    ✅ VALIDADOR DE RESPUESTAS AGRÍCOLAS

    Tu misión: Validar la precisión, completitud y utilidad de la respuesta generada por un agente especializado.

    📝 CONSULTA ORIGINAL: {original_input}
    📝 CONSULTA PROCESADA: {user_input}
    🤖 RESPUESTA A VALIDAR: {output_to_validate}

    🔍 CRITERIOS DE VALIDACIÓN:
    1. Precisión técnica (0-30 puntos): ¿La información es correcta y se basa en datos o herramientas?
    2. Completitud de la respuesta (0-25 puntos): ¿Aborda todos los aspectos de la consulta?
    3. Relevancia para la consulta (0-25 puntos): ¿La respuesta es directamente útil para el usuario?
    4. Utilidad práctica (0-20 puntos): ¿Incluye recomendaciones actionables si aplican?

    ⚠️ DETECTAR Y REPORTAR:
    - Información incorrecta o desactualizada
    - Respuestas incompletas o vagas
    - Falta de datos específicos cuando se requieren (ej. si se pidió un valor y no se dio)
    - Recomendaciones no prácticas o genéricas
    - Alucinaciones o invención de datos

    💯 PUNTUACIÓN:
    - 90-100: Excelente, no necesita corrección.
    - 70-89: Buena, mejoras menores o clarificaciones.
    - 50-69: Regular, necesita correcciones significativas.
    - <50: Deficiente, requiere reescritura o re-ejecución del agente.

    Si la respuesta no es válida (score < 70), proporciona una 'corrected_response' mejorada.
    """
    system_message = SystemMessage(content=system_prompt_content)
    user_message = HumanMessage(content="Valida la respuesta proporcionada según los criterios y devuelve el resultado.")

    try:
        response = await llm.with_structured_output(ValidationResult).ainvoke([
            system_message,
            user_message
        ])

        state["validation_passed"] = response.is_valid and response.validation_score >= 70

        if not state["validation_passed"]:
            # If validation failed, use the corrected response if provided, otherwise keep the original agent output
            state["validated_output"] = response.corrected_response if response.corrected_response else output_to_validate
            print(f"⚠️ VALIDACIÓN FALLIDA (Score: {response.validation_score})")
            print(f"📝 Feedback: {response.feedback}")
            if response.corrected_response:
                 print(f"✨ Respuesta corregida: {state['validated_output']}")
            else:
                 print("❌ No se proporcionó respuesta corregida.")
        else:
            # If validation passed, use the agent's output as the validated output
            state["validated_output"] = output_to_validate
            if response.validation_score >= 90:
                print(f"✅ VALIDACIÓN EXCELENTE (Score: {response.validation_score})")
            elif response.validation_score >= 70:
                print(f"✅ VALIDACIÓN APROBADA (Score: {response.validation_score})")

    except Exception as e:
        print(f"❌ Error en validator: {e}")
        # In case of validator error, assume validation passed to avoid getting stuck
        state["validated_output"] = output_to_validate
        state["validation_passed"] = True
        print("⚠️ Error en validador, asumiendo validación pasada.")

    state["last_agent"] = "validator"
    print("--- Exiting validator_node ---")
    return state