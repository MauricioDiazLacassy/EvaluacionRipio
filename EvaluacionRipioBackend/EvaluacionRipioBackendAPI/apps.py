from django.apps import AppConfig


class EvaluacionripiobackendapiConfig(AppConfig):
    name = 'EvaluacionRipioBackendAPI'

    def ready(self):
        import EvaluacionRipioBackendAPI.signals
