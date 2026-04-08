-- Lulu — Template Library
-- 28 templates across 4 daily groups.
-- Refined for neurodivergent children aged 3–10.
-- Steps are granular, timers are realistic, help text is warm and clear.
-- All templates are system-owned (owner_id = 00...00) and never modified by parents.
-- Parents fork a copy — the original is read-only.

DO $$
BEGIN
  -- Clear existing templates cleanly before re-seeding
  DELETE FROM public.steps   WHERE sequence_id IN (SELECT id FROM public.sequences WHERE is_template = TRUE);
  DELETE FROM public.sequences WHERE is_template = TRUE;

  -- ================================================================
  -- 🌅  MORNING ROUTINE
  -- ================================================================

  -- 1. Wake Up & Get Up
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000001','00000000-0000-0000-0000-000000000000',
    'Wake Up & Get Up','routine','morning',TRUE,TRUE,'celebrate','Great start to the day!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Open your eyes',   'standard','start',      20, 'Good morning. Open your eyes slowly and look around the room.'),
    ((SELECT id FROM s),2,'Stretch',           'standard','pacing',     20, 'Stretch your arms up high. Stretch your legs long. Wake up your whole body.'),
    ((SELECT id FROM s),3,'Sit up',            'standard','transition', 15, 'Sit up slowly. Take your time. There is no rush.'),
    ((SELECT id FROM s),4,'Feet on the floor', 'standard','transition', 15, 'Swing your legs to the side and put your feet on the floor.'),
    ((SELECT id FROM s),5,'Stand up',          'standard','celebration',15, 'Push up with your hands and stand up. You are up — well done!');

  -- 2. Go to the Toilet
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000002','00000000-0000-0000-0000-000000000000',
    'Go to the Toilet','routine','morning',TRUE,TRUE,'celebrate','All done — well done!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Walk to the bathroom','standard','start',      30,  'Walk to the bathroom. Take your time.'),
    ((SELECT id FROM s),2,'Use the toilet',       'standard','pacing',     120, 'Sit on the toilet. Take your time. There is no rush.'),
    ((SELECT id FROM s),3,'Wipe carefully',       'standard','transition', 30,  'Wipe carefully. Ask a grown-up if you need help.'),
    ((SELECT id FROM s),4,'Flush',                'standard','transition', 10,  'Flush the toilet.'),
    ((SELECT id FROM s),5,'Wash hands',           'standard','pacing',     30,  'Wash your hands with soap. Rub all over. Count to 20.'),
    ((SELECT id FROM s),6,'Dry hands',            'standard','celebration',15,  'Dry your hands on the towel. All clean!');

  -- 3. Make the Bed
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000003','00000000-0000-0000-0000-000000000000',
    'Make the Bed','routine','morning',TRUE,TRUE,'celebrate','Your bed looks wonderful!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Pull up the sheet',       'standard','start',      30, 'Pull the sheet up over the mattress.'),
    ((SELECT id FROM s),2,'Straighten the duvet',    'standard','pacing',     45, 'Pull the duvet up and make it flat and even.'),
    ((SELECT id FROM s),3,'Fluff your pillow',       'standard','transition', 20, 'Give your pillow a little shake and put it at the top.'),
    ((SELECT id FROM s),4,'Step back and look',      'standard','celebration',10, 'Step back and look. Your bed is made. That is brilliant.');

  -- 4. Take a Shower or Wash
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000004','00000000-0000-0000-0000-000000000000',
    'Take a Shower or Wash','routine','morning',TRUE,TRUE,'celebrate','Clean and fresh — amazing!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Get undressed',       'standard','start',      90,  'Take off your clothes and put them in the laundry basket.'),
    ((SELECT id FROM s),2,'Check the water',     'standard','transition', 20,  'Turn on the water and wait for it to feel warm on your hand. Not too hot.'),
    ((SELECT id FROM s),3,'Get in',              'standard','transition', 15,  'Step in carefully. Hold on if you need to.'),
    ((SELECT id FROM s),4,'Wash your face',      'standard','pacing',     30,  'Use a little soap or water to wash your face gently.'),
    ((SELECT id FROM s),5,'Wash your body',      'standard','pacing',     90,  'Use soap or shower gel and wash all over your body.'),
    ((SELECT id FROM s),6,'Wash your hair',      'standard','pacing',     60,  'Put shampoo on your hair and scrub gently. Close your eyes tight!'),
    ((SELECT id FROM s),7,'Rinse everything',    'standard','pacing',     45,  'Stand under the water and rinse all the soap off. Turn around slowly.'),
    ((SELECT id FROM s),8,'Turn off and get out','standard','transition', 20,  'Turn off the water. Step out carefully and stand on the mat.'),
    ((SELECT id FROM s),9,'Dry yourself',        'standard','pacing',     60,  'Use your towel to dry yourself all over — arms, legs, tummy, hair.'),
    ((SELECT id FROM s),10,'Ready for clothes',  'standard','celebration',NULL,'You are clean and dry. Time to get dressed!');

  -- 5. Get Dressed
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000005','00000000-0000-0000-0000-000000000000',
    'Get Dressed','routine','morning',TRUE,TRUE,'celebrate','You got dressed all by yourself!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Underwear',       'standard','start',      60,  'Put on your underwear first.'),
    ((SELECT id FROM s),2,'Socks',           'standard','transition', 60,  'Put on your socks. Match the pairs.'),
    ((SELECT id FROM s),3,'Trousers or skirt','standard','pacing',    90,  'Put on your trousers or skirt. One leg at a time.'),
    ((SELECT id FROM s),4,'Top or shirt',    'standard','pacing',     90,  'Put on your top. Head first, then arms.'),
    ((SELECT id FROM s),5,'Check yourself',  'standard','celebration',15,  'Look down — is everything on the right way? You are dressed!');

  -- 6. Make Breakfast
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000006','00000000-0000-0000-0000-000000000000',
    'Make Breakfast','routine','morning',TRUE,TRUE,'celebrate','You made your own breakfast!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Choose your breakfast', 'standard','start',      30,  'What are you having for breakfast? Choose one thing.'),
    ((SELECT id FROM s),2,'Get your bowl or plate','standard','transition', 20,  'Get a bowl or plate from the cupboard.'),
    ((SELECT id FROM s),3,'Get your food',          'standard','transition', 45,  'Get your cereal, bread, or fruit and put it in your bowl.'),
    ((SELECT id FROM s),4,'Pour your drink',        'standard','pacing',     30,  'Pour your drink carefully. Take it slowly.'),
    ((SELECT id FROM s),5,'Carry it to the table',  'standard','transition', 30,  'Carry your breakfast to the table carefully. Two hands if you need them.'),
    ((SELECT id FROM s),6,'Ready to eat!',          'standard','celebration',NULL,'Breakfast is ready. You made that yourself — brilliant!');

  -- 7. Eat Breakfast
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000007','00000000-0000-0000-0000-000000000000',
    'Eat Breakfast','routine','morning',TRUE,TRUE,'celebrate','Breakfast done — energy for the day!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Sit down at the table', 'standard','start',      15,  'Sit down in your chair.'),
    ((SELECT id FROM s),2,'Eat your breakfast',    'standard','pacing',     600, 'Eat your breakfast. Take small bites and chew slowly.'),
    ((SELECT id FROM s),3,'Drink your drink',      'standard','pacing',     60,  'Have a drink. Hold your cup with two hands if it helps.'),
    ((SELECT id FROM s),4,'All finished',          'standard','transition', NULL,'When you are done, wait at the table until a grown-up says it is time.'),
    ((SELECT id FROM s),5,'Clear your place',      'standard','celebration',30,  'Take your bowl or plate to the sink or dishwasher. Well done!');

  -- 8. Clean & Tidy Kitchen
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000008','00000000-0000-0000-0000-000000000000',
    'Clean & Tidy Kitchen','routine','morning',TRUE,TRUE,'celebrate','Kitchen is clean — thank you!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Clear the table',     'standard','start',      60,  'Put all the dishes and cups in the sink or dishwasher.'),
    ((SELECT id FROM s),2,'Wipe the table',      'standard','pacing',     45,  'Use a cloth or sponge to wipe the table clean.'),
    ((SELECT id FROM s),3,'Put food away',       'standard','transition', 45,  'Put any open food back in the cupboard or fridge.'),
    ((SELECT id FROM s),4,'Rinse the cloth',     'standard','transition', 20,  'Rinse the cloth in the sink and hang it up.'),
    ((SELECT id FROM s),5,'Push in the chairs',  'standard','celebration',15,  'Push all the chairs back in. Kitchen is tidy!');

  -- 9. Brush Teeth (Morning)
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000009','00000000-0000-0000-0000-000000000000',
    'Brush Teeth — Morning','routine','morning',TRUE,TRUE,'celebrate','Sparkling clean teeth!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Get your toothbrush',  'standard','start',      15,  'Get your toothbrush.'),
    ((SELECT id FROM s),2,'Put on toothpaste',    'standard','transition', 15,  'Put a small amount of toothpaste on the brush — about the size of a pea.'),
    ((SELECT id FROM s),3,'Brush all your teeth', 'standard','pacing',     120, 'Brush in small circles — outside, inside, tops. Keep going until the time is up!'),
    ((SELECT id FROM s),4,'Spit',                 'standard','transition', 10,  'Spit the toothpaste into the sink.'),
    ((SELECT id FROM s),5,'Rinse your mouth',     'standard','transition', 15,  'Take a small sip of water, swish it around and spit it out.'),
    ((SELECT id FROM s),6,'Rinse your toothbrush','standard','celebration',10,  'Rinse your toothbrush under the tap and put it back. Done!');

  -- 10. Leaving the House
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000010','00000000-0000-0000-0000-000000000000',
    'Leaving the House','routine','morning',TRUE,TRUE,'celebrate','Ready — let''s go!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Check your bag',       'standard','start',      45,  'Is everything in your bag? Books, lunch, water bottle?'),
    ((SELECT id FROM s),2,'Shoes on',             'standard','transition', 60,  'Put on your shoes. Fasten them properly.'),
    ((SELECT id FROM s),3,'Coat on',              'standard','transition', 30,  'Put on your coat.'),
    ((SELECT id FROM s),4,'Pick up your bag',     'standard','transition', 15,  'Pick up your bag and put it on your back.'),
    ((SELECT id FROM s),5,'Say goodbye',          'standard','transition', 30,  'Say goodbye to everyone at home.'),
    ((SELECT id FROM s),6,'Out the door',         'standard','celebration',NULL,'Out we go. Have a great day!');

  -- 11. Get in the Car
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000011','00000000-0000-0000-0000-000000000000',
    'Get in the Car','routine','morning',TRUE,TRUE,'celebrate','Buckled up and ready!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Walk to the car',       'standard','start',      30,  'Walk to the car. Stay close to the grown-up.'),
    ((SELECT id FROM s),2,'Open your door',        'standard','transition', 15,  'Open your door carefully.'),
    ((SELECT id FROM s),3,'Get in and sit down',   'standard','transition', 20,  'Get in and sit down in your seat.'),
    ((SELECT id FROM s),4,'Seatbelt on',           'standard','pacing',     30,  'Pull the seatbelt across and click it in. Listen for the click.'),
    ((SELECT id FROM s),5,'Bag on your lap or down','standard','transition', 15, 'Put your bag on your lap or on the floor.'),
    ((SELECT id FROM s),6,'Ready to go!',          'standard','celebration',NULL,'Seatbelt on. All ready. Let''s go!');

  -- 12. Get on the Bus
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000012','00000000-0000-0000-0000-000000000000',
    'Get on the Bus','routine','morning',TRUE,TRUE,'celebrate','On the bus — well done!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Wait safely at the stop','standard','calm',      NULL,'Stand back from the road. Wait behind the line or on the pavement.'),
    ((SELECT id FROM s),2,'Watch for your bus',     'standard','pacing',    NULL,'Look for your bus number. It will come soon.'),
    ((SELECT id FROM s),3,'Let people off first',   'standard','transition', 20, 'Wait at the side. Let everyone get off before you get on.'),
    ((SELECT id FROM s),4,'Get on carefully',       'standard','transition', 20, 'Step up onto the bus carefully. Hold the rail.'),
    ((SELECT id FROM s),5,'Find a seat',            'standard','transition', 30, 'Walk to a seat and sit down.'),
    ((SELECT id FROM s),6,'Hold on',                'standard','celebration',NULL,'Hold the armrest or rail. Ready to go!');

  -- 13. Get on the Bike or Scooter
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000013','00000000-0000-0000-0000-000000000000',
    'Get on the Bike or Scooter','routine','morning',TRUE,TRUE,'celebrate','Helmet on — safe and ready!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Get your helmet',        'standard','start',      20,  'Find your helmet.'),
    ((SELECT id FROM s),2,'Put your helmet on',     'standard','transition', 30,  'Place it on your head — flat, not tilted.'),
    ((SELECT id FROM s),3,'Fasten the strap',       'standard','pacing',     20,  'Click the chin strap and check it is snug. You should feel it but it should not hurt.'),
    ((SELECT id FROM s),4,'Get on',                 'standard','transition', 20,  'Hold the handles and get on carefully.'),
    ((SELECT id FROM s),5,'Check you are balanced', 'standard','transition', 15,  'Put both feet on the ground. Feel steady?'),
    ((SELECT id FROM s),6,'Off we go!',             'standard','celebration',NULL,'Helmet on and ready. Stay safe and have fun!');

  -- ================================================================
  -- 🎒  ACTIVITY TIME (School & Outdoor)
  -- ================================================================

  -- 14. Get Out of the Car
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000014','00000000-0000-0000-0000-000000000000',
    'Get Out of the Car','routine','activity',TRUE,TRUE,'celebrate','Out safely — well done!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Car has stopped — wait', 'standard','calm',       15,  'The car has stopped. Wait. Do not open the door until a grown-up says it is safe.'),
    ((SELECT id FROM s),2,'Undo your seatbelt',     'standard','transition', 15,  'Press the red button and lift the seatbelt off.'),
    ((SELECT id FROM s),3,'Collect your things',    'standard','transition', 30,  'Pick up your bag and anything else you brought.'),
    ((SELECT id FROM s),4,'Open the door carefully','standard','transition', 15,  'Look first. Open the door slowly and carefully.'),
    ((SELECT id FROM s),5,'Step out',               'standard','transition', 15,  'Step out onto the pavement.'),
    ((SELECT id FROM s),6,'Move away from the car', 'standard','calm',       15,  'Step away from the car and wait on the pavement. Do not go near the road.'),
    ((SELECT id FROM s),7,'All out safely!',        'standard','celebration',NULL,'Out of the car and safe. Great job!');

  -- 15. Get Off the Bus
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000015','00000000-0000-0000-0000-000000000000',
    'Get Off the Bus','routine','activity',TRUE,TRUE,'celebrate','Off the bus safely!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Press the stop button',  'standard','start',      NULL,'When you see your stop coming, press the button once.'),
    ((SELECT id FROM s),2,'Stay seated until stopped','standard','calm',     NULL,'Stay in your seat until the bus has fully stopped.'),
    ((SELECT id FROM s),3,'Collect your things',    'standard','transition', 20,  'Pick up your bag and anything you have with you.'),
    ((SELECT id FROM s),4,'Stand up and hold on',   'standard','transition', 15,  'Hold the seat or rail and stand up carefully.'),
    ((SELECT id FROM s),5,'Move to the door',       'standard','transition', 15,  'Walk carefully to the exit door.'),
    ((SELECT id FROM s),6,'Step off carefully',     'standard','transition', 15,  'Step down off the bus. Hold the rail if you need it.'),
    ((SELECT id FROM s),7,'Move away from the bus', 'standard','calm',       15,  'Step onto the pavement and move away from the bus. Wait there.'),
    ((SELECT id FROM s),8,'All off safely!',        'standard','celebration',NULL,'You got off the bus all by yourself. Well done!');

  -- 16. Get Off the Bike or Scooter
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000016','00000000-0000-0000-0000-000000000000',
    'Get Off the Bike or Scooter','routine','activity',TRUE,TRUE,'celebrate','Parked up safely!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Slow down and stop',     'standard','calm',       15,  'Slow down gently and come to a stop.'),
    ((SELECT id FROM s),2,'Foot on the ground',     'standard','transition', 10,  'Put one foot down flat on the ground.'),
    ((SELECT id FROM s),3,'Get off carefully',      'standard','transition', 15,  'Swing your other leg over and step off.'),
    ((SELECT id FROM s),4,'Park it safely',         'standard','transition', 20,  'Lean your bike or scooter against a wall or put it in a rack.'),
    ((SELECT id FROM s),5,'Take off your helmet',   'standard','transition', 20,  'Undo the strap and lift your helmet off.'),
    ((SELECT id FROM s),6,'Carry or store helmet',  'standard','celebration',NULL,'Put your helmet in your bag or somewhere safe. Well done!');

  -- 17. School Goodbye
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000017','00000000-0000-0000-0000-000000000000',
    'School Goodbye','story','activity',TRUE,TRUE,'celebrate','Have a great day!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'We have arrived at school',  'standard','start',      NULL,'We are here at school. You are doing well.'),
    ((SELECT id FROM s),2,'Hang up your bag',           'standard','transition', 45,  'Find your hook and hang up your bag.'),
    ((SELECT id FROM s),3,'Take out what you need',     'standard','transition', 30,  'Take out your water bottle or anything you need for class.'),
    ((SELECT id FROM s),4,'Time to say goodbye',        'standard','transition', 30,  'Give a hug, a high five, or a wave — whatever feels right.'),
    ((SELECT id FROM s),5,'Walk to your classroom',     'standard','transition', NULL,'Walk to your classroom. You know the way.'),
    ((SELECT id FROM s),6,'See you later!',             'standard','celebration',NULL,'Your grown-up will be back later. Have a wonderful day!');

  -- 18. School Pick Up
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000018','00000000-0000-0000-0000-000000000000',
    'School Pick Up','routine','activity',TRUE,TRUE,'celebrate','Found them — let''s go home!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Pack your bag',           'standard','start',      120, 'Put everything in your bag. Check your tray or drawer too.'),
    ((SELECT id FROM s),2,'Put on your coat',        'standard','transition', 30,  'Put your coat on.'),
    ((SELECT id FROM s),3,'Zip up or button up',     'standard','transition', 20,  'Zip or button your coat if it is cold.'),
    ((SELECT id FROM s),4,'Walk to the meeting spot','standard','transition', NULL,'Walk to where your grown-up meets you.'),
    ((SELECT id FROM s),5,'Wait safely',             'standard','calm',       NULL,'Stand still and wait. Stay where you can be seen. Your grown-up is coming.'),
    ((SELECT id FROM s),6,'There they are!',         'standard','celebration',NULL,'There is your grown-up! Give them a wave or a hug.');

  -- ================================================================
  -- 🌤  AFTERNOON TIME
  -- ================================================================

  -- 19. Coming Home
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000019','00000000-0000-0000-0000-000000000000',
    'Coming Home','routine','afternoon',TRUE,TRUE,'celebrate','Welcome home!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Come inside',           'standard','start',      NULL,'Come inside and close the door behind you.'),
    ((SELECT id FROM s),2,'Take off your shoes',   'standard','transition', 60,  'Take off your shoes and put them on the rack or by the door.'),
    ((SELECT id FROM s),3,'Hang up your bag',      'standard','transition', 20,  'Hang your bag on your hook.'),
    ((SELECT id FROM s),4,'Hang up your coat',     'standard','transition', 20,  'Hang up your coat too.'),
    ((SELECT id FROM s),5,'Wash your hands',       'standard','pacing',     30,  'Wash your hands — you have been out all day.'),
    ((SELECT id FROM s),6,'Snack time!',           'standard','celebration',NULL,'Go and have your snack. You worked hard today!');

  -- 20. Calm Down
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,return_to_today)
    VALUES('00000000-0000-0000-0000-000000000020','00000000-0000-0000-0000-000000000000',
    'Calm Down','calm','afternoon',TRUE,TRUE,'return_to_today',NULL) RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Find a calm spot',     'standard','calm', NULL,'Find somewhere quiet to sit or lie down. You are safe here.'),
    ((SELECT id FROM s),2,'Breathe in',           'standard','calm', 4,   'Breathe in slowly through your nose… in… in… in…'),
    ((SELECT id FROM s),3,'Hold',                 'standard','calm', 2,   'Hold… hold…'),
    ((SELECT id FROM s),4,'Breathe out',          'standard','calm', 6,   'Breathe out slowly through your mouth… out… out… out…'),
    ((SELECT id FROM s),5,'Breathe in again',     'standard','calm', 4,   'In… slowly… filling up…'),
    ((SELECT id FROM s),6,'Hold',                 'standard','calm', 2,   'Hold… hold…'),
    ((SELECT id FROM s),7,'Breathe out again',    'standard','calm', 6,   'Out… slowly… letting it all go…'),
    ((SELECT id FROM s),8,'One more time in',     'standard','calm', 4,   'One more time. In… slowly…'),
    ((SELECT id FROM s),9,'And out',              'standard','calm', 6,   'And out… all the way out…'),
    ((SELECT id FROM s),10,'How do you feel?',    'standard','calm', NULL,'Take your time. You are safe. When you are ready, press Done.');

  -- 21. Homework Time
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000021','00000000-0000-0000-0000-000000000000',
    'Homework Time','routine','afternoon',TRUE,TRUE,'celebrate','Homework done!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Get your homework out', 'standard','start',      45,  'Get your homework out of your bag.'),
    ((SELECT id FROM s),2,'Sit at the table',      'standard','transition', 20,  'Sit at the table with everything you need — pencil, ruler, rubber.'),
    ((SELECT id FROM s),3,'Read the first task',   'standard','transition', 30,  'Read or look at the first thing you need to do. Ask for help if you are not sure.'),
    ((SELECT id FROM s),4,'Do your homework',      'standard','pacing',     1200,'Work through your homework. Take breaks if you need them. You can do this.'),
    ((SELECT id FROM s),5,'Check your work',       'standard','transition', 60,  'Read through what you have done. Does it make sense?'),
    ((SELECT id FROM s),6,'Pack it away',          'standard','transition', 30,  'Put your homework back in your bag so it is ready for tomorrow.'),
    ((SELECT id FROM s),7,'All done!',             'standard','celebration',NULL,'Homework finished. That is a big deal — well done!');

  -- 22. Play Time
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000022','00000000-0000-0000-0000-000000000000',
    'Play Time','routine','afternoon',TRUE,TRUE,'celebrate','Wonderful playing today!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Choose what to play',   'standard','start',      60,   'What would you like to play with today? Choose one thing.'),
    ((SELECT id FROM s),2,'Get what you need',     'standard','transition', 60,   'Get everything you need for your play. Take your time.'),
    ((SELECT id FROM s),3,'Play!',                 'standard','pacing',     1800, 'Play time! Enjoy yourself.'),
    ((SELECT id FROM s),4,'Five more minutes',     'standard','transition', 300,  'Five more minutes of play, then we will start tidying up.'),
    ((SELECT id FROM s),5,'Tidy up',               'standard','calm',       300,  'Play time is ending. Let''s tidy up. One thing at a time.'),
    ((SELECT id FROM s),6,'Everything put away',   'standard','celebration',NULL, 'Everything is back where it belongs. Brilliant!');

  -- 23. TV & iPad Time
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000023','00000000-0000-0000-0000-000000000000',
    'TV & iPad Time','routine','afternoon',TRUE,TRUE,'celebrate','You turned it off yourself!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Choose what to watch',   'standard','start',      45,   'Pick one show or one game. Then we start the timer.'),
    ((SELECT id FROM s),2,'Sit comfortably',        'standard','transition', 20,   'Find a comfortable spot to sit. Screen should not be too close to your eyes.'),
    ((SELECT id FROM s),3,'Watch or play',          'standard','pacing',     1800, 'Enjoy your screen time.'),
    ((SELECT id FROM s),4,'Two more minutes',       'standard','transition', 120,  'Screen time is almost over. Two more minutes.'),
    ((SELECT id FROM s),5,'Pause or stop',          'standard','transition', 20,   'Pause or stop what you are watching or playing.'),
    ((SELECT id FROM s),6,'Turn the screen off',    'standard','calm',       20,   'Press the button and turn the screen off.'),
    ((SELECT id FROM s),7,'Put it down',            'standard','celebration',NULL, 'Put the remote or device down. You turned it off — that takes real effort. Well done!');

  -- ================================================================
  -- 🌙  EVENING TIME
  -- ================================================================

  -- 24. Dinner Time
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000024','00000000-0000-0000-0000-000000000000',
    'Dinner Time','routine','evening',TRUE,TRUE,'celebrate','Great eating today!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Wash your hands',        'standard','start',      30,  'Wash your hands before dinner.'),
    ((SELECT id FROM s),2,'Help set the table',     'standard','transition', 60,  'Help put plates, cups and cutlery on the table.'),
    ((SELECT id FROM s),3,'Sit down',               'standard','transition', 15,  'Sit in your seat at the table.'),
    ((SELECT id FROM s),4,'Eat your dinner',        'standard','pacing',     900, 'Eat your dinner. Take small bites. There is no rush.'),
    ((SELECT id FROM s),5,'Try a little of everything','standard','pacing',  NULL,'Try a small taste of each thing on your plate. Even one bite is good.'),
    ((SELECT id FROM s),6,'Finished eating',        'standard','transition', NULL,'When you are done, put your cutlery together and wait.'),
    ((SELECT id FROM s),7,'Clear your place',       'standard','celebration',30,  'Take your plate, cup and cutlery to the kitchen. Thank you!');

  -- 25. Parent-Child Bonding Time
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000025','00000000-0000-0000-0000-000000000000',
    'Parent-Child Bonding Time','routine','evening',TRUE,TRUE,'celebrate','What a lovely time together!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Choose together',       'standard','start',      90,   'Choose one thing to do together — reading, a game, drawing, or something else you both enjoy.'),
    ((SELECT id FROM s),2,'Get what you need',     'standard','transition', 60,   'Get everything ready. Settle down somewhere comfortable.'),
    ((SELECT id FROM s),3,'Time together',         'standard','pacing',     1200, 'This is your time together. Take turns. Listen to each other. Enjoy it.'),
    ((SELECT id FROM s),4,'Five more minutes',     'standard','transition', 300,  'Five more minutes of together time.'),
    ((SELECT id FROM s),5,'Tidy away together',    'standard','transition', 120,  'Tidy up together — one job each.'),
    ((SELECT id FROM s),6,'A hug',                 'standard','celebration',NULL, 'Give your grown-up a hug. That was a wonderful time.');

  -- 26. Bath Time
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000026','00000000-0000-0000-0000-000000000000',
    'Bath Time','routine','evening',TRUE,TRUE,'celebrate','Clean, fresh and cosy!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Get undressed',          'standard','start',      90,  'Take off your clothes and put them in the laundry basket.'),
    ((SELECT id FROM s),2,'Get into the bath',      'standard','transition', 20,  'Step into the bath carefully. Hold on if you need to.'),
    ((SELECT id FROM s),3,'Wash your body',         'standard','pacing',     180, 'Use the sponge or cloth and soap to wash all over your body.'),
    ((SELECT id FROM s),4,'Wash your hair',         'standard','pacing',     90,  'Wet your hair, add a little shampoo and scrub gently. Close your eyes tight!'),
    ((SELECT id FROM s),5,'Rinse',                  'standard','pacing',     60,  'Rinse all the soap and shampoo off.'),
    ((SELECT id FROM s),6,'Out of the bath',        'standard','transition', 20,  'Step out carefully. Hold on. Stand on the bath mat.'),
    ((SELECT id FROM s),7,'Dry yourself',           'standard','pacing',     60,  'Use your towel to dry your whole body. Wrap up warm.'),
    ((SELECT id FROM s),8,'Pyjamas on',             'standard','celebration',NULL,'Put on your pyjamas. Clean, fresh, and cosy!');

  -- 27. Brush Teeth — Evening
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000027','00000000-0000-0000-0000-000000000000',
    'Brush Teeth — Evening','routine','evening',TRUE,TRUE,'celebrate','Clean teeth — ready for sleep!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Get your toothbrush',   'standard','start',      15,  'Get your toothbrush.'),
    ((SELECT id FROM s),2,'Put on toothpaste',     'standard','transition', 15,  'Put a small amount of toothpaste on the brush — about the size of a pea.'),
    ((SELECT id FROM s),3,'Brush all your teeth',  'standard','pacing',     120, 'Brush in small circles — outside, inside, tops. Nice and thorough.'),
    ((SELECT id FROM s),4,'Spit',                  'standard','transition', 10,  'Spit the toothpaste into the sink. After evening brushing, try not to rinse — it helps protect your teeth overnight.'),
    ((SELECT id FROM s),5,'Rinse your toothbrush', 'standard','celebration',10,  'Rinse your toothbrush and put it back. Teeth are clean for the night!');

  -- 28. Bedtime Routine
  WITH s AS (INSERT INTO public.sequences (id,owner_id,title,type,template_group,is_template,is_published,completion_action,reward_text)
    VALUES('00000000-0000-0000-0000-000000000028','00000000-0000-0000-0000-000000000000',
    'Bedtime Routine','calm','evening',TRUE,TRUE,'celebrate','Sleep tight — well done today!') RETURNING id)
  INSERT INTO public.steps (sequence_id,order_index,title,step_type,cue_type,duration_seconds,help_text) VALUES
    ((SELECT id FROM s),1,'Tidy your space',       'standard','start',      180, 'Put away anything on the floor or bed. Your space feels calmer when it is tidy.'),
    ((SELECT id FROM s),2,'Get into bed',          'standard','transition', NULL,'Climb into bed and get comfortable. Pillow right, covers up.'),
    ((SELECT id FROM s),3,'Choose a story or song','standard','transition', NULL,'Would you like a story, a song, or some quiet time? Let your grown-up know.'),
    ((SELECT id FROM s),4,'Story or quiet time',   'standard','calm',       600, 'Lie still and listen. Let your body relax.'),
    ((SELECT id FROM s),5,'Lights getting low',    'standard','calm',       NULL,'The lights are going low. Your body knows it is time to rest.'),
    ((SELECT id FROM s),6,'Close your eyes',       'standard','calm',       NULL,'Close your eyes. Take a slow breath. You are safe. You are loved. Goodnight.');

END $$;
