import json
import os
#import argparse

import flask
#from waitress

import pandas as pd
import mysql.connector

from dotenv import load_dotenv
load_dotenv()

DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASS")
DB_BASE = os.getenv("DB_BASE")

mydb = mysql.connector.connect(host=DB_HOST,
                               user=DB_USER,
                               password=DB_PASS,
                               database=DB_BASE,
                               allow_local_infile=True)

cur = mydb.cursor()

app = flask.Flask(__name__)

#@app.errorhandler(404)
#def page_not_found(error):
#   return 404


@app.route("/check", methods=["GET"])
def check():
    if mydb.is_connected():
        return "ALL IS WELL"
    else:
        return "DB DOWN"


@app.route("/query", methods=["POST"])
def query():

    if not flask.request.data:
        abort(404, 'Req Problem')

    req_dict = json.loads(flask.request.data.decode('utf-8'))
    gender = {"Male": "=2", "Female": "=1", "All": "<>-1"}
    req_gender = req_dict.get('gender')
    req_gender = gender.get(req_gender)
    req_known = req_dict.get('known')
    if req_known != 'All':
    	req_known = "='"+req_known+"'"
    else:
    	req_known = "<>'"+req_known+"'"

    rows = []
    columns = ["name", "gender", "known_for_department", "popularity"]

    sql = """
            select name, 
                   case when gender = 1 then 'Female' 
                        when gender = 2 then 'Male'
                        else 'Unknown' end as gender, 
                   known_for_department, 
                   cast(popularity as float) 
                   
                   from people

                   where 1=1
                   and gender {0} 
                   and known_for_department {1}

                   order by popularity desc

                   limit 100;
    """.format(req_gender, req_known)
    print(sql)

    cur.execute(sql)

    for row in cur.fetchall():
        rows.append(dict(zip(columns, row)))

    column_headers = [{
        "title": "Name",
        "dataIndex": "name",
        "key": "name",
        "width": 150
    }, {
        "title": "Gender",
        "dataIndex": "gender",
        "key": "gender",
        "width": 150
    }, {
        "title": "Known For",
        "dataIndex": "known_for_department",
        "key": "known_for_department",
        "width": 150
    }, {
        "title": "Popularity",
        "dataIndex": "popularity",
        "key": "popularity",
        "width": 150
    }]

    result = {"columns": column_headers, "rows": rows}

    return flask.jsonify(result)


#if __name__ == "__main__":
#
#    waitress.serve(app)