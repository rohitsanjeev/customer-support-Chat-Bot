from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import openai
import os
from dotenv import load_dotenv

# Load environment variables from .env file (recommended for security)
load_dotenv()

# Securely load your API key from environment variable
openai.api_key = os.getenv("OPENAI_API_KEY")

class ChatbotView(APIView):
    def post(self, request):
        user_message = request.data.get('message', '')

        if not user_message:
            return Response({"error": "No message provided"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": user_message}]
            )
            bot_reply = response['choices'][0]['message']['content']
            return Response({"reply": bot_reply}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

