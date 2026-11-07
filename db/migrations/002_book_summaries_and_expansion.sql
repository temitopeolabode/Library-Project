alter table books add column if not exists summary text;

update books
set summary = seed.summary
from (values
  ('Things Fall Apart', 'Okonkwo''s rise and fall unfolds alongside the arrival of colonial rule in an Igbo community.'),
  ('No Longer at Ease', 'Obi Okonkwo returns to Lagos after studying in England and faces family expectations, pressure, and corruption.'),
  ('Arrow of God', 'A village chief priest struggles to hold his authority as colonial government and Christian missions reshape his community.'),
  ('Anthills of the Savannah', 'Three friends navigate power, censorship, and resistance in the fictional West African state of Kangan.'),
  ('Half of a Yellow Sun', 'Three lives intersect during the Nigerian Civil War as love, loyalty, and survival are tested.'),
  ('Purple Hibiscus', 'Teenager Kambili finds her voice amid family control, political unrest, and the warmth of her aunt''s home.'),
  ('Americanah', 'Ifemelu and Obinze build separate lives across Nigeria, the United States, and Britain before finding their way back.'),
  ('The Thing Around Your Neck', 'A collection of stories about Nigerian characters negotiating family, migration, identity, and belonging.'),
  ('The Lion and the Jewel', 'A village schoolteacher returns home and clashes with the resourceful village leader Baroka.'),
  ('Ake: The Years of Childhood', 'Soyinka recalls his early years in the Nigerian town of Ake under British colonial rule.'),
  ('Death and the King''s Horseman', 'A colonial intervention disrupts a Yoruba ritual and sets a community on a tragic course.'),
  ('The Interpreters', 'A group of Nigerian intellectuals confronts ambition, disillusionment, and the promises of a new nation.'),
  ('A Grain of Wheat', 'Villagers prepare for Kenyan independence while the secrets and sacrifices of the resistance come to light.'),
  ('Petals of Blood', 'Four people revisit a village transformed by independence, ambition, and widening inequality.'),
  ('Weep Not, Child', 'A young boy pursues an education as his family and community are caught up in Kenya''s struggle for independence.'),
  ('Devil on the Cross', 'Wariinga''s journey exposes greed and exploitation in a sharp satire of modern Kenya.'),
  ('The Famished Road', 'The spirit-child Azaro moves between the human and spirit worlds amid the upheaval of a changing city.'),
  ('Songs of Enchantment', 'Azaro returns to a world where political conflict and spirit life continue to collide.'),
  ('Infinite Riches', 'The final Azaro novel follows the spirit-child through a world of political turmoil, danger, and possibility.'),
  ('The Age of Magic', 'A group of travelers follows an enigmatic artist on a journey that unsettles the boundary between reality and imagination.')
) as seed(title, summary)
where books.title = seed.title;

update books set summary = 'A story from the community library collection.' where summary is null;
alter table books alter column summary set not null;

insert into books (title, summary, year, author_id)
select seed.title, seed.summary, seed.year, authors.id
from (values
  ('Anthills of the Savannah', 'Three friends navigate power, censorship, and resistance in the fictional West African state of Kangan.', 1987, 'Chinua Achebe'),
  ('Americanah', 'Ifemelu and Obinze build separate lives across Nigeria, the United States, and Britain before finding their way back.', 2013, 'Chimamanda Ngozi Adichie'),
  ('The Thing Around Your Neck', 'A collection of stories about Nigerian characters negotiating family, migration, identity, and belonging.', 2009, 'Chimamanda Ngozi Adichie'),
  ('Death and the King''s Horseman', 'A colonial intervention disrupts a Yoruba ritual and sets a community on a tragic course.', 1975, 'Wole Soyinka'),
  ('The Interpreters', 'A group of Nigerian intellectuals confronts ambition, disillusionment, and the promises of a new nation.', 1965, 'Wole Soyinka'),
  ('Weep Not, Child', 'A young boy pursues an education as his family and community are caught up in Kenya''s struggle for independence.', 1964, 'Ngugi wa Thiong''o'),
  ('Devil on the Cross', 'Wariinga''s journey exposes greed and exploitation in a sharp satire of modern Kenya.', 1980, 'Ngugi wa Thiong''o'),
  ('Songs of Enchantment', 'Azaro returns to a world where political conflict and spirit life continue to collide.', 1993, 'Ben Okri'),
  ('Infinite Riches', 'The final Azaro novel follows the spirit-child through a world of political turmoil, danger, and possibility.', 1998, 'Ben Okri'),
  ('The Age of Magic', 'A group of travelers follows an enigmatic artist on a journey that unsettles the boundary between reality and imagination.', 2014, 'Ben Okri')
) as seed(title, summary, year, author_name)
join authors on authors.name = seed.author_name
where not exists (
  select 1 from books where books.author_id = authors.id and books.title = seed.title
);