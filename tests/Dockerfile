FROM python:3.12.12-slim
WORKDIR /tests
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1
COPY . .
USER 65532:65532
CMD ["python", "-m", "unittest", "-v", "test_api"]
