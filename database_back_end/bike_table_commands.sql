CREATE TABLE Fremont (id serial primary key,
Date timestamp,
total int,
east int,
west int);

CREATE TABLE Burke_Gilman (id serial primary key,
Date timestamp,
total_ped_and_bike int,
pedestrian_south int,
pedestrian_north int,
bike_north int,
bike_south int);

CREATE TABLE Broadway (id serial primary key,
Date timestamp,
total int,
east int,
west int);


\copy data_csv (columns) from 'Path/to/file' WITH (format csv, HEADER true);

\copy weather_seattle (time_, temp_real_F, temp_feel_F, precipitation_inch, weathercode, wind_speed) from '/Users/jaredperez/Documents/UCB-VIRT-DATA-PT-02-2023-U-LOLC/UCB-Bootcamp-project03-group10/database_back_end/weather_data.csv' WITH (format csv, HEADER true);