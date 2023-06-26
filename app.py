# Import the dependencies.

import datetime as dt
from flask import Flask, jsonify, render_template
import psycopg2 
from dotenv import load_dotenv
import os
import json
import pandas as pd

app = Flask(__name__)

load_dotenv()

#####psycopg2 
# Connection details
host = os.getenv("HOST")     
database = os.getenv("database")
user = os.getenv("username")
password = os.getenv("password")
port=5432      

# Establish connection
connection = psycopg2.connect(
    host=host,
    database=database,
    user=user,
    password=password,
    port = port
)

# Create a cursor object to interact with the database
cursor = connection.cursor()


@app.route("/")
def welcome():
    

    #data_list = json.load(open('data.json'))
    #data_json = json.dumps(data_list)
    #return render_template("index.html", data_json=data_json)
    return render_template("index.html")


#@app.route("/api/alldata")
#def alldata():
    query = '''Select date_part('year', date) as year, SUM(total), SUM(east), SUM (west)
    from fremont
    group by year'''
    cursor.execute(query)

    first = cursor.fetchall()
    print(first)

    bikes_list = []
    for date, all, east, west in first:
        dict_bikes = {}
        dict_bikes['year'] = date
        dict_bikes['all'] = all
        dict_bikes['east'] = east
        dict_bikes['west'] = west
        bikes_list.append(dict_bikes)


    return jsonify(bikes_list)


#@app.route("/api/broadway")
#def alldata_broadway():
    query = '''Select date_part('year', date) as year, SUM(total), SUM(north_bike), SUM (south_bike)
    from broadway
    group by year'''
    cursor.execute(query)

    first = cursor.fetchall()
    print(first)

    bikes_list = []
    for date, total, north_bike, south_bike in first:
        dict_bikes = {}
        dict_bikes['year'] = date
        dict_bikes['total'] = total
        dict_bikes['north_bike'] = north_bike
        dict_bikes['south_bike'] = south_bike
        bikes_list.append(dict_bikes)


    return jsonify(bikes_list)

@app.route("/api/burkegilman")
def burke_gilman():
    query = '''Select date_part('year', date) as year, SUM(total_ped_and_bike_burke), SUM(pedestrian_south_burke), SUM(pedestrian_north_burke), SUM (bike_north_burke), SUM(bike_south_burke)
    from burke_gilman
    group by year'''
    cursor.execute(query)

    first = cursor.fetchall()
    print(first)

    bikes_ped_list = []
    for date, total_ped_and_bike_burke, pedestrian_south_burke, pedestrian_north_burke,bike_north_burke, bike_south_burke in first:
        dict_bikes = {}
        dict_bikes['year'] = date
        dict_bikes['total_ped_and_bike_burke'] = total_ped_and_bike_burke
        dict_bikes['pedestrian_south_burke'] = pedestrian_south_burke
        dict_bikes['pedestrian_north_burke'] = pedestrian_north_burke
        dict_bikes['bike_north_burke'] = bike_north_burke
        dict_bikes['bike_south_burke'] = bike_south_burke
        bikes_ped_list.append(dict_bikes)




    return jsonify(bikes_ped_list)

@app.route("/api/heatmap_data")
def heatmap_data():

    #Query 1
    cursor.execute("Select * from fremont_")
    result=pd.DataFrame(cursor.fetchall())

    #Query 2
    cursor.execute("Select * from Burke_Gilman")
    result2=pd.DataFrame(cursor.fetchall())

    #Query 3
    cursor.execute("SELECT * FROM Broadway")
    result3=pd.DataFrame(cursor.fetchall())

    concatenated = pd.concat([result, result2, result3], axis=1)
    concatenated.columns = ['id1', 'date1', 'Fremont', 'north_bike', 'south_bike', 'id2', 'date2', 'Burke_Gilman', 'pedestrian_south', 'pedestrian_north', 'bike_north', 'bike_south', 'id3', 'date3', 'Broadway', 'north_bike2', 'south_bike2' ]
    # concatenated = concatenated.fillna(0)
    concatenated=concatenated.drop(['id1', 'id2', 'id3'], axis=1)
    # format the date columns to be YYYY-MM-DD

    test=concatenated[:100]
    test['date1'] = pd.to_datetime(test['date1'])
    test['date2'] = pd.to_datetime(test['date2'])
    test['date3'] = pd.to_datetime(test['date3'])
    test['date1'] = test['date1'].dt.strftime('%Y-%m-%d')
    test['date2'] = test['date2'].dt.strftime('%Y-%m-%d')
    test['date3'] = test['date3'].dt.strftime('%Y-%m-%d')

    test=test.drop(columns=['north_bike', 'south_bike', 'pedestrian_south', 'pedestrian_north', 'bike_north', 'bike_south', 'north_bike2', 'south_bike2'])



    return jsonify(test.to_dict(orient="records"))



if __name__ == '__main__':
    app.run(port=8000, debug=True)