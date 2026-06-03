from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "mysql+mysqlconnector://mentor:mentor123@localhost:3306/MentorGraducao"
    secret_key: str = "change-me-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24h

    class Config:
        env_file = ".env"


settings = Settings()
