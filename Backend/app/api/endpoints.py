from typing import List

from fastapi import APIRouter, HTTPException, status
from langchain_core.messages import HumanMessage, BaseMessage
from pydantic_geojson import PolygonModel
from psycopg2.extras import RealDictCursor

from ..agents.graph import app_with_checkpoint
from ..models.models import ChatRequest, ApiChatMessageInput, ParcelCreate, ParcelResponse
from ..db.db import get_db_connection
from ..utils import convert_to_langchain_message, convert_from_langchain_message

router = APIRouter()

@router.post("/chat")
async def chat_with_agent(request: ChatRequest):
    print(f"\nRecibida solicitud para thread: {request.thread_id}")
    print(f"Original Query: {request.user_input}")
    print(f"Messages History Recibido: {request.messages_history}")

    try:
        langchain_messages: List[BaseMessage] = []
        if not request.messages_history:
            print("Nueva conversación. Usando original_query como primer mensaje.")
            langchain_messages.append(HumanMessage(content=request.user_input))
        else:
            for msg_input in request.messages_history:
                langchain_messages.append(convert_to_langchain_message(msg_input))
        
        if not langchain_messages: # Doble chequeo
             raise HTTPException(status_code=400, detail="No se proporcionaron mensajes válidos.")

        print(f"Historial Langchain para invocar: {langchain_messages}")

        orchestrator_input_state = {
            "messages": langchain_messages,
            "user_input": request.user_input,
        }

        config = {"configurable": {"thread_id": request.thread_id}}

        final_orchestrator_state_dict = await app_with_checkpoint.ainvoke(orchestrator_input_state, config=config)
        
        print(f"Orquestador finalizado. Estado final del backend: {final_orchestrator_state_dict}")
        
        response_lc_messages: List[BaseMessage] = final_orchestrator_state_dict["messages"]
        api_final_state_messages: List[ApiChatMessageInput] = [convert_from_langchain_message(m) for m in response_lc_messages]

        system_reply_this_turn: List[ApiChatMessageInput] = []
        if api_final_state_messages:
            last_msg_from_system = api_final_state_messages[-1]
            if last_msg_from_system.role == "ai" or last_msg_from_system.role == "system": # La respuesta del sistema puede ser 'ai' o 'system'
                system_reply_this_turn.append(last_msg_from_system)
            else:
                print(f"Advertencia: El último mensaje del estado final no es 'ai' o 'system'. Mensaje: {last_msg_from_system}")
                system_reply_this_turn.append(ApiChatMessageInput(role="ai", content="[Procesamiento completado. Revise el historial.]"))
        else:
            system_reply_this_turn.append(ApiChatMessageInput(role="ai", content="[El sistema no generó una respuesta explícita.]"))


        # 5. Construir la respuesta de la API
        # Esto debe coincidir con ChatResponseData del frontend
        return {
            "response_messages": system_reply_this_turn,
            "final_state_messages": api_final_state_messages,
            "session_id": request.thread_id,
            "error": False,
            "message": "Éxito"
            # "tool_results": final_orchestrator_state_dict.get("tool_results", ""),
            # "last_agent": final_orchestrator_state_dict.get("last_agent", "unknown"),
        }

    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        print(f"Error crítico en el endpoint /chat para thread {request.thread_id}: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Ocurrió un error interno: {str(e)}"
        )
        
@router.post("/api/parcels", response_model=ParcelResponse, status_code=201)
async def create_parcel(parcel: ParcelCreate):
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor) # Para obtener resultados como diccionarios

        # Convertir el objeto Pydantic GeoJSON a string JSON para ST_GeomFromGeoJSON
        geometry_geojson_str = parcel.geometry.model_dump_json()

        query = """
            INSERT INTO parcels (name, description, geometry)
            VALUES (%s, %s, ST_GeomFromGeoJSON(%s, 4326))
            RETURNING id, name, description, ST_AsGeoJSON(geometry) as geometry, created_at;
        """
        cursor.execute(query, (parcel.name, parcel.description, geometry_geojson_str))
        new_parcel = cursor.fetchone()
        conn.commit()

        if not new_parcel:
            raise HTTPException(status_code=500, detail="No se pudo crear la parcela.")

        # Convertir la geometría de vuelta a PolygonModel para la respuesta
        new_parcel['geometry'] = PolygonModel.model_validate_json(new_parcel['geometry'])

        return ParcelResponse(**new_parcel)
    except HTTPException:
        raise # Re-lanza las excepciones HTTP que ya hemos manejado
    except Exception as e:
        print(f"Error al insertar parcela: {e}")
        if conn:
            conn.rollback() # Deshacer la transacción en caso de error
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {e}")
    finally:
        if conn:
            cursor.close()
            conn.close()

# Ruta para obtener todas las parcelas
@router.get("/api/parcels", response_model=List[ParcelResponse])
async def get_all_parcels():
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(cursor_factory=RealDictCursor)

        query = """
            SELECT id, name, description, ST_AsGeoJSON(geometry) as geometry, created_at
            FROM parcels;
        """
        cursor.execute(query)
        parcels_data = cursor.fetchall()

        # Convertir la geometría de cada parcela de string GeoJSON a PolygonModel
        for parcel in parcels_data:
            parcel['geometry'] = PolygonModel.model_validate_json(parcel['geometry'])

        return [ParcelResponse(**parcel) for parcel in parcels_data]
    except Exception as e:
        print(f"Error al obtener parcelas: {e}")
        raise HTTPException(status_code=500, detail=f"Error interno del servidor: {e}")
    finally:
        if conn:
            cursor.close()
            conn.close()

# Ruta de prueba
@router.get("/")
async def read_root():
    return {"message": "Bienvenido a Agrosmi"}