from langgraph.graph import StateGraph, START, END

from .supervisor import supervisor_node
from .supervisor_finish import supervisor_finish
from .validator import validator_node
from .enhancer import enhancer_node
from .specialized_agent import water_node, monitoring_node, production_node, supply_chain_node, sustainability_node, commercialization_node, risk_node
from .routing import route_supervisor
from .state import AgentState

def create_complete_workflow():
    """Crea el workflow completo con todos los agentes."""

    workflow = StateGraph(AgentState)

    workflow.add_node("supervisor", supervisor_node)
    workflow.add_node("enhancer", enhancer_node)
    workflow.add_node("water", water_node)
    workflow.add_node("monitoring", monitoring_node)
    workflow.add_node("production", production_node)
    workflow.add_node("sustainability", sustainability_node)
    workflow.add_node("supply_chain", supply_chain_node)
    workflow.add_node("commercialization", commercialization_node)
    workflow.add_node("risk", risk_node)
    workflow.add_node("validator", validator_node)
    workflow.add_node("supervisor_finish", supervisor_finish)

    workflow.add_edge(START, "supervisor")

    workflow.add_conditional_edges(
        "supervisor",
        route_supervisor,
        {
            "enhancer": "enhancer",
            "water": "water",
            "monitoring": "monitoring",
            "production": "production",
            "sustainability": "sustainability",
            "supply_chain": "supply_chain",
            "commercialization": "commercialization",
            "risk": "risk",
            "validator": "validator",
            "FINISH": END
        }
    )

    workflow.add_edge("enhancer", "supervisor")

    specialist_agents = ["water", "monitoring", "production", "sustainability",
                        "supply_chain", "commercialization", "risk"]

    for agent in specialist_agents:
        workflow.add_edge(agent, "validator")

    workflow.add_edge("validator", "supervisor_finish")

    workflow.add_edge("supervisor_finish", END)

    return workflow.compile()

app = create_complete_workflow()

app_with_checkpoint = app