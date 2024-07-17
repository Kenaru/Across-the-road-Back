create table if not exists users
(
    id         int auto_increment
        constraint `PRIMARY`
        primary key,
    last_name  varchar(255)                        not null,
    first_name varchar(255)                        not null,
    birthdate  date                                null,
    email      varchar(255)                        not null,
    phone      varchar(20)                         null,
    password   varchar(255)                        not null,
    created_at timestamp default CURRENT_TIMESTAMP null,
    constraint email
        unique (email)
)
    auto_increment = 3;

create table if not exists blog_posts
(
    id         int auto_increment
        constraint `PRIMARY`
        primary key,
    title      varchar(255)                        not null,
    content    text                                not null,
    user_id    int                                 not null,
    image      varchar(255)                        null,
    created_at timestamp default CURRENT_TIMESTAMP null,
    constraint blog_posts_ibfk_1
        foreign key (user_id) references users (id)
            on delete cascade
)
    auto_increment = 7;

create index user_id
    on blog_posts (user_id);

create table if not exists comments
(
    id         int auto_increment
        constraint `PRIMARY`
        primary key,
    content    text                                not null,
    user_id    int                                 not null,
    post_id    int                                 not null,
    created_at timestamp default CURRENT_TIMESTAMP null,
    constraint comments_ibfk_1
        foreign key (user_id) references users (id)
            on delete cascade,
    constraint comments_ibfk_2
        foreign key (post_id) references blog_posts (id)
            on delete cascade
)
    auto_increment = 13;

create index post_id
    on comments (post_id);

create index user_id
    on comments (user_id);

create table if not exists pages
(
    id        int auto_increment
        constraint `PRIMARY`
        primary key,
    title     varchar(255)                        not null,
    url       varchar(255)                        not null,
    userId    int                                 not null,
    createdAt timestamp default CURRENT_TIMESTAMP null,
    updatedAt timestamp default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    constraint fk_pages_user
        foreign key (userId) references users (id)
)
    auto_increment = 26;

create table if not exists about_sections
(
    id           int auto_increment
        constraint `PRIMARY`
        primary key,
    title        varchar(255) null,
    content      text         null,
    imageUrl     varchar(255) null,
    tempImageUrl varchar(255) null,
    userId       int          null,
    pageId       int          null,
    constraint about_sections_ibfk_1
        foreign key (userId) references users (id)
            on delete cascade,
    constraint fk_about_sections_page
        foreign key (pageId) references pages (id)
)
    auto_increment = 8;

create index userId
    on about_sections (userId);

create table if not exists feedbacks
(
    id           int auto_increment
        constraint `PRIMARY`
        primary key,
    content      text         null,
    name         varchar(255) null,
    role         varchar(255) null,
    img          varchar(255) null,
    tempImageUrl varchar(255) null,
    userId       int          null,
    pageId       int          null,
    constraint feedbacks_ibfk_1
        foreign key (userId) references users (id)
            on delete cascade,
    constraint fk_feedbacks_page
        foreign key (pageId) references pages (id)
)
    auto_increment = 10;

create index userId
    on feedbacks (userId);

create table if not exists footer
(
    id     int auto_increment
        constraint `PRIMARY`
        primary key,
    logo   varchar(255) null,
    userId int          null,
    pageId int          null,
    constraint fk_footer_page
        foreign key (pageId) references pages (id),
    constraint footer_ibfk_1
        foreign key (userId) references users (id)
            on delete cascade
);

create index userId
    on footer (userId);

create table if not exists navbar
(
    id     int auto_increment
        constraint `PRIMARY`
        primary key,
    logo   varchar(255) null,
    userId int          null,
    pageId int          null,
    constraint fk_navbar_page
        foreign key (pageId) references pages (id),
    constraint navbar_ibfk_1
        foreign key (userId) references users (id)
            on delete cascade
);

create index userId
    on navbar (userId);

create table if not exists services
(
    id      int auto_increment
        constraint `PRIMARY`
        primary key,
    title   varchar(255) null,
    content text         null,
    imgUrl  varchar(255) null,
    userId  int          null,
    pageId  int          null,
    constraint fk_services_page
        foreign key (pageId) references pages (id),
    constraint services_ibfk_1
        foreign key (userId) references users (id)
            on delete cascade
)
    auto_increment = 11;

create index userId
    on services (userId);

create table if not exists team_info
(
    id          int auto_increment
        constraint `PRIMARY`
        primary key,
    title       varchar(255) null,
    description text         null,
    userId      int          null,
    pageId      int          null,
    constraint fk_team_info_page
        foreign key (pageId) references pages (id),
    constraint team_info_ibfk_1
        foreign key (userId) references users (id)
            on delete cascade
)
    auto_increment = 7;

create index userId
    on team_info (userId);

create table if not exists team_members
(
    id     int auto_increment
        constraint `PRIMARY`
        primary key,
    name   varchar(255) null,
    role   varchar(255) null,
    img    varchar(255) null,
    userId int          null,
    pageId int          null,
    constraint fk_team_members_page
        foreign key (pageId) references pages (id),
    constraint team_members_ibfk_1
        foreign key (userId) references users (id)
            on delete cascade
)
    auto_increment = 9;

create index userId
    on team_members (userId);


