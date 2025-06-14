import random
from langchain_core.tools import tool

# Herramientas de Recursos Hídricos
@tool
def humedad_tool(parcela_id: str) -> str:
    """Obtiene el nivel de humedad del suelo para la parcela específica."""
    moisture_percentage = random.randint(20, 85)
    status = "Óptimo"
    if moisture_percentage < 35:
        status = "Bajo (Necesita riego)"
    elif moisture_percentage > 70:
        status = "Alto (Riesgo de anegamiento)"
    result = f"📊 Humedad parcela {parcela_id}: {moisture_percentage}%. Estado: {status}"
    return result

@tool
def calidad_agua_tool(muestra_id: str) -> str:
    """Analiza la calidad del agua para una muestra específica."""
    ph = round(random.uniform(6.0, 8.5), 1)
    conductividad = random.randint(200, 800)
    calidad = "Buena"
    if ph < 6.5 or ph > 8.0:
        calidad = "Regular"
    if conductividad > 600:
        calidad = "Atención requerida"
    result = f"🧪 Calidad agua - Muestra {muestra_id}: pH {ph}, Conductividad {conductividad} μS/cm. Estado: {calidad}"
    return result

# Herramientas de Monitoreo de Cultivos
@tool
def salud_cultivo_tool(parcela_id: str) -> str:
    """Analiza la salud general del cultivo en una parcela específica."""
    salud_score = random.randint(60, 95)
    plagas = random.choice(["Ninguna", "Pulgones leves", "Hongos detectados", "Trips menores"])
    nutrientes = random.choice(["Óptimo", "Déficit de N", "Exceso de P", "Falta K"])
    result = f"🌱 Salud cultivo {parcela_id}: {salud_score}%. Plagas: {plagas}. Nutrientes: {nutrientes}"
    return result

@tool
def ndvi_tool(parcela_id: str) -> str:
    """Obtiene el índice de vegetación NDVI para evaluación de biomasa."""
    ndvi = round(random.uniform(0.3, 0.9), 2)
    estado = "Excelente" if ndvi > 0.7 else "Bueno" if ndvi > 0.5 else "Regular"
    result = f"🛰️ NDVI parcela {parcela_id}: {ndvi}. Estado biomasa: {estado}"
    return result

# Herramientas de Producción
@tool
def rendimiento_prediccion_tool(parcela_id: str, cultivo: str) -> str:
    """Predice el rendimiento esperado para un cultivo específico."""
    print(f"\n--- Calling rendimiento_prediccion_tool for parcela_id: {parcela_id}, cultivo: {cultivo} ---")
    rendimiento = random.randint(3000, 8000)  # kg/ha
    confianza = random.randint(75, 95)
    result = f"📈 Rendimiento previsto {cultivo} en {parcela_id}: {rendimiento} kg/ha (Confianza: {confianza}%)"
    print(f"--- Tool Result: {result} ---")
    return result

@tool
def optimizacion_recursos_tool(parcela_id: str) -> str:
    """Analiza y sugiere optimización de recursos para la parcela."""
    print(f"\n--- Calling optimizacion_recursos_tool for parcela_id: {parcela_id} ---")
    ahorro_agua = random.randint(10, 30)
    ahorro_fertilizante = random.randint(5, 20)
    mejora_rendimiento = random.randint(8, 25)
    result = f"⚡ Optimización {parcela_id}: Ahorro agua {ahorro_agua}%, fertilizante {ahorro_fertilizante}%, mejora rendimiento {mejora_rendimiento}%"
    print(f"--- Tool Result: {result} ---")
    return result

# Herramientas de Sostenibilidad
@tool
def huella_carbono_tool(parcela_id: str) -> str:
    """Calcula la huella de carbono de la parcela."""
    print(f"\n--- Calling huella_carbono_tool for parcela_id: {parcela_id} ---")
    co2_kg_ha = random.randint(800, 2500)
    rating = "A" if co2_kg_ha < 1200 else "B" if co2_kg_ha < 1800 else "C"
    result = f"🌍 Huella carbono {parcela_id}: {co2_kg_ha} kg CO2/ha. Rating: {rating}"
    print(f"--- Tool Result: {result} ---")
    return result

@tool
def biodiversidad_tool(parcela_id: str) -> str:
    """Evalúa el índice de biodiversidad de la parcela."""
    print(f"\n--- Calling biodiversidad_tool for parcela_id: {parcela_id} ---")
    indice = round(random.uniform(0.4, 0.85), 2)
    especies = random.randint(15, 45)
    result = f"🦋 Biodiversidad {parcela_id}: Índice {indice}, {especies} especies identificadas"
    print(f"--- Tool Result: {result} ---")
    return result

# Herramientas de Cadena de Suministro
@tool
def logistica_tool(origen: str, destino: str) -> str:
    """Optimiza la logística entre origen y destino."""
    print(f"\n--- Calling logistica_tool for origen: {origen}, destino: {destino} ---")
    distancia = random.randint(50, 500)
    costo = random.randint(200, 1500)
    tiempo = random.randint(2, 24)
    result = f"🚛 Logística {origen}→{destino}: {distancia}km, ${costo}, {tiempo}h"
    print(f"--- Tool Result: {result} ---")
    return result

@tool
def inventario_tool(producto: str) -> str:
    """Consulta el inventario actual de un producto."""
    print(f"\n--- Calling inventario_tool for producto: {producto} ---")
    stock = random.randint(100, 5000)
    demanda_semanal = random.randint(200, 800)
    semanas_stock = round(stock / demanda_semanal, 1)
    result = f"📦 Inventario {producto}: {stock} unidades, {semanas_stock} semanas de stock"
    print(f"--- Tool Result: {result} ---")
    return result

# Herramientas de Comercialización
@tool
def precio_mercado_tool(producto: str) -> str:
    """Obtiene precios actuales del mercado para un producto."""
    print(f"\n--- Calling precio_mercado_tool for producto: {producto} ---")
    precio_actual = random.randint(1000, 5000)
    tendencia = random.choice(["📈 Subiendo", "📉 Bajando", "➡️ Estable"])
    variacion = random.randint(-15, 20)
    result = f"💰 Precio {producto}: ${precio_actual}/ton. Tendencia: {tendencia} ({variacion:+d}%)"
    print(f"--- Tool Result: {result} ---")
    return result

@tool
def demanda_mercado_tool(producto: str, region: str) -> str:
    """Analiza la demanda del mercado para un producto en una región."""
    print(f"\n--- Calling demanda_mercado_tool for producto: {producto}, region: {region} ---")
    demanda = random.choice(["Alta", "Media", "Baja"])
    competencia = random.choice(["Alta", "Media", "Baja"])
    oportunidad = random.randint(60, 95)
    result = f"📊 Demanda {producto} en {region}: {demanda}. Competencia: {competencia}. Oportunidad: {oportunidad}%"
    print(f"--- Tool Result: {result} ---")
    return result

# Herramientas de Riesgos
@tool
def clima_pronostico_tool(region: str, dias: int = 7) -> str:
    """Proporciona pronóstico climático para evaluación de riesgos."""
    print(f"\n--- Calling clima_pronostico_tool for region: {region}, dias: {dias} ---")
    temp_max = random.randint(25, 35)
    temp_min = random.randint(15, 22)
    lluvia_prob = random.randint(0, 80)
    viento = random.randint(5, 25)
    result = f"🌤️ Pronóstico {region} ({dias}d): {temp_max}°C/{temp_min}°C, lluvia {lluvia_prob}%, viento {viento}km/h"
    print(f"--- Tool Result: {result} ---")
    return result

@tool
def riesgo_plagas_tool(cultivo: str, region: str) -> str:
    """Evalúa el riesgo de plagas para un cultivo específico."""
    print(f"\n--- Calling riesgo_plagas_tool for cultivo: {cultivo}, region: {region} ---")
    riesgo_nivel = random.choice(["Bajo", "Medio", "Alto"])
    plaga_principal = random.choice(["Pulgones", "Trips", "Hongos", "Nematodos"])
    probabilidad = random.randint(20, 85)
    result = f"🐛 Riesgo plagas {cultivo} en {region}: {riesgo_nivel}. Principal: {plaga_principal} ({probabilidad}%)"
    print(f"--- Tool Result: {result} ---")
    return result

# Organizar herramientas por agente
water_tools = [humedad_tool, calidad_agua_tool]
monitoring_tools = [salud_cultivo_tool, ndvi_tool]
production_tools = [rendimiento_prediccion_tool, optimizacion_recursos_tool]
sustainability_tools = [huella_carbono_tool, biodiversidad_tool]
supply_chain_tools = [logistica_tool, inventario_tool]
commercialization_tools = [precio_mercado_tool, demanda_mercado_tool]
risk_tools = [clima_pronostico_tool, riesgo_plagas_tool]

all_tools = (water_tools + monitoring_tools + production_tools +
             sustainability_tools + supply_chain_tools +
             commercialization_tools + risk_tools)