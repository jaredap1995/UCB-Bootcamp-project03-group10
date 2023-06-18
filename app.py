# Import the dependencies.

import datetime as dt
from flask import Flask, jsonify, render_template
import psycopg2 

app = Flask(__name__)


#####psycopg2 
# Connection details
host =  "chunee.db.elephantsql.com" #"postgres://hgykzxtn:***@chunee.db.elephantsql.com/hgykzxtn"         
database = "hgykzxtn"
user = "hgykzxtn"
password = "0-A1hdKOOMmFxwFsFmO3JNByMhhRBew-"
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


@app.route("/api/alldata")
def alldata():
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


@app.route("/api/broadway")
def alldata_broadway():
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
    query = '''Select date_part('year', date) as year, SUM(total_ped_and_bike), SUM(pedestrian_south), SUM(pedestrian_north), SUM (bike_north), SUM(bike_south)
    from burke_gilman
    group by year'''
    cursor.execute(query)

    first = cursor.fetchall()
    print(first)

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