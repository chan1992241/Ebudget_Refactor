from ast import Str
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String, ForeignKey, create_engine, BigInteger
from sqlalchemy.ext.declarative import declarative_base
from dataclasses import dataclass
from sqlalchemy.dialects.postgresql import FLOAT
import os
from dotenv import load_dotenv
load_dotenv()

# meta = MetaData()
engine = create_engine(
    "postgresql+psycopg2://" + os.getenv("POSTGRES_USER") + ":" + os.getenv(
        "POSTGRES_PASSWORD") + "@" + os.getenv("POSTGRES_HOST") + "/" + os.getenv("POSTGRES_DB"), echo=True)

conn = engine.connect()

Base = declarative_base()


class User(Base):
    __tablename__ = 'users'
    id = Column(String, primary_key=True)
    name = Column(String)
    email = Column(String)


@dataclass
class Budget(Base):
    __tablename__ = 'budget'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    max_spending = Column(FLOAT, default=0)
    user_id = Column(String, ForeignKey('users.id'))


@dataclass
class Expense(Base):
    __tablename__ = 'expense'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    amount = Column(FLOAT)
    budget_id = Column(Integer, ForeignKey('budget.id'))


Base.metadata.create_all(engine)
