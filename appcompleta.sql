CREATE database empresautn;

use empresautn;

create table productos(
idProducto int unsigned not null auto_increment,
nombre varchar(150) not null,
precio int not null,
descripcion varchar(200) not null,
primary key (idProducto)
);

create table contacto(
idContacto int unsigned not null auto_increment,
nombre varchar(150) not null,
email varchar(150) not null,
primary key (idContacto)
)