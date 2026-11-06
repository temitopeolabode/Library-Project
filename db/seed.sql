insert into authors (name) values
  ('Chinua Achebe'),
  ('Chimamanda Ngozi Adichie'),
  ('Wole Soyinka'),
  ('Ngugi wa Thiong''o'),
  ('Ben Okri');

insert into books (title, year, author_id)
select seed.title, seed.year, authors.id
from (values
  ('Things Fall Apart', 1958, 'Chinua Achebe'),
  ('No Longer at Ease', 1960, 'Chinua Achebe'),
  ('Arrow of God', 1964, 'Chinua Achebe'),
  ('Half of a Yellow Sun', 2006, 'Chimamanda Ngozi Adichie'),
  ('Purple Hibiscus', 2003, 'Chimamanda Ngozi Adichie'),
  ('The Lion and the Jewel', 1959, 'Wole Soyinka'),
  ('Ake: The Years of Childhood', 1981, 'Wole Soyinka'),
  ('A Grain of Wheat', 1967, 'Ngugi wa Thiong''o'),
  ('Petals of Blood', 1977, 'Ngugi wa Thiong''o'),
  ('The Famished Road', 1991, 'Ben Okri')
) as seed(title, year, author_name)
join authors on authors.name = seed.author_name;

insert into members (name, phone) values
  ('Bola Ade', '+234 801 234 5678'),
  ('Tunde Okafor', '+234 802 345 6789'),
  ('Amara Eze', null),
  ('Kemi Balogun', '+234 803 456 7890'),
  ('Chidi Nwosu', null);

insert into loans (book_id, member_id, borrowed_on, due_on)
select books.id, members.id, current_date, current_date + 14
from books
join members on members.name = 'Bola Ade'
where books.title = 'Things Fall Apart';

insert into loans (book_id, member_id, borrowed_on, due_on)
select books.id, members.id, current_date, current_date + 14
from books
join members on members.name = 'Tunde Okafor'
where books.title = 'Half of a Yellow Sun';