drop database if exists bamazonDB;

create database bamazonDB;

use bamazonDB;

create table products (
    id int not null auto_increment,
    productName varchar(100) not null,
    department varchar(50) not null,
    price dec(10, 2) not null,
    stock int, 
    primary key (id)
);

insert into products(productName, department, price, stock)
values ("Playstation 4", "Electronics", 299.99, 10), ("X-BOX", "Electronics", 299.99, 10), ("Coke-A-Cola", "Food", 5.99, 100),
("Kitty Litter", "Pet Needs", 10.99, 25), ("Cat Food", "Pet Needs", 12.99, 60),
("Apple Juice", "Food", 2.99, 15), ("Fried Chicken", "Food", 8.99, 12),
("T-Shirt", "Clothing", 10.99, 30), ("Hoodie", "Clothing", 12.99, 25);

select * from products;