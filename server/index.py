import email
from unicodedata import name
from flask import Flask, redirect, url_for, request, jsonify, session
from seeds.index import Budget, Expense, User
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine, text
from flask_cors import CORS, cross_origin
from authlib.integrations.flask_client import OAuth
from dotenv import load_dotenv
from functools import wraps

import os
# Connect to database
load_dotenv()
try:
    engine = create_engine(
        "postgresql+psycopg2://" + os.getenv("POSTGRES_USER") + ":" + os.getenv("POSTGRES_PASSWORD") + "@" + os.getenv("POSTGRES_HOST") + "/" + os.getenv("POSTGRES_DB"), echo=True)
    Session = sessionmaker(bind=engine)
    print("Successfully connected to database")
    db_session = Session()
except Exception as e:
    print(e)

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")
CORS(app)
# oauth config
oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    access_token_url='https://accounts.google.com/o/oauth2/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    client_kwargs={'scope': 'openid email profile'},
    userinfo_endpoint='https://openidconnect.googleapis.com/v1/userinfo',
    jwks_uri="https://www.googleapis.com/oauth2/v3/certs",
)


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = dict(session).get('profile', None)
        if user:
            return f(*args, **kwargs)
        return redirect('/login')
    return decorated_function


@ app.route("/")
@login_required
def index():
    email = dict(session)['profile']['email']
    return f'Hello, {email}'


@ app.route('/login')
def login():
    google = oauth.create_client('google')
    redirect_uri = url_for('authorize', _external=True)
    return google.authorize_redirect(redirect_uri)


@ app.route('/authorize')
def authorize():
    google = oauth.create_client('google')
    token = google.authorize_access_token()
    resp = google.get('userinfo')
    user_info = resp.json()
    session['profile'] = user_info
    isUser = db_session.query(User).filter(
        User.email == user_info['email'])
    # return redirect('/')
    if (isUser.count() == 0):
        user = User(name=user_info['name'], email=user_info['email'])
        db_session.add(user)
        db_session.commit()
        budget = Budget(name='Uncategorized', max_spending=0, user_id=user.id)
        db_session.add(budget)
        db_session.commit()
        return redirect(f'/show_budgets/{user.id}')
    else:
        return redirect(f'/show_budgets/{isUser[0].id}')


@app.route('/logout')
def logout():
    for key in list(session.keys()):
        session.pop(key)
    return redirect('/')


@app.route('/show_budgets/<int:userID>')
@login_required
def show_budgets(userID):
    sqlStatement = text(f"""
        SELECT b.name, b.max_spending, b.id, SUM(e.amount), b.user_id
        FROM Expense e
        RIGHT JOIN Budget b ON e.budget_id=b.id
        WHERE b.user_id={userID}
        GROUP BY b.id;
        """)
    result = db_session.execute(
        sqlStatement)
    return jsonify({"data": [{'budget_id': row.id, 'name': row.name, "max_spending": row.max_spending, "total_expense": row.sum, "user_id": row.user_id} for row in result], "status": "success"})


@ app.route('/show_expenses/<int:budgetID>')
@login_required
def show_expenses(budgetID):
    try:
        result = db_session.query(Expense).filter(
            Expense.budget_id == budgetID).all()
        return jsonify({"data": [{'id': row.id, 'name': row.name, 'amount': row.amount, 'budget_id': row.budget_id} for row in result], "status": "success"})
    except Exception as e:
        return jsonify({"data": [], "status": "error", "message": e})


@ app.route('/addBudget/<int:userID>', methods=['POST'])
@login_required
@ cross_origin()
def add_budget(userID):
    name = request.form['name']
    max_spending = request.form['max_spending']
    try:
        budget = Budget(name=name, max_spending=max_spending, user_id=userID)
        db_session.add(budget)
        db_session.commit()
        return jsonify({"data": {'id': budget.id, 'name': budget.name, 'max_spending': budget.max_spending, 'user_id': userID}, "status": "success"}), 200
    except:
        return jsonify({"data": {}, "status": "error"}), 400


@ app.route('/addExpense/<int:budgetID>', methods=['POST'])
@login_required
def add_expense(budgetID):
    name = request.form['name']
    amount = request.form['amount']
    budget = db_session.query(Budget).filter(Budget.id == budgetID)
    if (budget.count() != 0):
        try:
            expense = Expense(name=name, amount=amount, budget_id=budgetID)
            db_session.add(expense)
            db_session.commit()
            return jsonify({"data": {"id": expense.id, 'name': expense.name, 'amount': expense.amount, 'budget_id': expense.budget_id}, "status": "success"})
        except:
            return jsonify({"data": [], "status": "fail"})
    return jsonify({"data": [], "status": "Budget Not Found"})


@ app.route('/deleteBudget/<int:budgetID>', methods=['DELETE'])
@login_required
def delete_budget(budgetID):
    try:
        expenses = db_session.query(Expense).filter(
            Expense.budget_id == budgetID).all()
        for expense in expenses:
            # Change expense budget category to uncategorized
            expense.budget_id = 1
            db_session.add(expense)
            db_session.commit()
        budget = db_session.query(Budget).filter(Budget.id == budgetID).first()
        db_session.delete(budget)
        db_session.commit()
        return jsonify({"data": {"id": budget.id, 'name': budget.name, 'max_spending': budget.max_spending}, "status": "success"}), 200
    except:
        return jsonify({"data": [], "status": "fail"}), 400


@ app.route('/deleteExpense/<int:expenseID>', methods=['DELETE'])
@login_required
def delete_expense(expenseID):
    try:
        expense = db_session.query(Expense).filter(
            Expense.id == expenseID).first()
        db_session.delete(expense)
        db_session.commit()
        return jsonify({"data": {"id": expense.id, 'name': expense.name, 'amount': expense.amount, 'budget_id': expense.budget_id}, "status": "success"})
    except:
        return jsonify({"data": [], "status": "fail"})


if __name__ == '__main__':
    app.run(debug=True)
