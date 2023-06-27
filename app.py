# Import the dependencies.

import datetime as dt
from flask import Flask, jsonify, render_template
import psycopg2 
from dotenv import load_dotenv
import os

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
    

    return render_template("index.html")


@app.route("/api/fremont_year")
def freemont_year():
    query = '''Select date_part('year', date) as year, SUM(east_west_sum_fremont), SUM(east_bike_fremont), SUM (west_bike_fremont)
    from fremont
    group by year'''
    cursor.execute(query)

    first = cursor.fetchall()
    
    bikes_list = []
    for date, total, east, west in first:
        dict_bikes = {}
        dict_bikes['year'] = date
        dict_bikes['total'] = total
        dict_bikes['east'] = east
        dict_bikes['west'] = west
        bikes_list.append(dict_bikes)

    return jsonify(bikes_list)


@app.route("/api/broadway_year")
def broadway_year():
    query = '''Select date_part('year', date) as year, SUM(north_south_sum_broadway), SUM(north_bike_broadway), SUM(south_bike_broadway)
    from broadway
    group by year'''
    cursor.execute(query)

    first = cursor.fetchall()

    bikes_list = []
    for date, total, north_bike, south_bike in first:
        dict_bikes = {}
        dict_bikes['year'] = date
        dict_bikes['total'] = total
        dict_bikes['north_bike'] = north_bike
        dict_bikes['south_bike'] = south_bike
        bikes_list.append(dict_bikes)

    return jsonify(bikes_list)

@app.route("/api/burkegilman_year")
def burke_gilman_year():
    query = '''Select date_part('year', date) as year, SUM(total_ped_and_bike), SUM(pedestrian_south), SUM(pedestrian_north), SUM(bike_north), SUM(bike_south)
    from burke_gilman
    group by year'''
    cursor.execute(query)

    first = cursor.fetchall()

    bikes_ped_list = []
    for date, total_ped_and_bike, pedestrian_south, pedestrian_north,bike_north, bike_south in first:
        dict_bikes = {}
        dict_bikes['year'] = date
        dict_bikes['total_ped_and_bike'] = total_ped_and_bike
        dict_bikes['pedestrian_south'] = pedestrian_south
        dict_bikes['pedestrian_north'] = pedestrian_north
        dict_bikes['bike_north'] = bike_north
        dict_bikes['bike_south'] = bike_south
        bikes_ped_list.append(dict_bikes)

    return jsonify(bikes_ped_list)

if __name__ == '__main__':
    app.run(debug=True)