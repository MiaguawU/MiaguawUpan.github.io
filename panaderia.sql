create database Panaderia;
use Panaderia;

create table Categoria (
	id_categoria int auto_increment primary key,
    categoria varchar(100)
);


create table Categoria_Producto (
	id_categoria int,
    id_producto int,
    primary key(id_categoria, id_producto),
    foreign key (id_categoria) references Categoria(id_categoria),
    foreign key (id_producto) references Producto(id_producto)
);

create table Producto(
	id_producto int auto_increment primary key,
    nombre_producto varchar(50),
    precio double,
    descripcion varchar(250),
    piezas int,
    id_temporada int,
    foreign key (id_temporada) references Temporada(id_temporada)
);

create table Temporada(
	id_temporada int auto_increment primary key,
    temporada varchar(100),
    fecha_inicio timestamp,
    fecha_termino timestamp
);

insert into Temporada(temporada, fecha_inicio, fecha_termino) values
('Dia de muertos','2024-11-1','2024-11-10');