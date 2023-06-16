CREATE TABLE bikes (id serial primary key,
Date date,
total int,
east int,
west int);

\copy bikes (Date, total, east, west) from 
'/Users/jaredperez/Documents/UCB-VIRT-DATA-PT-02-2023-U-LOLC/UCB-Bootcamp-project03-group10/database_back_end/Fremont_Bike.csv' WITH (format csv, 
HEADER true);