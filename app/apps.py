from django.apps import AppConfig

from mq.consumer import Consumer
from mq.webconsumer import WebConsumer


class AppConfig(AppConfig):
    name = 'app'

    def ready(self):
        import threading
        t = threading.Thread(target=self.background_process, args=(), kwargs={})
        t.setDaemon(True)
        t.start()
        #启动web mq 消费者
        wt = threading.Thread(target=self.background_process2, args=(), kwargs={})
        wt.setDaemon(True)
        wt.start()

    @staticmethod
    def background_process():
        Consumer().run()

    @staticmethod
    def background_process2():
        WebConsumer().run()
