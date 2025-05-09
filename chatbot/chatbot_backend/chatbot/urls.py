from django.urls import path
from django.http import JsonResponse
from .views import ChatbotView  # Use ChatbotView instead of ChatAPIView

urlpatterns = [
    path('', lambda request: JsonResponse({'message': 'Chatbot API is working ✅'})),
    path('chat/', ChatbotView.as_view(), name='chatbot'),  # Use ChatbotView here
]
