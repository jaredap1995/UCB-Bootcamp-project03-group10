CREATE TABLE bikes (id serial primary key,
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


\copy bikes (Date, total, east, west) from '/Users/jaredperez/Documents/UCB-VIRT-DATA-PT-02-2023-U-LOLC/UCB-Bootcamp-project03-group10/database_back_end/Fremont_Bike.csv' WITH (format csv, HEADER true);