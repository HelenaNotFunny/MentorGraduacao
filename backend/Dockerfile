FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

# CMD sh -c "cp -n .env.example .env && sed -i 's/@localhost/@mysql/g' .env && sleep 10 && \
#     if [ ! -f /app/data/seed_pronto ]; then \
#         (alembic upgrade head || (alembic stamp head && alembic upgrade head)) && python seeds/seed.py && mkdir -p /app/data && touch /app/data/seed_pronto; \
#     else \
#         echo 'Banco já populado, pulando seeds.'; \
#     fi && \
#     uvicorn app.main:app --host 0.0.0.0 --port 8000"

CMD sh -c "cp -n .env.example .env && sed -i 's/@localhost/@mysql/g' .env && sleep 10 && \uvicorn app.main:app --host 0.0.0.0 --port 8000"