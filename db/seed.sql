insert into authors (name) values
  ('Chinua Achebe'),
  ('Chimamanda Ngozi Adichie'),
  ('Wole Soyinka'),
  ('Ngugi wa Thiong''o'),
  ('Ben Okri');

insert into books (title, summary, year, author_id)
select seed.title, seed.summary, seed.year, authors.id
from (values
  ('Things Fall Apart', 'Okonkwo''s rise and fall unfolds alongside the arrival of colonial rule in an Igbo community.', 1958, 'Chinua Achebe'),
  ('No Longer at Ease', 'Obi Okonkwo returns to Lagos after studying in England and faces family expectations, pressure, and corruption.', 1960, 'Chinua Achebe'),
  ('Arrow of God', 'A village chief priest struggles to hold his authority as colonial government and Christian missions reshape his community.', 1964, 'Chinua Achebe'),
  ('Anthills of the Savannah', 'Three friends navigate power, censorship, and resistance in the fictional West African state of Kangan.', 1987, 'Chinua Achebe'),
  ('Half of a Yellow Sun', 'Three lives intersect during the Nigerian Civil War as love, loyalty, and survival are tested.', 2006, 'Chimamanda Ngozi Adichie'),
  ('Purple Hibiscus', 'Teenager Kambili finds her voice amid family control, political unrest, and the warmth of her aunt''s home.', 2003, 'Chimamanda Ngozi Adichie'),
  ('Americanah', 'Ifemelu and Obinze build separate lives across Nigeria, the United States, and Britain before finding their way back.', 2013, 'Chimamanda Ngozi Adichie'),
  ('The Thing Around Your Neck', 'A collection of stories about Nigerian characters negotiating family, migration, identity, and belonging.', 2009, 'Chimamanda Ngozi Adichie'),
  ('The Lion and the Jewel', 'A village schoolteacher returns home and clashes with the resourceful village leader Baroka.', 1959, 'Wole Soyinka'),
  ('Ake: The Years of Childhood', 'Soyinka recalls his early years in the Nigerian town of Ake under British colonial rule.', 1981, 'Wole Soyinka'),
  ('Death and the King''s Horseman', 'A colonial intervention disrupts a Yoruba ritual and sets a community on a tragic course.', 1975, 'Wole Soyinka'),
  ('The Interpreters', 'A group of Nigerian intellectuals confronts ambition, disillusionment, and the promises of a new nation.', 1965, 'Wole Soyinka'),
  ('A Grain of Wheat', 'Villagers prepare for Kenyan independence while the secrets and sacrifices of the resistance come to light.', 1967, 'Ngugi wa Thiong''o'),
  ('Petals of Blood', 'Four people revisit a village transformed by independence, ambition, and widening inequality.', 1977, 'Ngugi wa Thiong''o'),
  ('Weep Not, Child', 'A young boy pursues an education as his family and community are caught up in Kenya''s struggle for independence.', 1964, 'Ngugi wa Thiong''o'),
  ('Devil on the Cross', 'Wariinga''s journey exposes greed and exploitation in a sharp satire of modern Kenya.', 1980, 'Ngugi wa Thiong''o'),
  ('The Famished Road', 'The spirit-child Azaro moves between the human and spirit worlds amid the upheaval of a changing city.', 1991, 'Ben Okri'),
  ('Songs of Enchantment', 'Azaro returns to a world where political conflict and spirit life continue to collide.', 1993, 'Ben Okri'),
  ('Infinite Riches', 'The final Azaro novel follows the spirit-child through a world of political turmoil, danger, and possibility.', 1998, 'Ben Okri'),
  ('The Age of Magic', 'A group of travelers follows an enigmatic artist on a journey that unsettles the boundary between reality and imagination.', 2014, 'Ben Okri')
) as seed(title, summary, year, author_name)
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