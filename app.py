# Import the dependencies.

import datetime as dt
from flask import Flask, jsonify, render_template
import psycopg2 
from dotenv import load_dotenv
import os
import json
import pandas as pd
import numpy as np

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
    cursor.execute("Select * from fremont")
    result=pd.DataFrame(cursor.fetchall())

    #Query 2
    cursor.execute("Select * from burke_gilman")
    result2=pd.DataFrame(cursor.fetchall())

    #Query 3
    cursor.execute("SELECT * FROM broadway")
    result3=pd.DataFrame(cursor.fetchall())

    concatenated = pd.concat([result, result2, result3], axis=1)

    concatenated.columns = ['id1', 'date1', 'Fremont', 'north_bike', 'south_bike', 'location_name', 'id2', 'date2', 'Burke_Gilman', 'pedestrian_south', 'pedestrian_north', 'bike_north', 'bike_south', 'location_name','id3', 'date3', 'Broadway', 'north_bike2', 'south_bike2', 'location_name' ]
    # concatenated = concatenated.fillna(0)
    concatenated=concatenated.drop(['id1', 'id2', 'id3'], axis=1)
    # format the date columns to be YYYY-MM-DD

    concatenated['date1'] = concatenated['date1'].replace(0, np.nan)
    concatenated['date2'] = concatenated['date2'].replace(0, np.nan)
    concatenated['date3'] = concatenated['date3'].replace(0, np.nan)

    df_fremont = concatenated[['date1', 'Fremont']].rename(columns={'date1': 'date', 'Fremont': 'count'})
    df_fremont['location'] = 'Fremont'

    df_burke_gilman = concatenated[['date2', 'Burke_Gilman']].rename(columns={'date2': 'date', 'Burke_Gilman': 'count'})
    df_burke_gilman['location'] = 'Burke_Gilman'

    df_broadway = concatenated[['date3', 'Broadway']].rename(columns={'date3': 'date', 'Broadway': 'count'})
    df_broadway['location'] = 'Broadway'

    df_combined = pd.concat([df_fremont, df_burke_gilman, df_broadway])
    df_combined = df_combined.dropna(subset=['date'])

    # Create the 'month' column and aggregate counts by month and location
    df_combined['month'] = df_combined['date'].dt.to_period('M')
    df_final = df_combined.groupby(['month', 'location']).sum().reset_index()


    #Splitting daytime and nightitme
    df_combined['date'] = pd.to_datetime(df_combined['date'])
    df_combined['date_date'] = df_combined['date'].dt.date
    df_combined['date_time'] = df_combined['date'].dt.time

    df_combined['daytime'] = df_combined['date_time'].apply(lambda x: 6 <= x.hour <= 18)
    df_combined['nighttime'] = ~df_combined['daytime']

    df_combined=df_combined.drop(columns=['date_time', 'date_date'])
    df_combined['daytime'] = df_combined['daytime'] * df_combined['count']
    df_combined['nighttime'] = df_combined['nighttime'] * df_combined['count']

    # Create the 'month' column and aggregate counts by month and location
    df_combined['month'] = df_combined['date'].dt.to_period('M')
    df_final = df_combined.groupby(['month', 'location']).sum().reset_index()


    #Convert month to string because of extra metadata
    df_final['month']=df_final['month'].astype(str)

    data_dict = df_final.to_dict('records')

    return jsonify(data_dict)


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

@app.route("/api/broadway_month")
def broadway_month():
    query = '''Select date_part('month', date) as month, SUM(north_south_sum_broadway), SUM(north_bike_broadway), SUM(south_bike_broadway)
    from broadway
    group by month'''
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
    query = '''Select date_part('year', date) as year, SUM(total_ped_and_bike_burke), SUM(pedestrian_south_burke), SUM(pedestrian_north_burke), SUM(bike_north_burke), SUM(bike_south_burke)
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

@app.route("/api/burkegilman_month")
def burkegilman_month():
    query = '''Select date_part('month', date) as month, SUM(total_ped_and_bike_burke), SUM(pedestrian_south_burke), SUM(pedestrian_north_burke), SUM(bike_north_burke), SUM(bike_south_burke)
    from burke_gilman
    group by month'''
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

@app.route("/api/fremont_year")
def freemont_year():
    query = """Select date_part('year', date) as year, SUM(east_west_sum_fremont), SUM(east_bike_fremont), SUM(west_bike_fremont)
    from fremont
    group by year"""
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

@app.route("/api/fremont_month")
def fremont_month():
    query = """Select date_part('month', date) as month, SUM(east_west_sum_fremont), SUM(east_bike_fremont), SUM(west_bike_fremont)
    from fremont
    group by month"""
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

@app.route("/api/totals")
def totals():
    query = """Select date_part('year',b.date) as year, sum(b.north_south_sum_broadway), sum(bg.total_ped_and_bike_burke), sum(f.east_west_sum_fremont)
                from broadway as b
                inner join burke_gilman as bg ON 
                b.date = bg.date
                inner join fremont as f ON
                b.date = f.date
                group by year;"""
    cursor.execute(query)
    first = cursor.fetchall()
    bikes_list = []
    for date, total_b, total_bg, total_f in first:
        dict_bikes = {}
        dict_bikes['date'] = date
        dict_bikes['total_b'] = total_b
        dict_bikes['total_bg'] = total_bg
        dict_bikes['total_f'] = total_f
        bikes_list.append(dict_bikes)
    return jsonify(bikes_list)

if __name__ == '__main__':
    app.run(port=8000, debug=True)