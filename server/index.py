from flask import Flask, redirect, url_for, request, jsonify
from seeds.index import Budget, Expense
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, text
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
import os
# Connect to database
load_dotenv()
try:
    # engine = create_engine(
    #     os.getenv("postgres_uri"), echo=True)
    engine = create_engine(
        "postgresql+psycopg2://" + os.getenv("POSTGRES_USER") + ":" + os.getenv("POSTGRES_PASSWORD") + "@" + os.getenv("POSTGRES_HOST") + "/" + os.getenv("POSTGRES_DB"), echo=True)
    Session = sessionmaker(bind=engine)
    session = Session()
except Exception as e:
    print(e)

app = Flask(__name__)
CORS(app)


@app.route("/")
def index():
    return "Hello World!"


@app.route('/show_budgets')
def show_budgets():
    sqlStatement = text(
        """
        SELECT b.name, b.max_spending, b.id, SUM(e.amount) 
        FROM Expense e 
        RIGHT JOIN Budget b ON e.budget_id=b.id 
        GROUP BY b.id;
        """)
    result = session.execute(
        sqlStatement)
    return jsonify({"data": [{'budget_id': row.id, 'name': row.name, "max_spending": row.max_spending, "total_expense": row.sum} for row in result], "status": "success"})


@app.route('/show_expenses/<int:budgetID>')
def show_expenses(budgetID):
    try:
        result = session.query(Expense).filter(
            Expense.budget_id == budgetID).all()
        return jsonify({"data": [{'id': row.id, 'name': row.name, 'amount': row.amount, 'budget_id': row.budget_id} for row in result], "status": "success"})
    except Exception as e:
        return jsonify({"data": [], "status": "error", "message": e})


@app.route('/addBudget/', methods=['POST'])
@cross_origin()
def add_budget():
    name = request.form['name']
    max_spending = request.form['max_spending']
    try:
        budget = Budget(name=name, max_spending=max_spending)
        session.add(budget)
        session.commit()
        return jsonify({"data": {'id': budget.id, 'name': budget.name, 'max_spending': budget.max_spending}, "status": "success"}), 200
    except:
        return jsonify({"data": {}, "status": "error"}), 400


@app.route('/addExpense/<int:budgetID>', methods=['POST'])
def add_expense(budgetID):
    name = request.form['name']
    amount = request.form['amount']
    budget = session.query(Budget).filter(Budget.id == budgetID)
    if (budget.count() != 0):
        try:
            expense = Expense(name=name, amount=amount, budget_id=budgetID)
            session.add(expense)
            session.commit()
            return jsonify({"data": {"id": expense.id, 'name': expense.name, 'amount': expense.amount, 'budget_id': expense.budget_id}, "status": "success"})
        except:
            return jsonify({"data": [], "status": "fail"})
    return jsonify({"data": [], "status": "Budget Not Found"})


@app.route('/deleteBudget/<int:budgetID>', methods=['DELETE'])
def delete_budget(budgetID):
    try:
        expenses = session.query(Expense).filter(
            Expense.budget_id == budgetID).all()
        for expense in expenses:
            # Change expense budget category to uncategorized
            expense.budget_id = 1
            session.add(expense)
            session.commit()
        budget = session.query(Budget).filter(Budget.id == budgetID).first()
        session.delete(budget)
        session.commit()
        return jsonify({"data": {"id": budget.id, 'name': budget.name, 'max_spending': budget.max_spending}, "status": "success"}), 200
    except:
        return jsonify({"data": [], "status": "fail"}), 400


@app.route('/deleteExpense/<int:expenseID>', methods=['DELETE'])
def delete_expense(expenseID):
    try:
        expense = session.query(Expense).filter(
            Expense.id == expenseID).first()
        session.delete(expense)
        session.commit()
        return jsonify({"data": {"id": expense.id, 'name': expense.name, 'amount': expense.amount, 'budget_id': expense.budget_id}, "status": "success"})
    except:
        return jsonify({"data": [], "status": "fail"})


if __name__ == '__main__':
    app.run(debug=True)
