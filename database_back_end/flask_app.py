from flask import Flask, jsonify
import psycopg2
import pandas as pd
import numpy as np




#################################################
# Database Setup
#################################################

conn = psycopg2.connect()

cursor=conn.cursor()
cursor.execute("SELECT * FROM bikes")
if cursor.fetchall():
    print("Connection successful")
else:
    print("Connection unsuccessful")

conn.close()

#################################################
# Flask Setup
#################################################

app = Flask(__name__)

@app.route("/")
def home():
    f"Welcome to the Seattle Bike Traffic API!<br/>"
    f"Available Routes:<br/>"


