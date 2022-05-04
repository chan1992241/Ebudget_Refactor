from flask import Flask, redirect, url_for, request, jsonify
from seeds.index import Budget, Expense
from sqlalchemy.orm import sessionmaker
from sqlalchemy import create_engine
# Connect to database
try:
    engine = create_engine(
        'postgresql+psycopg2://postgres:jinyeeU@localhost/ebudget', echo=True)
    Session = sessionmaker(bind=engine)
    session = Session()
except Exception as e:
    print(e)

app = Flask(__name__)


@app.route('/')
def hello_world():
    result = session.query(Budget).all()
    return jsonify({"data": [{'id': row.id, 'name': row.name, 'maxSpending': row.maxSpending} for row in result], "status": "success"})


@app.route('/addBudget', methods=['POST'])
def add_budget():
    name = request.form['name']
    maxSpending = request.form['maxSpending']
    budget = Budget(name=name, maxSpending=maxSpending)
    session.add(budget)
    session.commit()
    return jsonify({"data": {'id': budget.id, 'name': budget.name, 'maxSpending': budget.maxSpending}, "status": "success"})


@app.route('/guest/<guest>')
def hello_guest(guest):
    return 'Hello %s as Guest' % guest


@app.route('/user/<name>')
def hello_user(name):
    if name == 'admin':
        return redirect(url_for('hello_admin'))
    else:
        return redirect(url_for('hello_guest', guest=name))


@app.route('/login', methods=['POST', 'GET'])
def login():
    if request.method == 'POST':
        user = request.form['nm']  # get from html form name="nm"
        return redirect(url_for('success', name=user))
    else:
        user = request.args.get('nm')
        return redirect(url_for('success', name=user))


if __name__ == '__main__':
    app.run(debug=True)
