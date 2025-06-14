from langchain_google_genai import ChatGoogleGenerativeAI
from .config import Settings

Settings.GOOGLE_API_KEY

llm = ChatGoogleGenerativeAI(model="gemini-2.0-flash-exp", temperature=0)