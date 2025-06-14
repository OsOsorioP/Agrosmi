from langchain_core.messages import HumanMessage, SystemMessage, AIMessage, ToolMessage

from .state import AgentState
from ..core.llm_setup import llm

async def create_specialized_agent(state: AgentState, node_name: str, title: str, tools: list, description: str) -> AgentState:
    """Función auxiliar para crear agentes especializados con herramientas."""

    user_input = state.get("user_input", "")
    messages = state.get("messages", [])

    tool_descriptions = "\n".join([f"- {tool.name}: {tool.description}" for tool in tools])

    system_prompt_content = f"""
    {title}

    DESCRIPCIÓN: {description}

    **HERRAMIENTAS DISPONIBLES**:
    {tool_descriptions}

    **INSTRUCCIONES**:
    1. Analiza la consulta del usuario y el historial de conversación.
    2. Usa las herramientas necesarias para obtener datos específicos.
    3. Proporciona respuestas técnicas precisas y prácticas.
    4. Incluye recomendaciones actionables.
    5. Sé específico con datos y mediciones.

    USA LAS HERRAMIENTAS cuando necesites datos específicos, no inventes información.
    Si ya has usado herramientas y tienes los resultados (ver historial), usa esos resultados para formar tu respuesta final.
    Si la consulta no requiere herramientas o ya tienes los datos, proporciona la respuesta directamente.
    """
    system_message = SystemMessage(content=system_prompt_content)

    messages_for_llm = [system_message] + [
        msg for msg in messages
        if isinstance(msg, (HumanMessage, AIMessage, ToolMessage)) 
    ]

    llm_with_tools = llm.bind_tools(tools)

    try:
        response = await llm_with_tools.ainvoke(messages_for_llm)

        state["messages"].append(response)
        state["agent_output"] = response.content 

        if hasattr(response, 'tool_calls') and response.tool_calls:
            state["needs_tools"] = True
            tool_results_list = []
            tool_messages = []

            for tool_call in response.tool_calls:
                tool_name = tool_call["name"]
                tool_args = tool_call.get("args", {})

                try:
                    tool_found = False
                    for tool in tools:
                        if tool.name == tool_name:
                            result = tool.invoke(tool_args)
                            tool_results_list.append(f"Resultado de {tool_name}: {result}")
                            tool_messages.append(ToolMessage(content=result, tool_call_id=tool_call['id']))
                            tool_found = True
                            break
                    if not tool_found:
                         error_msg = f"Error: Herramienta '{tool_name}' no encontrada."
                         tool_results_list.append(error_msg)
                         # Create ToolMessage for the error
                         tool_messages.append(ToolMessage(content=error_msg, tool_call_id=tool_call['id']))

                except Exception as e:
                    error_msg = f"Error ejecutando herramienta {tool_name}: {e}"
                    tool_results_list.append(error_msg)
                    tool_messages.append(ToolMessage(content=error_msg, tool_call_id=tool_call['id']))

            state["tool_results"] = "\n".join(tool_results_list)

            state["messages"].extend(tool_messages)

            messages_after_tools = [system_message] + [
                 msg for msg in state["messages"] 
                 if isinstance(msg, (HumanMessage, AIMessage, ToolMessage))
            ]

            final_response_obj = await llm.ainvoke(messages_after_tools)

            state["messages"].append(final_response_obj)

            state["agent_output"] = final_response_obj.content 

        else:
            state["needs_tools"] = False
            state["tool_results"] = "No tools were needed."

    except Exception as e:
        state["agent_output"] = f"Hubo un error procesando la consulta especializada en {title.split(' ')[1].lower()}."
        state["tool_results"] = "Error during agent execution."
        state["messages"].append(AIMessage(content=state["agent_output"]))


    state["last_agent"] = node_name
    return state