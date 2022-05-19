from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from dataclasses import dataclass
from sqlalchemy.dialects.postgresql import FLOAT
# meta = MetaData()

engine = create_engine(
    'postgresql+psycopg2://postgres:jinyeeU@localhost/ebudget', echo=True)

conn = engine.connect()

Base = declarative_base()


@dataclass
class Budget(Base):
    __tablename__ = 'budget'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    max_spending = Column(FLOAT, default=0)


@dataclass
class Expense(Base):
    __tablename__ = 'expense'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    amount = Column(FLOAT)
    budget_id = Column(Integer, ForeignKey('budget.id'))


Base.metadata.create_all(engine)


# Insert Uncategorized Budget if not exists
Session = sessionmaker(bind=engine)
session = Session()

isUncategorizedBudget = session.query(
    Budget).filter(Budget.name == 'Uncategorized')

if (isUncategorizedBudget.count() == 0):
    budget = Budget(name='Uncategorized', max_spending=0)
    session.add(budget)
    session.commit()

result = session.query(Budget).all()

for row in result:
    print(f'{row.id} {row.name} {row.max_spending}')
