# Import the dependencies.

import datetime as dt
from flask import Flask, jsonify, render_template
import psycopg2 
from dotenv import load_dotenv
import os
import json

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




@app.route("/api/weather_bins_data")
def alldata_weatherbins():

    # Query precipitation
    results = cursor.execute("select temp_real_f, north_bike_broadway, south_bike_broadway, bike_north_burke, bike_south_burke, east_bike_fremont, west_bike_fremont from weather_bins_data")    

    results=cursor.fetchall()
    results=pd.DataFrame(results)

    results.columns=['temp_real_f', 'north_bike_broadway', 'south_bike_broadway', 'bike_north_burke', 'bike_south_burke', 'east_bike_fremont', 'west_bike_fremont']

    results.index=results['temp_real_f']

    

    data_dict=results.to_dict('records')
    return jsonify(data_dict)


if __name__ == '__main__':
    app.run(debug=True)

cursor.close()  # Close the cursor
connection.close()  # Close the connection