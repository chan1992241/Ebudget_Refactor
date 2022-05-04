from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String, ForeignKey, create_engine
from sqlalchemy.ext.declarative import declarative_base
from dataclasses import dataclass
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
    maxSpending = Column(Integer, default=0)


@dataclass
class Expense(Base):
    __tablename__ = 'expense'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    amount = Column(Integer)
    budget_id = Column(Integer, ForeignKey('budget.id'))


Base.metadata.create_all(engine)


###############################################################################
Session = sessionmaker(bind=engine)
session = Session()

result = session.query(Budget).all()

for row in result:
    print(f'{row.id} {row.name} {row.maxSpending}')

# uncategorized = Budget(name='Uncategorized', maxSpending=0)
# session.add(uncategorized)
# session.commit()
