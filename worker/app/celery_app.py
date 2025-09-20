import os
from celery import Celery

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "sih_health_bot",
    broker=REDIS_URL,
    backend=REDIS_URL,
)

celery_app.conf.task_routes = {
    "tasks.send_reminder": {"queue": "reminders"},
    "tasks.send_outbreak_alert": {"queue": "alerts"},
    "tasks.credit_reward": {"queue": "rewards"},
}

"""
Autodiscover Celery tasks from project packages.

We explicitly list top-level packages that contain tasks modules. Celery will
look for a `tasks.py` file (or a `tasks` package) within these packages and
their subpackages. This allows deeper paths like `services/health/tasks.py` to
be discovered as long as `services` is a Python package.
"""
celery_app.autodiscover_tasks(["app", "services", "actions"])




