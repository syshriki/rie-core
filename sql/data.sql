SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));

INSERT INTO recipes (title, slug, description, recipe, author_id, created_at)
VALUES(
  'Mom''s Hareera',
  CONCAT('r', currval('recipe_slug')),
  'Moroccan bean and chicken soup',
  'Soup:
1 cup chickpeas, soaked overnight
1/2 cup white navy beans, soaked overnight
1/4 cup brown lentils
1/2 lb chicken
1 cup diced onion
1 cup chopped parsley
2 teaspoons black pepper
1 tsp tumeric
2 tablespoons soup mix
1 tablespoon salt
1/4 cup olive oil
13 cups water

1/3 cup flour
3/4 cup water

3 eggs
Egg Noodles

The night before:
1. Soak chickpeas and navy beans in water
2. Mix together flour and water and leave covered overnight

When you are ready to make the soup:
1. Pour 1/4 cup oil into a stock pot and heat
2. Throw in chicken, beans, lentils, onion, parsley, pepper, tumeric, salt and soup mix and let it cook about 5 minutes
3. Add the water and bring to a boil
4. Turn down the flame and let it simmer for 1 hour
5. Really mix the flour and water mixture that you prepped the night before to avoid clumps and mix it into the soup. Mix it well. Simmer for 15 minutes
6. Lightly scramble 3 eggs and slowly pour into the soup while stirring gently
7. Turn off the flame and let the soup stand for 10 minutes.
8. Serve with egg noodles

',
  'ra1:7',
  to_timestamp(1659460285)
);

SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Chicken Pho',CONCAT('r', currval('recipe_slug')),'Aromatic Vietnamese chicken noodle soup','Ingredients:
- 2 medium white or yellow onions
- 20 g fresh ginger
- 2 tbsp coriander seeds
- 1 cinnamon stick approximately 2 inches
- 2 star anise pods

- Whole chicken cut in half
- 6 c water
- 2½ tbsp salt (1 tbsp if using Kosher chicken)
- 3 tbsp sugar
- 2 tsp MSG or 2 tbsp chicken soup bouillon
- 16 oz (1 pack) dried phở noodles or any thin rice noodle 

Optional Accoutrements: 
- Bean sprouts
- Thai basil
- Cilantro
- Lime sliced into wedges
- Sliced jalapenos
- Hoisin sauce
- Sriracha

I suggest at the very least have bean sprouts, cilantro and sriracha.

Instructions:
- On a sheet pan, roast the onions and ginger both sliced in half, in the middle rack of an oven on 375°F to 400°F for 15-30 minutes or until dark brown but not blackened.

- Wrap the spices in foil and bake 350°F for 5 minutes (or roast on a pan medium heat until lightly browned and aromatic).

- Add the aromatics, spices, and all soup ingredients into a large stock pot and bring to a boil on high heat. Once it hits a boil, lower the heat to maintain a low boil and cook the chicken for 25-40 minutes until the chicken is cooked all the way through.

- Remove the chicken once done and rinse under cold water for one minute to cool. This will prevent the chicken from getting dark. Once the chicken has cooled, shred the meat into bite-sized pieces. 

- Cook the rice noodles according to package instructions only just before you’re ready to serve it. Cooking the noodles usually take about 5 minutes after boiling the water. 

- To assemble, start with portioning the noodles into a bowl, and then add the soup, shredded chicken, and accoutrements on top.','ra1:7',to_timestamp(1659522410));

SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Zinger',CONCAT('r', currval('recipe_slug')),'Citrusy mixed drink','ingredients:
2 oz pineapple infused vodka
0.5 oz white rum
orange bitters
tonic water

Shake vodka, rum, and bitters. pour over ice and add tonic water to taste.

','ra1:7',to_timestamp(1659922244));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));

INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Achraime',CONCAT('r', currval('recipe_slug')),'Libyan fish in sauce ','Ingredients 

- 8-10 large cloves of Garlic 
- lemon
- 2 tbsp Olive oil 
- 3/4 can tomato paste 
- 1 teaspoon cumin
- 1 teaspoon ground caraway 
- 1/2 teaspoon cayenne pepper
- salt 
- fish (white fish is best )

Method

1) crush garlic and sauté until soft in olive oil
 
2) Once garlic is cooked add tomato paste and stir for about 1 minute, add cumin, caraway, cayenne pepper and salt and stir until you have a salsa like consistency 

3) add water until you have a thick sauce and let cook for 2 mins, taste sauce to make sure balance is correct, if needed add equal parts cumin and caraway

4) add fish into sauce and cover, cook until fish is fully cooked 

5) squeeze half a lemon and cook for another 2 minutes 

Serve warm and enjoy ❤️','ra1:7',to_timestamp(1670167220));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Baked Salmon ',CONCAT('r', currval('recipe_slug')),'Baked salmon in seafood spice ','Ingredients

1) 4-5 pieces of salmon (fresh is best) 
    Or 1 large salmon fillet 
2) 4-5 peeled garlic cloves 
3) 1/4 cup avocado oil
4) cilantro 
5) salt 
6) 1 tablespoon chicken consommé (optional)
7) pereg schwarma or seafood spice

Method 

1) soak salmon in bowl with water, salt and 1/2 lemon juiced for about 30-45 mins, rinse and dry salmon 

2) in a bowl mix the oil, 4/5 tablespoons of seafood spice, salt and chicken consommé, mix until you have a thick rub like consistency, add more spice if required 

3) if salmon pieces, then salmon pieces into the oil mixture until fully covered. If using a salmon fillet for the oil mixture evenly over the entire fillet

4) in a large baking tray place fish (skin side down) sprinkle peeled garlic cloves and some cilantro 

5) Bake covered for 15 minutes at 400 F/ 200 C, after 15 minutes uncover and bake for another 10 minutes 

Serve and enjoy ❤️','ra1:7',to_timestamp(1670168438));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Spinach salad ',CONCAT('r', currval('recipe_slug')),'Spinach salad with honey lemon dressing ','Ingredients 

1) 1 bag of baby spinach 
2) sweet potato diced 
3) pomegranate seeds 
4) candied nuts (optional)

Dressing 

1) 1 Tablespoon of honey or date silan
2) 1 lemon squeezed 
3) salt & black pepper to taste 

Method

1) wash and check spinach, chop the sweet potato and add to spinach with pomegranate seeds and candied nuts 

2) mix dressing ingredients all together until combined 

3) add dressing to salad right before serving 🥗


Other variations of salad 

- spinach, mango, candied nuts 
- spinach, strawberries, candied nuts 
- spinach, orange and pistachios 
','ra1:7',to_timestamp(1670171592));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Purple Cabbage salad ',CONCAT('r', currval('recipe_slug')),'Asian style purple cabbage salad ','Ingredients 
 - 1 bag of purple cabbage pre washed 
- 1 cucumber, diced small
- 1/2 can of mandarin oranges 
- 2 scallions 
- crunchy chow mein noodles 

Dressing 
- 1/8 cup soy sauce 
- 1/8 cup sesame oil 
- 1/8 cup honey
- Sesame seeds (optional)
- juice from mandarin oranges (just a little) 


Method

1) mix the purple cabbage, cucumber, scallions  in a bowl 

2) top with mandarin oranges and crunchy noodles 

3) in a seperate bowl mix all the dressing ingredients until combined and it tastes mildly salty, add more juice from
Mandarin oranges if it’s too salty 

Dress salad right before serving, mix well and enjoy ❤️🥗','ra1:7',to_timestamp(1670171938));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Shanis iceberg lettuce salad ',CONCAT('r', currval('recipe_slug')),' ','Lettuce (iceberg)
Mint (optional) 
Parsley
Pomegranate 
Craisens


Dressing 

Silan
Olive oil
Lemon
Salt/pepper','ra1:7',to_timestamp(1670172823));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Spicy Tomato Salad ',CONCAT('r', currval('recipe_slug')),'  ','Ingredients 

1) 3-4 tomatoes 
2) 2 cloves of garlic (diced)
3) 1 jalapeño/ spicy pepper 
4) chopped cilantro 
5) 1/2 lemon 
6) olive oil
7) salt & pepper to taste 

Method

1) dice tomatoes and spicy pepper into small pieces, mix in cilantro and garlic 

2) squeeze half a lemon, olive oil and salt and pepper to taste and mix in 

Serve and enjoy ❤️','ra1:7',to_timestamp(1670189088));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Sfenj',CONCAT('r', currval('recipe_slug')),'Moroccan fried doughnuts','SFENJ

1 TBSP active dry yeast
3 TBSP sugar
1 cup warm water
2.5 cups + 2 TBSP flour
zest from 1 orange
1/2 tsp salt

oil, for frying

SYRUP
1/2 cup sugar
1/2 cup water
3 cardamom pods
pinch of saffron (decadent and optional)

To make the sfenj:
1. Combine water and yeast
2. Add in the flour, sugar, salt and orange zest
3. Mix the dough and knead for about 15 minutes until the dough feels very smooth and elastic.
4. Allow the dough to rise until double in volume 
5. Heat the oil to 350 degrees.
6. Once the dough has fully risen, divide the dough into 8 pieces (10 if you like smaller donuts). Make a hole in the center of each piece and make them donut shaped
7. Fry up to 3 sfenj at a time, as space allows, for 2 minutes on each side. Sfenj should be a nice golden color when they''re done
8. Let them cool for about 4 minutes and dip in syrup.  

To make the syrup:
1. Combine the water, sugar, cardamom pods and saffron (if using) 
2. Boil mixture until it becomes syrupy. When you dip a spoon in it the syrup should coat the back of the spoon nicely. 
3. Let it cool fully before dipping the sfenj.
  ','ra1:7',to_timestamp(1670189247));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Zuchinni kugel ',CONCAT('r', currval('recipe_slug')),' ','Ingredients 

- 5 large zucchini, grated 
- 3 large onions, grated 
- 1 and 1/2 cups of self raising flour 
- 3/4 cup water
- 3/4 cup oil 
- 3 eggs 
- 1 Tbsp chicken consommé 
- Salt & pepper to taste 

Method 

1) preheat the oven to medium heat 

2) grate and squeeze the zucchini’s to remove excess water 

3) mix the onions, flour, oil, eggs and consommé into the zucchini’s 

4) add salt and pepper to taste and mix well

5) oil the baking tray and bake for about 1 hour until brown 

Let cool, serve and enjoy ❤️🍽️','ra1:7',to_timestamp(1670189834));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Tadik ',CONCAT('r', currval('recipe_slug')),'Persian fried rice ','Ingredients 

- 1 potato peeled and sliced 
- 2 cups of jasmine rice 
- 3 cups of water 
- oil 
- 1 tsp of turmeric
- salt 

Method 

1) wash rice

2) in a pot bring 3 cups of water to a boil, with a pinch of salt and some oil, add rice and turn down heat to low simmer (covered)

3) once rice is about 60% cooked (rice has absorbed all the water but is not fully cooked) remove rice and put in bowl

4) wash the pot and add oil & tumeric. Once the oil is hot add the potato slices 

5) once potatoes are soft add the rice back to the pot and let cook for about 15/20 minutes until the bottom of the rice is crispy. 

Flip pot onto a large plate and serve immediately 
Enjoy 🍚😍','ra1:7',to_timestamp(1670190262));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Broccoli Kugel',CONCAT('r', currval('recipe_slug')),' ','Ingredients 

- 1 packet of frozen broccoli 
- 4 eggs 
- 1 cup of mayonnaise 
- crushed garlic 
- salt & pepper
- cayenne pepper 

Method 

Preheat oven to 375F/ 190C

1) thaw the broccoli and wash broccoli

2) mix the eggs and mayonnaise with garlic, salt and pepper, cayenne pepper 

3) add broccoli into mixture and mix well

4) oil baking pan and poor mixture into baking pan 

5) sprinkle with sesame seeds and bake for about 1 hour and 15 minutes 

Let cool, serve and enjoy 🥦😍','ra1:7',to_timestamp(1670191269));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Potato soup ',CONCAT('r', currval('recipe_slug')),' ','Ingredients 

- chicken bones 
- salt
- pepper
- turmeric 
-2-3 leeks 
- 1 onion
- 5lbs potato 
- dill (optional)


Method 

1) Boil some chicken bones in a big pot with salt pepper and tumeric, then strain it so no bones in the broth. 

2) Cut up 2-3 leeks, an onion and enough potato to bring the veggies a little over half way to the level of the broth and cook until soft

Optional: put in a splash of wine and a little bit of dill

3) Use a food processor, blender or immersion blender and make the soup smooth.','ra1:7',to_timestamp(1670199518));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Cholent ',CONCAT('r', currval('recipe_slug')),' ','Ingredients 

- 2 medium potatoes
- 1 sweet potato
- 1 onion 
- cholent meat 
- kishke
- 3 eggs 

- 2 tbsp paprika hot in oil
- 1 tsp cumin 
- 1 tsp salt 
- 1 tsp black pepper
- 1 tbsp consommé 



Method 

1) Dice onion and fry in a generous amount of oil

2) add paprika, salt pepper chicken consume and cayenne pepper fry with onions for 30 sec & turn off

3) rinse barley and put in a large bowl, add potato and sweet potato and sweet potato

4) mix spice mixture into vegetables with meat 

5) put into crock put and cover with water 

6) add kishke and eggs 

7) cook on high for 1 hour then cover to low until Shabbat lunch

Shabbat Shalom ❤️
','ra1:7',to_timestamp(1670200579));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Buffalo Sauce',CONCAT('r', currval('recipe_slug')),'3 ingredient buffalo sauce','Ingredients:
1 cup margarine
2 tbs garlic powder
1 1/3 cup hot sauce

Steps:
1. Melt margarine in microwave or saucepan 
2. Mix in garlic powder and hot sauce.
3. Use immediately or store in air tight container in fridge for up to a month.
','ra1:7',to_timestamp(1670211392));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Mafrum',CONCAT('r', currval('recipe_slug')),'Shanis recipe ','Mafrum 
*Meat ( mix all)*
1/2 kilo mince 
1 onion diced finely
Salt
Pepper
Paprika 
Cumin 
Chicken stock
Pour Once round the bowl with oil 
Cilantro 


Peel 4-5 potatoes and cut roughly 1 cm/half an inch thick and then slice in middle not letting knife go to the other side completely ( and then fill with meat) 

Once mafrum filled dip in flour and make sure completely coated 

After flour dip in a mixture of egg and tomato paste 

Fry off till golden

*Sauce*
Fry 1 onion diced 
Add:
Garlic 
Tbsp tomato paste 
Paprika 
Cumin
Salt 
Pepper 
Chicken stock 

After frying for a little add 3 cups of boiling water and mix','ra1:7',to_timestamp(1670211555));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Roasted whole chicken ',CONCAT('r', currval('recipe_slug')),' ','Ingredients 

1) whole chicken 
2) one packet of coarse salt
3) 5-6 potatoes washed  (optional)

Method 

1) wash chicken 

2) line a baking pan with parchment paper, spread a thick layer of salt on the edges on the baking pan 

3) place chicken in the middle of salt , (add potatoes around chicken if you would like) 

4) bake in oven at 400F / 200c for about 1.5 hours until chicken is cooked

Serve and enjoy 🍗❤️','ra1:7',to_timestamp(1670211677));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Grandma''s Stuffing ',CONCAT('r', currval('recipe_slug')),'Thanksgiving ','Ingredients 

- 2 Stale Challah, cut up in small cubes (can use croutons as well)
- 2-3 tsp chicken consommé 
- 3-4 onions, diced small 
- 2-3 Celery stalks, diced small 
- 1/2 cup crisco
- 2-3 tsp Poultry seasoning 
- 3-4 Eggs
- 2 Cups boiling water

Method:

1) Brown veggies in Crisco for 1 hour and add poultry seasoning 

2) Mix chicken consommé with boiling water and pour over challah, mix very well. 

3) Add eggs and mix, then add cooked vegies and 1/2 cup of crisco

4) Mix well until it forms a dough like consistency ','ra1:7',to_timestamp(1670383803));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Green Beans ',CONCAT('r', currval('recipe_slug')),'Green beans baked with garlic ','Ingredients 

- 1 packet of green beans (washed & trimmed)
- 8-10 peeled garlic cloves
- olive oil (or sesame oil)
- 1 tsp salt 
- 1 tsp pepper 
- garlic powder to taste 

Method

1) toss green beans in oil, add salt, pepper and garlic powder and mix well

2) mix in garlic cloves and spread on a baking tray

3) bake at 375F/180C for about 25-30 minutes until green beans are soft','ra1:7',to_timestamp(1670384265));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Green Beans ',CONCAT('r', currval('recipe_slug')),'Green beans cooked in tomato sauce ','Ingredients:

- 1 onion 
- 3/4 can of tomato paste 
- Oil 
- 1 tsp paprika 
- 1/2 tsp cayenne pepper 
- 1 tsp chicken consommé 
- Salt & pepper to taste 
- 1 packet of green beans (washed & trimmed)
- 1/2 cup water 

Method

1) Fry onion in oil until golden brown 

2) add tomato paste and fry for about 30 seconds 

3) add paprika, salt, pepper, chicken consommé and cayenne pepper and mix well

4) add 1/2 cup water, mix well and let boil for a few minutes 

*best to taste sauce at this point and adjust spices as required* 

5) Turn heat to low and add in green beans 

6) cook covered until green beans are soft','ra1:7',to_timestamp(1670384281));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Apple Crumble ',CONCAT('r', currval('recipe_slug')),'Can be made as a big cake or small cupcakes 
','Ingredients 

- 4-5 granny smith apples 
-1 teaspoon of sugar 
- 1/2 teaspoon of cinnamon 
- half a lemon squeezed 

Crumble 
 - 1 cup of rolled oats 
- 1 cup of flour 
- 1 cup of sugar 
- 1/2 cup margarine 
- pinch of salt 
- pinch of cinnamon 

Method

1) Peel and cut the apples into small pieces

2) boil the apples in water, add the sugar and cinnamon. 

3) add lemon juice to apples, and boil until soft.  

4) in a separate bowl mix the oats, flour, sugar, margarine, salt and cinnamon until it forms a crumble like consistency. 

5) pour the apples into baking pan, cover with the crumble and bake at 350F/180C until top golden brown (around 30-45 mins)

','ra1:7',to_timestamp(1670384648));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Chocolate Chip Cookies ',CONCAT('r', currval('recipe_slug')),'Nestle Toll House Chocolate chip cookies ','Ingredients 

- 2 and 1/4 cups flour 
- 1 tsp baking soda
- 1 tsp salt 
- 1 Cup margarine 
- 3/4 cup white sugar 
- 3/4 cup brown sugar 
- 1 tsp vanilla 
- 2 eggs 
- 2 cups chocolate chips 

Method

1) In a small bowl combine the flour, soda and salt

2) Beat margarine, sugar, brown sugar and vanilla in a large bowl. 

3) add eggs one at a time beating well

4) gradually beat in flour mixture 

5) stir in chocolate chips 

6) drop by rounded tablespoons onto ungreased baking pan and bake at 375F/ 190C for 9-11 minutes ','ra1:7',to_timestamp(1670384961));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Pavlova ',CONCAT('r', currval('recipe_slug')),'Meringue cake with cream and fruit ','*Base*
Ingredients 

- 4-6 egg whites 
- 1 and 1/2 cups sugar 
- 1 tbsp potato starch 
- 1 tbsp vinegar 

Method 

1) Beat the egg whites slowly and gradually add in the sugar until firm

2) add in the poattao starch and vinegar and mix well. 

3) flatten in a baking pan and bake at 210F/100C for about 2 hours until meringue has completely hardened. 

*Cream*

- 1 packet of parve whipping cream 
- 2 tbsp vanilla pudding 

Method:

4) whip cream and vanilla pudding until cream has peaks, a good test to confirm it is done is if you can tip the bowl upside down and the cream doesnt move, 



Assemble pavlova 

5) pour cream over meringue base 

6) add fruits 
    - sliced strawberries 
    - sliced kiwis 
    - blueberries 

7) top with passionfruit pulp or raspberry coulis etc. 
 ','ra1:7',to_timestamp(1670385414));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Caeser Salad ',CONCAT('r', currval('recipe_slug')),'Caeser salad and MYO croutons','Ingredients 

- 1 bunch romaine lettuce 
- 4 stalks heart of palm 
- 1 cucumber 
- croutons 
- Caeser dressing 

Method:

1) wash and check the romaine lettuce and cut into small strips 

2) slice the heart of palm and add to lettuce 

3) dice the cumber small and add to salad 

4) top with croutons 

5) immediately before serving add a generous amount of dressing and mix well until the lettuce looks well covered. 


*Croutons* 

to make your own croutons you should dice bread, toss with olive oil and add salt, pepper, garlic powder, paprika and parsley flakes 

bake until bread is crispy and hard','ra1:7',to_timestamp(1670385791));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Sponge variety cakes',CONCAT('r', currval('recipe_slug')),'Easy to bake sponge variety cake ','Ingredients 

- 4 Cups of self raising flour 
- 2 tbsp baking powder
- 4 tbsp vanilla sugar
- 1 cup of sugar 
- 1 cup oil 
- 2 cups orange juice 
- 4 Large eggs 

Suggested topping:

- Cinnamon & Sugar 
- Cocoa powder (marble cake) 
- Chocolate Chips 
- White chocolate & frozen raspberries 
- Shredded coconut & Macadamia Nuts 

Method:

1) Preheat the oven to 355F/180C

2) Sift the flour, baking powder, vanilla sugar and sugar n a large bowl. 

3) add the oil and orange juice and mix well 

4) add eggs one by one and mix with a hand beater (electric, not a mixer)

5) oil the trays and your favorite toppings/ mixed in 

6) bake until toothpick comes out clean
','ra1:7',to_timestamp(1670386282));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Challah ',CONCAT('r', currval('recipe_slug')),'LA''s best Challah ','Ingredients 

- 4 Tbs dry yeast 
- 1 cup Sugar 
- 4 and 1/2 cups very warm water
- 1 cup oil 
- 3 eggs 
- 5lbs of flour (2.27 kg)
- 4 Tbs salt
- Challah toppings

Method:

1) in a bowl add the yeast, sugar and warm water, stir well and leave for about 10 minutes until it becomes frothy

2) once frothy add to the same bowl the oil and eggs

3) gradually add the flour and salt (you may need to add more flour if the dough is sticky or more water if the dough is too dry)

4) once it binds well and the dough is not too stick put in a large bowl that you have oiled well. 

5) cover with a damp towel until it doubles in size (around 40 minutes) 

**don''t forget to take challah with a bracha**

6) start shaping challah 

7) once shaped let it rise for another 45 - 60 mins 

8) Glaze with eggs and sprinkle with topping ( sesame seeds, everything bagel spice, poppy seeds, zaatar etc). 

9) Bake at 350F/ 175C for about 20-35 minutes 

* check for readiness by tapping the base of the challah, it should look slightly crisp but not soggy and make a hollow sound when tapped*

10) Let cook on a rack','ra1:7',to_timestamp(1670386860));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Pumpkin Pie',CONCAT('r', currval('recipe_slug')),'Dairy free pumpkin pie with coconut milk','Filling:
3 large eggs
15 oz can pumpkin puree (or 2 cups fresh pumpkin puree)
1 cup full fat coconut milk*
1 tsp vanilla extract
3/4 cup light brown sugar
1/2 tsp sea salt
1 tsp ground cinnamon
1 1/2 tsp pumpkin pie spice (1 teaspoon ground cinnamon, 1/4 teaspoon ground nutmeg, 1/4 teaspoon ground ginger, 1/8 teaspoon ground cloves)

Pie Crust:
1 1/4 cups all-purpose flour
1/2 tsp sea salt
1 TBS granulated sugar
1/2 cup earth balance vegan butter sticks chilled, and cut into 1 inch pieces**
1/4 cup ice cold water

Make the pie Crust:
Place the flour, salt, and sugar in a food processor fitted and pulse to combine.
Add the vegan butter and cold water, process until the mixture begins to stick together, and holds together when pinched.
Remove dough from processor (will be crumbly) and form into a ball.
Wrap in plastic wrap and refrigerate for at least 60 minutes or overnight

Make the filling:
In a large bowl, beat the eggs. 
Whisk in the pumpkin, coconut milk and vanilla extract until combined.
Add sugar, salt, cinnamon and pumpkin pie spice and mix until completely combined.

Final steps:
Preheat your oven to 425 degrees F.
Lightly grease a pie plate and set aside.
Roll out your pie dough on a well-floured surface to fit the size of your pie plate.
Carefully transfer the dough to the pie plate and shape the crust how you want it to look.
Pour the filling into the unbaked pie crust and cover the crust with a pastry shield
Bake for 15 minutes at 425 degrees F. 
Reduce the temperature to 350 degrees F and continue to bake for 50 to 60 minutes, or until a knife inserted comes out clean.  It may be a bit wobbly still, but it will firm-up as it cools.
Allow the pie to cool on a wire rack for 2 hours.  
Serve or refrigerate until ready to serve.','ra1:7',to_timestamp(1670387166));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Perfect Baked Potato',CONCAT('r', currval('recipe_slug')),'This baked potato has a crisp, golden skin, and is light and fluffy on the inside - a perfect baked potato.','Preheat the oven to 300 degrees F (150 degrees C). 

Scrub the potato, and pierce the skin several times with a knife or fork. 

Rub the skin with olive oil, then with salt. 

Place the potato in the preheated oven, and bake until slightly soft and golden brown, about 90 minutes. 

Slice the potato down the center, and serve with butter and black pepper. 

Sprinkle shredded Cheddar cheese over the top, if desired.','ra1:7',to_timestamp(1670387218));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Sweet and Sour Meatballs',CONCAT('r', currval('recipe_slug')),'sweet and sour meatballs in tomato sauce','meat:
1 lb ground beef
1lb ground turkey
2/3 cup matzo meal
2 eggs
1/2 cup water
1/2 cup grated onion
salt
pepper
1/4c catsup
2 tsp cumin
1/4 tsp ginger
mix together and form balls

sauce:
1 28oz can of crushed tomatoes
1 6oz can of tomato paste
3 cloves of garlic chopped
1 bay leaf
1 Tbs soup mix
1/2 onion cut into small pieces
cook together for 1/2 hour and then remove bay leaf
put the rest into a food processor and puree
pour into a sauce pot and add 1/2 a sweet pepper
add salt
pepper
1/2 cup water
1/2 cup lemon juice
1 cup brown sugar
Cook for about 15 min, then add meatballs
Cook for about 20-30 minutes over medium -low flame so it simmers
serve with rice','ra1:7',to_timestamp(1670387421));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Gravy',CONCAT('r', currval('recipe_slug')),'Thanksgiving','Ingredients 

- 1/4 cup olive oil 
- 2 lbs smoked turkey necks 
- 2 stalks celerey, roughly chopped 
- 2 carrots, roughly chopped
- kosher salt & ground black pepper 
- 1/4 cup flour 
- 1 qt chicken broth 
- 2 springs fresh thyme 
- 2 cloved garlic smashed 
- 1 medium onion, roughly chopped 

Method:

1) heat oil to medium heat and add brown bones to all sides, 6-7 minutes 

2) add celery, carrot, garlic and onion and sauté until onions are translucent
season with salt & pepper 

3) decrease heat to medium and add flour to mixture to form a rue, stir well and cook for 8-10 minutes 

4) add broth and thyme and whisk until smooth

5) bring to boil and them reduce to simmer for 10 minutes 

6) Drain the gravy to remove chunks 
','ra1:7',to_timestamp(1670388154));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Jalapeño dip ',CONCAT('r', currval('recipe_slug')),'Mayonnaise based dip','Ingredients 

- 1/4 cup mayonnaise 
- 1 tsp olive oil
- 6 cloves garlic 
- 5 jalapeños 
- 2-4 Serrano peppers 
- fresh parsley 
- salt 
- Pepper 

Method 

1) cut the peppers in half first and check they''re not buggy (they often are) if they''re not buggy use the seeds also for the dip. If they''re buggy, you''ll prob have to chuck the seeds but might be able to save the peppers

2) in a bowl add the cut peppers, Mayo, olive oil, garlic, parsley, salt & pepper 

3) use an immersion blender to blend until smooth 
','ra1:7',to_timestamp(1670432220));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Beetroot Kuba',CONCAT('r', currval('recipe_slug')),'Beetroot… Kuba ','Soup:
1 onion 
1 tablespoon tomato paste
Paprika (can add spicy as well)
Cumin
Salt/pepper
Chicken stock 
3 beetroots peeled and sliced
Water 

Fry off onion until golden, add tomato paste and spices, fry until they combine well. Add beets and fry for a little too!
Add chicken  stock  and water, cover and boil for half hour prior to adding kuba

Kuba
Dough:
1.5 cup semolina (coarse)
Salt
One time round the bowl oil
Water enough until it becomes a dough. (1/2-1 cup)

Mix all and let sit for half hour

Meat
1/2 kilo ground beef
1 onion diced
(Optional: 1 clove of garlic minced)
Cilantro
Cumin
Paprika 
Salt pepper
Chicken stock 

Make little balls kinda like meatballs and with wet hands (key is always having them wet!) flatten out the dough in the palm of your hand, add meat and carefully cover the meatball in the dough. Make sure there is no holes or the Kuba will fall apart in the soup. 
Add to boiling soup and let boil until cooked through, constantly moving the pot so they don’t stick to the bottom. 
','ra1:7',to_timestamp(1670540142));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Matbucha',CONCAT('r', currval('recipe_slug')),'Tomato chutney ','6-7 tomatoes diced
Oil like it’s the Chanukah miracle 
Garlic (at least half a head but here it’s as much as your heart desires)
1 green chilli sliced 

1 large spoon sweet paprika 
1 large spoon cumin
Salt/pepper

Put all on a lowest heat, mixing occasionally until all the water disappears (should take close to 4 hours, but can mix every half hour to an hour)','ra1:7',to_timestamp(1670540365));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Pizza Sauce',CONCAT('r', currval('recipe_slug')),'Tomato based pizza sauce ','Ingredients 

- 28 oz (795g) of crushed tomatoes 
- 1 Tbs olive oil
- 1 Tbs butter 
- 2 garlic cloves crushed 
- 1 tsp dried oregano 
- pinch of red pepper flakes and kosher salt 
- basil
- 1 tsp sugar
- 1 Tbs balsamic vinegar

Method 
 
1) Cook oil, butter, garlic, salt, oregano and pepper flakes for about 3 minutes

2) add tomatoes, basil, sugar and balsamic vinegar and mix well

3) cook over low heat for about 1 hour','ra1:7',to_timestamp(1671049470));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Moroccan salmon',CONCAT('r', currval('recipe_slug')),'Moroccan salmon with veggies','Ingredients 

- 4-5 pieces of fresh salmon
- 1 red pepper, sliced into thick chunks
- 1 potato, peeled and sliced 
- 1 carrot, sliced 
- 3-4 hot chillies 
- 5-6 peeled garlic cloves 
- 1 can of garbanzo beans
- fresh cilantro 
- 1/2 cup oil
- 5 Tbs hot paprika in oil 
- cumin
- cayenne pepper 
- chicken consommé 


Method 

1) in a large saucepan, put a small amount of oil and add the potato, red pepper, garbanzo bens, carrot, garlic cloves and hot chillies 

2) sprinkle some cayenne pepper and cumin and cover with a small amount of water, until veggies are covered. Cover the pot and let cook until potatoes are soft 

3) In a seperate bowl add the oil, paprika 1/2 teaspoon of cumin and sprinkle of chicken consommé, stir well it should look like a thick rub, add more paprika if required. 

4) dip the fish in paprika oil blend until we’ll covered on all sides and place in saucepan on top of veggies 

5) pour any remaining oil on top of the veggies and fish, add the fresh cilantro and cook covered on a low flame for about 15 -20 minutes until fish is cooked ','ra1:7',to_timestamp(1671496882));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Hot Honey Sauce ',CONCAT('r', currval('recipe_slug')),'Sweet and spicy sauce ','Ingredients 

- 1/2 cup of Hot Sauce 
- 1/2 cup of Vegan Butter 
- 1/2 cup of Honey 

Method:

1) add hot sauce, butter and honey into a saucepan and stir well 

2) cook on a low flame until well combined. 
','ra1:7',to_timestamp(1671496933));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Perfect pancakes ',CONCAT('r', currval('recipe_slug')),' ','Ingredients 

- 2 cups flour 
- 4 tsp baking powder 
- 1/4 cup white sugar
- pinch of salt
- 1 egg
-1 and 3/4 cup milk ( or milk alternative (soy/almond/oat etc.)
- 1 tablespoon vanilla extract 

Method 

1) Mix flour, baking powder sugar and salt in a bowl until we’ll combined 

2) add in egg, milk and vanilla extract and mix well until runny 

3) heat a fry pan and pour about 1/4 cup per pancake 

Serve with your favourite toppings 🥞


Suggested toppings 
- whipped cream
- blueberries 
- strawberries 
- maple syrup 
','ra1:7',to_timestamp(1672522794));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Dani''s Award-Winning "Impress-Your-Friends" Chocolate Chip Cookies',CONCAT('r', currval('recipe_slug')),'Classic chocolate chip cookies','For 12 BIG cookies

½ cup granulated sugar
¾ cup brown sugar, packed
1 teaspoon salt
½ cup unsalted butter, melted
1 egg
1 teaspoon vanilla extract
1 ¼ cups all-purpose flour
½ teaspoon baking soda
5-8 oz chocolate chips or chunks, according to preference

1. In a large bowl, whisk together the sugars, salt, and butter until a paste forms with no lumps.
Whisk in the egg and vanilla

2. Sift in the flour and baking soda, then fold the mixture with a spatula, just until everything is combined and there''s no unmixed flour left.

3. Fold in the chocolate chunks, then chill the dough for at least 30 minutes. For a more intense toffee-like flavor and deeper color, chill the dough overnight. The longer the dough rests, the more complex its flavor will be.

4. Preheat oven to 350°F (180°C). Line a baking sheet with parchment paper.

5. Scoop the dough with an ice-cream scoop onto a parchment paper-lined baking sheet, leaving at least 4 inches (10 cm) of space between cookies and 2 inches (5 cm) of space from the edges of the pan so that the cookies can spread evenly.

6. Bake for 12-15 minutes, or until the edges have started to barely brown.

Cool completely before serving.
Enjoy!','ra1:7',to_timestamp(1673747247));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Pumpkin soup ',CONCAT('r', currval('recipe_slug')),'Parve or meat pumpkin soup','Ingredients 

2 tbsp olive oil
1 onion, finely chopped
1 leek, white part only, finely sliced
1 garlic clove, crushed
1/2 tsp ground coriander
1 tsp ground cumin
1/2 tsp freshly grated nutmeg
1kg peeled pumpkin, diced
1 large potato, peeled, diced
1L of chicken stock 

Method 

1) Heat oil in a large saucepan over low heat, add onion and leek and cook for 2-3 minutes, until softened but not coloured. 

2) Add garlic and spices and cook, stirring, for 30 seconds. 

3)Add pumpkin, potato and stock and bring to the boil. Turn heat to low, cover and simmer for 30 minutes.

4) Allow to cool slightly, then blend in batches.','ra1:7',to_timestamp(1673828895));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Mongolian Beef ',CONCAT('r', currval('recipe_slug')),' ','Ingredients 

- 300g flank steak, thinly sliced (or beef strips) 
- 1/4 cup cornstarch
- 4 stalks of green onion (green parts only) 
- 1/4 cup beef stock 
- 1/4 cup light soy sauce 
- 1/3 cup brown sugar
- 2 tsp minced ginger
- 4 cloves of minced garlic 

Method 

1) slice the steak into thin strips and coat it with the cornstarch and set aside 
2) in a bowl combine the beef stock, soy sauce, brown sugar garlic and ginger and set aside 
3) Fry the beef in a pan for about 4 minutes until golden brown, remove the beef from pan
4) in the same pan add your premixed sauce, add 1 Tbsp of corn starch and 1/4 cup of water to thicken (mixed separately before adding to sauce)
5) add the beef to the sauce and stir well until evenly coated 
6) add in the green onions and cook for another 1-2 minutes 
7) serve on top of rice with some sprinkled sesame seeds (optional)','ra1:7',to_timestamp(1675332000));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Strawberry cream roll cake ',CONCAT('r', currval('recipe_slug')),' ','Ingredients 
4 eggs, whip till creamy
1/2 cup sugar 
3/4 cup oil 
3/4 cup flour 
1 packet baking powder (1 tbsp)
1 packet vanilla sugar  (1 tbsp)

1 container parve whipping cream
2 Tbsp vanilla pudding 


Method 

1) in a mixer whip the eggs and sugar until creamy 

2) add the oil and mix on medium speed 

3) in a seperate bowl mix the flour, baking powder and vanilla sugar, reduce mixer spread and gradually add to mixture 

4) mix until smooth 

5) pour into a flat tray lined with parchment paper and bake at bake at 160 c / 320 F until toothpick comes out clean (around 20 mins or so)

6)Once fully baked put another layer of parchment paper and a towel on top of the cake, roll and let cool in rolled position 

7) in the mean time make the cream, whip one container of whipping cream with vanilla pudding until cream has peaks and is stable (can turn bowl upside down with no spillage)

8) cut strawberries/berries 

9) once cake is cooled unroll into flat position, layer with cream and berries and reroll the cake, put more cream and berries on top and keep in fridge until serving ','ra1:7',to_timestamp(1675988088));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Chicken and olives ',CONCAT('r', currval('recipe_slug')),' ','Ingredients 
1-2 cans of olives
3 cups water
2 big Tbs paprika
1 Tbsp cumin
1 Tbsp soup mix
2 tsp black pepper
1/2 cup olive oil 
Chicken pieces  (Iegs or thighs)
1 bulb of coarsely chopped garlic
Chopped cilantro / parsley
2 slices lemon:

(1) sock olives in water overnight
(2) Rinse and boil slowly for 1-2 hours in morning
(3) in a seperate pot boil the water, paprika, cumin, soup mix back pepper and olive oil and garlic
(4) once bailed add chicken so that the water almost covers it and 1/4 cover the pot with lid
(5) add dives, cilantro /parsley and 2 slices of lemon and cook until water reduces.
','ra1:7',to_timestamp(1677628142));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Egg Drop Soup',CONCAT('r', currval('recipe_slug')),'Easy to make egg drop soup','Ingredients:
- 1L Chicken Broth
- 4 Eggs
- 1 tsp salt
- 1/2 tsp white pepper
- 3 tbsp corn starch
- 1 tsp msg
- 1 can of corn (optional)

Method:
1) Bring chicken broth to a boil
2) Take out some chicken soup mix into a small bowl with the corn starch until fully disolved
3) Pour corn starch mixture into boiling chicken soup
4) Add salt, peper, msg and corn into boiling both
5) Beat eggs in separate bowl
6) Slowly pour egg mixture into soup while stirring.
7). Turn off heat, let cool and enjoy!','ra1:7',to_timestamp(1679196825));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Sushi rice ',CONCAT('r', currval('recipe_slug')),'For sushi or poke bowls ','Ingredients 
2 cups medium grain rice 
3 cups of water 
1/4 cup rice vinegar 
4 tsp sugar 
1 tsp salt

Method
1) boil the water with a dash of oil and salt on high
2) add the rice, cover pot and simmer for about 20 minutes until rice is soft
3) in a separate part, heat, the vinegar, sugar and salt and stir well until the salt and sugar has dissolved completely in the vinegar
4) once the rice is cooked, move to a separate bowl. Mix in the vinegar solution well and let cool.','ra1:7',to_timestamp(1680038541));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Couscous ',CONCAT('r', currval('recipe_slug')),'Fine, easy to make ','Ingredients 
3 cups fine semolina 
1/2 Tbsp salt
1/2 Tbsp chicken stock
1/2 cup oil 
3 cups of water 

Method 
1) mix the semolina with the salt and chicken consommé and mix add in the oil and mix until combined wel
2) put semolina into a steamer pot and poke holes in the semolina and cover and steam for 20 minutes
3) remove couscous into a bowl. Add one cup of water and mix well, then put back into steamer and repeat step 2 for another 20 mins 
4) repeat step 3 (total of 60 mins steaming)
5)  remove couscous into a bowl. Add one cup of water and mix well, let cool and enjoy (total 3 cups water)

','ra1:7',to_timestamp(1680213876));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Matzaballs',CONCAT('r', currval('recipe_slug')),'KLP','Ingredients 
- 1 cup matza meal (coarse)
- 4 large eggs
- 1/4 cup of oil or margarine
- 1/4 cup water 
- salt and pepper to taste 

Method 
1) beat the eggs at the water, oil salt and pepper and mix well
2) add the matza meal and stir throughly and refrigerate for 30 minutes to an hour
3) make the balls and drop them into a pot of boiling water, when all the balls are in the pot reduce heat to low and simmer for about 30 mins ','ra1:7',to_timestamp(1681027521));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Sponge Cake',CONCAT('r', currval('recipe_slug')),'Kosher for Pesach Sponge Cake','Ingredients:
6 eggs separated
Juice from 1/2 Lemon
1 Cup sugar
1/4 c potato starch
1/2 c cake meal 

Method:
- Beat egg whites until partially stiff, gradually adding sugar as you beat
- Sift potato starch and cake meal together onto a plate or bowl
- Beat egg yolks with lemon juice
- Fold egg yolks into whites until incorporated
- Gently fold potato starch and cake meal into eggs
- Bake in an ungreased tube pan at 325 degrees F for 1 hour.
- Invert pan and wait until cool.','ra1:7',to_timestamp(1681632599));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Ceaser dressing ',CONCAT('r', currval('recipe_slug')),' ','Ingredients 
3 Tbsp mayonnaise 
1 tsp Worcestershire sauce 
1 tsp Dijon mustard 
1-2 garlic cloves 
1/2 lemon squeezed (little less)
Salt and pepper to taste ','ra1:7',to_timestamp(1689212264));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Stuffed Pargiyot (sweet)',CONCAT('r', currval('recipe_slug')),' ','Ingredients 

8-10 boneless chicken thighs 

Stuffing 
1 cup of jasmine rice 
100g of ground beef 
Cilantro 
Parsley 
Oil
Salt, pepper & chicken consommé 

Sauce 
4 large onions sliced 
4tbsp silan
1.5 tbsp soy sauce 
1.5 cup water ','ra1:7',to_timestamp(1694752446));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Apple Cake',CONCAT('r', currval('recipe_slug')),'Cake with apples','yields 2 loaf pans of cake or 1 bundt pan
Baking temp. 375 (preheat your oven)

Combine and set aside:
3 c of sliced apples
5 tbs white sugar
5 tsp cinnamon

sift into same bowl:
3 c flour
3 tsp baking powder
1.75 c white sugar
1.5 tsp salt

whisk together until uniform:
1 c vegetable oil
4 eggs
0.25 c orange juice
1.5 tbs vanilla

Mix the wet and the dry ingredients together until no lumps remain.
Drain the apples or make sure not grab much of the liquid resting at the bottom of the apple mixture.
Layer the apples and batter using 1/6 of the batter for each layer in each loaf pan (or 1/3 if only using one pan).
Make sure the apples don''t touch the walls of the pan or poke through the top layer of batter.
The layers will look like this -> batter
                                                 apples
                                                 batter
                                                 apples
                                                 batter
Bake for 1.25 hours 
Cover the top of the pans if the cakes brown too quickly','ra1:7',to_timestamp(1697910923));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Crunchy Cornbread',CONCAT('r', currval('recipe_slug')),'One loaf pan or muffin tin of tasty yellow cornbread','Ingredients:
1/2 cup medium-coarse corn meal
1-1/2 cup all-purpose flour
1/4 cup of sugar
4 teaspoon baking power
1/2 teaspoon salt
4 tablespoon unsalted butter, margarine, shortening or oil
1 egg, beaten
3/4 cup of milk or water

Heat oven to 375
Grease a loaf pan or muffin tin
Coat greased pan/tin with corn meal and tap out any excess
Mix the dry ingredients
Cut in the butter until the mixture resembles coarse meal
Add liquid and mix until incorporated
Pour into pan and bake for about 35 minutes (the centers should feel firm and spring back)
','ra1:7',to_timestamp(1700759425));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Roasted Red Pepper Soup',CONCAT('r', currval('recipe_slug')),'','Ingredients:

    4 large red bell peppers
    1 large onion, chopped
    2 cloves garlic, minced
    3 cups vegetable broth
    2 tablespoons olive oil
    Salt and pepper to taste

Instructions:

    Roast the Red Peppers:
        Preheat your oven to 450°F (230°C).
        Cut the red bell peppers in half and remove the seeds and membranes.
        Place the peppers cut side down on a baking sheet lined with aluminum foil.
        Roast in the preheated oven for about 20-25 minutes, until the skins are blistered and charred.
        Remove from the oven and place the peppers in a bowl. Cover with plastic wrap and let them steam for about 10 minutes.
        Once cooled, peel off the skins and set the roasted peppers aside.

    Prepare the Soup Base:
        In a large pot, heat the olive oil over medium heat.
        Add the chopped onion and cook until it becomes translucent, about 5 minutes.
        Add the minced garlic and cook for another minute, until fragrant.

    Combine and Simmer:
        Add the roasted red peppers to the pot, followed by the vegetable broth.
        Bring the mixture to a boil, then reduce the heat and let it simmer for about 15 minutes.

    Blend the Soup:
        Use an immersion blender to puree the soup until smooth. Alternatively, you can transfer the soup to a blender in batches and blend until smooth.

    Season and Serve:
        Season the soup with salt and pepper to taste.
        Ladle the soup into bowls and serve hot.

Enjoy your simple and delicious roasted red pepper soup!','ra1:7',to_timestamp(1720483661));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Oat Chocolate chip cookies ',CONCAT('r', currval('recipe_slug')),'Margarine free ','1/2 cup Brown Sugar
1/2 cup white sugar
1/2 cup oil
1 Tbsp vanilla sugar 
1 egg 
sprinkle of cinnamon 
1 cup of flour 
1 cup of rolled oats 
1/4 cup chocolate chips

Bake for 20 mins @ 180 C (until edges are brown and cookies are stable) ','ra1:7',to_timestamp(1723726493));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Arayes ',CONCAT('r', currval('recipe_slug')),'','4 Pita bread cut in half 
1.5-2lbs of ground beef/lamb (1kg)
1 large onion chpped and sauteed until slightly brown 
1 egg
1 small potato finely grated 
1/3 cup panko/bread crumbs 
2/3 cup water
1/2 cup chopped cilantro
1/2 cup chopped parsley
1 Tbsp olive oil 

Spice mix 
1/2 tsp black pepper 
1 tsp salt
1 tsp cumon 
1 tsp corander
1 tsp Paprika 
1/2 tsp Tumeric 
1/2 tsp Ras El Hanout','ra1:7',to_timestamp(1723728065));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Potsticker filling',CONCAT('r', currval('recipe_slug')),'Makes about 90 potstickers','Makes 4lb of filling / roughly 90 potstickers

2lb/1kg ground meat
2 bulbs of garlic
250g shredded carrot
500g shredded cabbage
500g shredded mushrooms

3g ginger powder / 10g fresh ginger paste
8g white pepper
8g msg
10g onion powder
3g allspice
2g cayenne
11g salt

Use a food processor or food grater to shred the ingredients. 
Mix all the ingredients together and knead until they’re uniform and will stick together when pressed into a small ball.','ra1:7',to_timestamp(1731379413));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Honey Roasted carrots ',CONCAT('r', currval('recipe_slug')),'','Ingredients 

- 8-10 large carrots (can use baby - carrots instead)
- 3 Tbsp olive oil
- 1/4 cup honey or maple syrup 
Salt & Pepper to taste 


Method 
1) preheat oven to 175C (350F)
2) line the carrots on a baking sheet, drizzle with olive oil, salt & pepper 
3) pour honey or maple syrup on top
4) cook for about 30-60mins depending how soft you like carrots ','ra1:7',to_timestamp(1731986763));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Bertucci''s Inspired Bread Rolls Recipe',CONCAT('r', currval('recipe_slug')),'','Ingredients:

4 cups all-purpose flour
1 tablespoon sugar
1 tablespoon salt
1 packet (2¼ teaspoons) active dry yeast
1¾ cups warm water (about 110°F or 43°C)
2 tablespoons olive oil (plus more for brushing)
1 tablespoon Italian seasoning (optional)
1 tablespoon grated Parmesan cheese (optional)
Instructions:

Activate the Yeast:
- In a small bowl, combine warm water and sugar. Sprinkle the yeast on top and let it sit for about 5-10 minutes until it becomes frothy.
Mix Dry Ingredients:
- In a large mixing bowl, whisk together the flour and salt.
Combine Ingredients:
- Once the yeast is frothy, add it to the flour mixture along with olive oil. Mix until a dough forms.
Knead the Dough:
- Transfer the dough to a floured surface and knead for about 8-10 minutes until smooth and elastic. If the dough is too sticky, add a little more flour as needed.
First Rise:
- Place the dough in a greased bowl, cover it with a damp cloth or plastic wrap, and let it rise in a warm place for about 1-2 hours, or until it has doubled in size.
Shape the Rolls:
- Punch down the risen dough and divide it into 12 equal pieces. Shape each piece into a ball and place them on a greased baking sheet or in a baking dish.
Second Rise:
- Cover the shaped rolls with a cloth and let them rise again for about 30-45 minutes until they puff up.
Preheat Oven:
- Preheat your oven to 375°F (190°C).
Bake:
- Bake the rolls for 20-25 minutes or until golden brown. If desired, brush them with olive oil and sprinkle with Italian seasoning and Parmesan cheese right after removing from the oven.
Serve:
- Enjoy the rolls warm, ideally with olive oil for dipping.','ra1:7',to_timestamp(1732748014));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Crispy rice salad ',CONCAT('r', currval('recipe_slug')),'','Ingredients for crispy rice:
•2 cups of white raw rice cooked and cooled
• 1 heaping tbsp. chili paste
• 3 tosp. Oil
Ingredients for salad:
•4 Persian cucumbers
• 1/2 bunch fresh mint
• 1/2 bunch fresh cilantro
• about 5 scallions
• 1 cup shelled edamame
• 1 avocado
• 1/2 cup chopped peanuts
Ingredients for dressing:
• 1/4 cup soy sauce
•1/4 cup seasoned rice vinegar (it''s a bit sweeter)
•2 tosp. Oil
• 1 tbsp. brown sugar
•1/2 lime
• 1 garlic clove
Instructions:
1. Prepare the Crispy Rice:
* Preheat your oven to 400°F (200°C).
* Line a baking sheet with parchment paper.
* In a large bowl, combine the cooked white rice, chili paste, and vegetable oil. Mix well.
* Spread the rice mixture evenly on the prepared baking sheet.
* Bake for about 40 minutes, tossing the rice every 10 minutes to ensure even baking. Watch closely to avoid burning.
* Once crispy and golden, remove from the oven and let cool. This can be done ahead of time.
2. Prepare the Vegetables:
* Chop all your vegetables and place them in a large bowl.
* Add the edamame and diced avocado to the bowl.
3. Make the Dressing:
* In a small bowl, combine the ingredients.
* Whisk together until well mixed.
4. Assemble the Salad:
* Add the chopped roasted peanuts and the cooled crispy rice to the bowl with the vegetables.
* Pour the dressing over the salad and toss to combine.
* Serve immediately and enjoy!
','ra1:7',to_timestamp(1733039342));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Sugar cookies ',CONCAT('r', currval('recipe_slug')),'','Ingredients:
2/3 cup sugar
1/2 cup oil
2 eggs
1 teaspoon vanilla extract
2 1/2 cups flour
2 teaspoons baking powder
Directions:
1. ﻿﻿﻿In a large mixing bowl combine sugar, oil, eggs and vanilla extract.
2. ﻿﻿﻿Add flour and baking powder.
3. ﻿﻿﻿Slowly combine together. The dough might be crumbly, use your hands to smooth it out and combine it.
4. ﻿﻿﻿Roll dough out on floured surface and cut cookies out using desired cookie cutter shapes.
5. ﻿﻿﻿Place on a parchment lined baking sheet and bake on
350'' for about 10 to 12 minutes depending on size of cookies.','ra1:7',to_timestamp(1747537937));
SELECT nextval('recipe_slug') as v;
INSERT INTO slugs VALUES(CONCAT('r', currval('recipe_slug')));
INSERT INTO recipes (title, slug, description, recipe, author_id, created_at) VALUES('Roasted cabbage salad ',CONCAT('r', currval('recipe_slug')),'','Recipe:
Ingredients-
1 green cabbage, cut to thin slices
1 sweet onion, cut to thin slices
1 teaspoon of salt
1/4 teaspoon of ground black pepper
5 tablespoons of olive oil
Avocado dressing ingredients-
2 garlic cloves
1/4 jalapeño without the seeds (optional)
Handful of cilantro
1/2 avocado
Juice from 1 lemon
1 teaspoon of za''atar
1 teaspoon of salt
1/2 teaspoon of ground black pepper
4 tablespoons of olive oil
1/4 cup of water
Put all the ingredients in a small food processor and process to a smooth dressing.','ra1:7',to_timestamp(1747725302));