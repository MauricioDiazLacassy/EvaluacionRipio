from django.urls import path
from .views import transaction_api_view, \
    history_transactions_api_view, blockchain_api_view, \
    balance_wallet_api_view, RegisterAPI, LoginAPI, coin_api_view, \
    super_user_check_view, wallet_api_view, logout_api_view,\
    unauthorized_transactions_api_view, user_detail_view, create_amount_admin_view
from knox import views as knox_views

urlpatterns = [
    path('transacciones/', transaction_api_view, name='transaction_list'),
    path('minar-blockchain/', blockchain_api_view, name='blockchain_mine'),
    path('monedas/', coin_api_view, name='coins_list'),
    path('obtener-wallet/', wallet_api_view, name='wallet_id'),
    path('obtener-balance/', balance_wallet_api_view, name='balance_wallet'),
    path('obtener-user/', user_detail_view, name='obtain_user'),
    path('check-superuser/', super_user_check_view, name='is_superuser'),
    path('create-amount-admin/', create_amount_admin_view, name='create_amount_admin'),
    path('history-transactions/', history_transactions_api_view, name='transactions_history_wallet'),
    path('unauthorized-transactions/', unauthorized_transactions_api_view, name='unauthorized_transactions'),
    path('register/', RegisterAPI.as_view(), name='register'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('logout/', logout_api_view, name='logout'),
    path('logoutall/', knox_views.LogoutAllView.as_view(), name='logoutall'),
]