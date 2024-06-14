create table users
(
    id         int auto_increment
        primary key,
    first_name varchar(50)                         not null,
    last_name  varchar(50)                         not null,
    birthdate  date                                not null,
    email      varchar(100)                        not null,
    phone      varchar(20)                         null,
    password   varchar(255)                        not null,
    created_at timestamp default CURRENT_TIMESTAMP null,
    constraint email
        unique (email)
);

create table pages
(
    id         int auto_increment
        primary key,
    title      varchar(255)                        not null,
    url        varchar(255)                        not null,
    user_id    int                                 null,
    created_at timestamp default CURRENT_TIMESTAMP null,
    constraint url
        unique (url),
    constraint pages_ibfk_1
        foreign key (user_id) references users (id)
            on delete cascade
);

create table about_sections
(
    id        int auto_increment
        primary key,
    page_id   int          null,
    title     varchar(255) not null,
    content   text         not null,
    image_url varchar(255) null,
    user_id   int          null,
    constraint about_sections_ibfk_1
        foreign key (page_id) references pages (id)
            on delete cascade
);

create index page_id
    on about_sections (page_id);

create table feedbacks
(
    id      int auto_increment
        primary key,
    page_id int          null,
    content text         not null,
    name    varchar(255) not null,
    role    varchar(255) null,
    img_url varchar(255) null,
    user_id int          null,
    constraint feedbacks_ibfk_1
        foreign key (page_id) references pages (id)
            on delete cascade
);

create index page_id
    on feedbacks (page_id);

create table footers
(
    id        int auto_increment
        primary key,
    page_id   int          null,
    content   text         not null,
    image_url varchar(255) null,
    user_id   int          null,
    constraint footers_ibfk_1
        foreign key (page_id) references pages (id)
            on delete cascade
);

create index page_id
    on footers (page_id);

create table navbars
(
    id       int auto_increment
        primary key,
    page_id  int          null,
    logo_url varchar(255) null,
    user_id  int          null,
    constraint navbars_ibfk_1
        foreign key (page_id) references pages (id)
            on delete cascade
);

create index page_id
    on navbars (page_id);

create index user_id
    on pages (user_id);

create table services
(
    id      int auto_increment
        primary key,
    page_id int          null,
    title   varchar(255) not null,
    content text         not null,
    img_url varchar(255) null,
    user_id int          null,
    constraint services_ibfk_1
        foreign key (page_id) references pages (id)
            on delete cascade
);

create index page_id
    on services (page_id);

create table team_members
(
    id      int auto_increment
        primary key,
    page_id int          null,
    name    varchar(255) not null,
    role    varchar(255) not null,
    img_url varchar(255) null,
    user_id int          null,
    constraint team_members_ibfk_1
        foreign key (page_id) references pages (id)
            on delete cascade
);

create index page_id
    on team_members (page_id);


