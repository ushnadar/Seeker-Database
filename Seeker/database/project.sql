create database if not exists project;
go
use project;
go

-- users table
create table users (
    user_id     int primary key identity(1,1),
    name        varchar(100)  not null,
    email       varchar(100)  unique not null,
    password    varchar(255)  not null,
    phone       varchar(20),
    role        varchar(20)   not null default 'user'
                              check (role in ('user', 'admin')),
    created_at  datetime      default getdate(),

    constraint chk_email_format
        check (email like '%_@__%.__%'),

    constraint chk_name_not_empty
        check (len(ltrim(rtrim(name))) > 0)
);

-- categories table
create table categories (
    category_id   int primary key identity(1,1),
    category_name varchar(100) unique not null
);

-- locations table
create table locations (
    location_id   int primary key identity(1,1),
    location_name varchar(150) not null
);


-- items table
create table items (
    item_id     int primary key identity(1,1),
    user_id     int,
    category_id int,
    location_id int,
    item_name   varchar(150) not null,
    description text,
    item_type   varchar(10)  check (item_type in ('lost', 'found')),
    priority    varchar(10)  check (priority  in ('low', 'medium', 'high')),
    status      varchar(20)  default 'pending'
                             check (status in ('pending', 'approved', 'rejected', 'resolved')),
    image_url   varchar(255),
    report_date date,
    created_at  datetime     default getdate(),

    foreign key (user_id)     references users(user_id)      on delete set null,
    foreign key (category_id) references categories(category_id),
    foreign key (location_id) references locations(location_id)
);


-- claims table
create table claims (
    claim_id          int primary key identity(1,1),
    item_id           int,
    claimant_id       int,
    proof_description text,
    proof_image       varchar(255),
    claim_status      varchar(20) default 'pending'
                                  check (claim_status in ('pending', 'approved', 'rejected')),
    claim_date        datetime    default getdate(),

    foreign key (item_id)     references items(item_id)  on delete cascade,
    foreign key (claimant_id) references users(user_id)  on delete no action
);


-- itemmatches table
create table itemmatches (
    match_id      int primary key identity(1,1),
    lost_item_id  int,
    found_item_id int,
    match_score   decimal(5,2) check (match_score between 0 and 100),
    match_date    datetime default getdate(),

    foreign key (lost_item_id)  references items(item_id),
    foreign key (found_item_id) references items(item_id)
);

-- notifications table
create table notifications (
    notification_id int primary key identity(1,1),
    user_id         int,
    message         text         not null,
    is_read         bit          default 0,
    created_at      datetime     default getdate(),

    foreign key (user_id) references users(user_id) on delete cascade
);


-- auditlogs table
create table auditlogs (
    log_id      int primary key identity(1,1),
    admin_id    int,
    action      varchar(255) not null,
    action_time datetime     default getdate(),

    foreign key (admin_id) references users(user_id) on delete set null
);

-- duplicatereports table
create table duplicatereports (
    duplicate_id  int primary key identity(1,1),
    item1_id      int,
    item2_id      int,
    detected_date datetime default getdate(),

    foreign key (item1_id) references items(item_id),
    foreign key (item2_id) references items(item_id),

    constraint chk_no_self_duplicate check (item1_id <> item2_id)
);
go


-- stored procedure: signup
create procedure sp_signup
    @name     varchar(100),
    @email    varchar(100),
    @password varchar(255),
    @phone    varchar(20) = null,
    @role     varchar(20) = 'user'
as
begin
    set nocount on;

    if @role not in ('user', 'admin')
    begin
        raiserror('invalid role. must be user or admin.', 16, 1);
        return;
    end

    if len(ltrim(rtrim(@name))) = 0 or len(ltrim(rtrim(@email))) = 0 or len(ltrim(rtrim(@password))) = 0
    begin
        raiserror('name, email and password are required.', 16, 1);
        return;
    end

    if @email not like '%_@__%.__%'
    begin
        raiserror('invalid email format.', 16, 1);
        return;
    end

    if exists (select 1 from users where email = @email and role = @role)
    begin
        raiserror('email already registered for this role.', 16, 1);
        return;
    end

    if len(@password) < 6
    begin
        raiserror('password must be at least 6 characters.', 16, 1);
        return;
    end

    insert into users (name, email, password, phone, role)
    values (
        ltrim(rtrim(@name)),
        lower(ltrim(rtrim(@email))),
        @password,
        @phone,
        @role
    );

    select scope_identity() as new_user_id;
end
go

-- stored procedure: login
create procedure sp_login
    @email varchar(100),
    @role  varchar(20)
as
begin
    set nocount on;

    if len(ltrim(rtrim(@email))) = 0 or len(ltrim(rtrim(@role))) = 0
    begin
        raiserror('email and role are required.', 16, 1);
        return;
    end

    if @role not in ('user', 'admin')
    begin
        raiserror('invalid role.', 16, 1);
        return;
    end

    select user_id, name, email, password, role
    from users
    where email = lower(ltrim(rtrim(@email)))
      and role  = @role;
end
go