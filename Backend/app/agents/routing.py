from typing import Dict, Any

def route_supervisor(state: Dict[str, Any]) -> str:
    """Routing desde supervisor."""

    next_agent = state.get("next_agent", "FINISH")


    valid_agents = [
        "enhancer", "water", "monitoring", "production", "sustainability",
        "supply_chain", "commercialization", "risk", "validator", "FINISH"
    ]

    if next_agent in valid_agents:
        return next_agent
    else:
        return "FINISH"

def route_enhancer() -> str:
    """Routing desde enhancer de vuelta a supervisor."""
    return "supervisor"

def route_agents_to_validator() -> str:
    """Routing de agentes especializados a validator."""
    return "validator"

def route_validator() -> str:
    """Routing desde validator."""
    return "supervisor_finish"