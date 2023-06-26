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

@app.route("/api/weather_bins_data")
def alldata_weatherbins():
     # Create our session (link) from Python to the DB
    session = Session(engine)

    # Query precipitation
    results = session.query(weather_bins_data.temp_real_f, weather_bins_data.north_bike_broadway, \
                            weather_bins_data.south_bike_broadway, weather_bins_data.bike_north_burke, \
                            weather_bins_data.bike_south_burke, weather_bins_data.east_bike_fremont, \
                            weather_bins_data.west_bike_fremont
                              ).all()

    session.close()    

    weatherbin_list = []
    for temp_real_f, north_bike_broadway, south_bike_broadway, bike_north_burke, bike_south_burke, east_bike_fremont, west_bike_fremont in results:
        weatherbin_dict = {}
        weatherbin_dict['temp_real_f'] = temp_real_f
        weatherbin_dict['north_bike_broadway'] = north_bike_broadway
        weatherbin_dict['south_bike_broadway'] = south_bike_broadway
        weatherbin_dict['bike_north_burke'] = bike_north_burke
        weatherbin_dict['bike_south_burke'] = bike_south_burke
        weatherbin_dict['east_bike_fremont'] = east_bike_fremont
        weatherbin_dict['west_bike_fremont'] = west_bike_fremont
        weatherbin_list.append(weatherbin_dict)


    return jsonify(weatherbin_list)



if __name__ == '__main__':
    app.run(debug=True)