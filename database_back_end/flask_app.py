from flask import Flask, jsonify
import psycopg2
import pandas as pd
import numpy as np




#################################################
# Database Setup
#################################################

conn = psycopg2.connect(host="chunee.db.elephantsql.com", 
                        port = 5432, 
                        database="hgykzxtn", 
                        user="hgykzxtn", 
                        password="0-A1hdKOOMmFxwFsFmO3JNByMhhRBew-")

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


