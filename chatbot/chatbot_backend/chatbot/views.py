from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from google.cloud import dialogflow_v2
from google.oauth2 import service_account
import os
import json
import logging
import traceback
from pathlib import Path

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Dialogflow configuration
PROJECT_ID = "responsive-amp-459308-u0"  # Replace with your Dialogflow project ID
LANGUAGE_CODE = "en-US"

# Initialize Dialogflow client
credentials = service_account.Credentials.from_service_account_file(
    'C:/Users/sanje/Downloads/responsive-amp-459308-u0-8a4f7de131b4.json'  # Updated to match actual filename
)
session_client = dialogflow_v2.SessionsClient(credentials=credentials)

class ChatbotView(APIView):
    def post(self, request):
        try:
            user_message = request.data.get('message', '')
            logger.debug(f"Received message: {user_message}")

            if not user_message:
                return Response(
                    {"error": "No message provided"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            try:
                # Create a session
                session = session_client.session_path(PROJECT_ID, "unique-session-id")
                
                # Create the text input
                text_input = dialogflow_v2.TextInput(
                    text=user_message,
                    language_code=LANGUAGE_CODE
                )
                
                # Create the query input
                query_input = dialogflow_v2.QueryInput(text=text_input)
                
                # Get response from Dialogflow
                response = session_client.detect_intent(
                    request={
                        "session": session,
                        "query_input": query_input
                    }
                )
                
                bot_reply = response.query_result.fulfillment_text
                logger.debug(f"Bot reply: {bot_reply}")
                
                return Response({"reply": bot_reply}, status=status.HTTP_200_OK)
                
            except Exception as e:
                logger.error(f"Dialogflow API error: {str(e)}")
                return Response(
                    {"error": f"Dialogflow API error: {str(e)}"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR
                )
            
        except Exception as e:
            logger.error(f"Unexpected error in ChatbotView: {str(e)}")
            logger.error(f"Traceback: {traceback.format_exc()}")
            return Response(
                {"error": f"An unexpected error occurred: {str(e)}"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

def home(request):
    return render(request, 'chatbot/home.html')

