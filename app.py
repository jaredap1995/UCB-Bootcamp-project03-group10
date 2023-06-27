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

    print(concatenated.columns)

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


if __name__ == '__main__':
    app.run(port=8000, debug=True)