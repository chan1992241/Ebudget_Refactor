# Ebudget
Before dive into detail of this project, motivation to build this  project to **practice** my tech stack and help to **track and record my personal expenses**.
## Project Description
Ebudget is an personal finance application that allow users to plan on their daily expenses. User can create their budget on certain category of expense, and each time user make expense on that category, user can record the expense detail under that particular category. For example, user can create budget category "food", each time user spend on food, user can add record under category "food". Expense record my include price and name of the expense. The system will automatically count total expenses made and is the expense exceed budget. If exceed budget, the application will visually alert user. 
## Technology involved
This project use **react typescript** as client which will communicate with backend developed using **python flask**. React frontend UI library has large ecosystem which allow to further build this application like using react native in build mobile version or tauri in desktop version. While the reason to choose flask as backend is because of its lightweight compare to django, ruby on rail, etc. Besides, **NGINX** will handle request and route the request to **uwsgi** that serve flask application. [React ↔ Nginx ↔ uWSGI ↔ Flask]. Lastly, I used docker to dockerize all these appliaction (react, uwsgi that serve flask, nginx) together and make interaction with each other.
## How to install this application
```
git clone https://github.com/chan1992241/ebudget.git
docker-compose up --build
```
