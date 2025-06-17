from .state import AgentState
from .tools import water_tools, monitoring_tools, commercialization_tools, sustainability_tools,production_tools,supply_chain_tools, risk_tools
from .create_agent import create_specialized_agent

async def water_node(state: AgentState) -> AgentState:
    """🌊 Agente especializado en recursos hídricos."""
    return await create_specialized_agent(
        state,
        "water",
        "🌊 ESPECIALISTA EN RECURSOS HÍDRICOS",
        water_tools,
        "Analiza todo lo relacionado con agua, riego, humedad del suelo y calidad del agua."
    )

async def monitoring_node(state: AgentState) -> AgentState:
    """🌱 Agente de monitoreo y diagnóstico de cultivos."""
    return await create_specialized_agent(
        state,
        "monitoring",
        "🌱 ESPECIALISTA EN MONITOREO DE CULTIVOS",
        monitoring_tools,
        "Monitorea la salud de cultivos, detecta plagas, analiza biomasa y diagnóstica problemas."
    )

async def production_node(state: AgentState) -> AgentState:
    """📈 Agente de optimización de la producción."""
    return await create_specialized_agent(
        state,
        "production",
        "📈 ESPECIALISTA EN OPTIMIZACIÓN DE PRODUCCIÓN",
        production_tools,
        "Optimiza la producción agrícola, predice rendimientos y mejora el uso de recursos."
    )

async def sustainability_node(state: AgentState) -> AgentState:
    """🌍 Agente de sostenibilidad y prácticas agrícolas."""
    return await create_specialized_agent(
        state,
        "sustainability",
        "🌍 ESPECIALISTA EN SOSTENIBILIDAD AGRÍCOLA",
        sustainability_tools,
        "Evalúa sostenibilidad, huella de carbono, biodiversidad y prácticas agrícolas eco-friendly."
    )

async def supply_chain_node(state: AgentState) -> AgentState:
    """🚛 Agente de optimización de la cadena de suministro."""
    return await create_specialized_agent(
        state,
        "supply_chain",
        "🚛 ESPECIALISTA EN CADENA DE SUMINISTRO",
        supply_chain_tools,
        "Optimiza logística, gestiona inventarios y mejora la eficiencia de la cadena de suministro."
    )

async def commercialization_node(state: AgentState) -> AgentState:
    """💰 Agente de intermediación y comercialización."""
    return await create_specialized_agent(
        state,
        "commercialization",
        "💰 ESPECIALISTA EN COMERCIALIZACIÓN AGRÍCOLA",
        commercialization_tools,
        "Analiza mercados, precios, demanda y oportunidades de comercialización."
    )

async def risk_node(state: AgentState) -> AgentState:
    """⚠️ Agente de predicción y mitigación de riesgos."""
    return await create_specialized_agent(
        state,
        "risk",
        "⚠️ ESPECIALISTA EN GESTIÓN DE RIESGOS AGRÍCOLAS",
        risk_tools,
        "Predice y mitiga riesgos climáticos, fitosanitarios y de producción."
    )