from flask import Flask, redirect, url_for, request, jsonify
from seeds.index import Budget, Expense
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, text
from flask_cors import CORS
from dotenv import load_dotenv
import os
# Connect to database
load_dotenv()
try:
    engine = create_engine(
        os.getenv("postgres_uri"), echo=True)
    Session = sessionmaker(bind=engine)
    session = Session()
except Exception as e:
    print(e)

app = Flask(__name__)
CORS(app)


@app.route('/show_budgets')
def show_budgets():
    sqlStatement = text(
        "SELECT *, SUM(e.amount) FROM Expense e JOIN Budget b ON e.budget_id=b.id GROUP BY b.id, b.name, e.budget_id, e.id")
    result = session.execute(
        sqlStatement)
    return jsonify({"data": [{'budget_id': row.budget_id, 'name': row.name, "maxSpending": row.maxSpending, "totalExpense": row.sum} for row in result], "status": "success"})


@app.route('/show_expenses/<int:budgetID>')
def show_expenses(budgetID):
    try:
        result = session.query(Expense).filter(
            Expense.budget_id == budgetID).all()
        for row in result:
            print(f'{row.id} {row.name} {row.amount}')
        return jsonify({"data": [{'id': row.id, 'name': row.name, 'amount': row.amount, 'budget_id': row.budget_id} for row in result], "status": "success"})
    except Exception as e:
        return jsonify({"data": [], "status": "error", "message": e})


@app.route('/addBudget', methods=['POST'])
def add_budget():
    name = request.form['name']
    maxSpending = request.form['maxSpending']
    budget = Budget(name=name, maxSpending=maxSpending)
    session.add(budget)
    session.commit()
    return jsonify({"data": {'id': budget.id, 'name': budget.name, 'maxSpending': budget.maxSpending}, "status": "success"})


@app.route('/addExpense/<int:budgetID>', methods=['POST'])
def add_expense(budgetID):
    name = request.form['name']
    amount = request.form['amount']
    try:
        expense = Expense(name=name, amount=amount, budget_id=budgetID)
        session.add(expense)
        session.commit()
        return jsonify({"data": {"id": expense.id, 'name': expense.name, 'amount': expense.amount, 'budget_id': expense.budget_id}, "status": "success"})
    except:
        return jsonify({"data": [], "status": "fail"})


@app.route('/deleteBudget/<int:budgetID>', methods=['DELETE'])
def delete_budget(budgetID):
    try:
        expenses = session.query(Expense).filter(
            Expense.budget_id == budgetID).all()
        for expense in expenses:
            expense.budget_id = 1
            session.add(expense)
            session.commit()
        budget = session.query(Budget).filter(Budget.id == budgetID).first()
        session.delete(budget)
        session.commit()
        return jsonify({"data": {"id": budget.id, 'name': budget.name, 'maxSpending': budget.maxSpending}, "status": "success"})
    except:
        return jsonify({"data": [], "status": "fail"})


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
