-- Lulu — Default Template Sequences
-- These are system-owned templates available to all users.
-- When a parent selects a template, it is COPIED (forked) to their account.
-- Templates are never modified by parents — only their fork is.

-- System user UUID — a fixed placeholder for template ownership
-- In production, create a dedicated system service account with this UUID
DO $$
BEGIN
  -- Insert templates only if they don't already exist
  IF NOT EXISTS (SELECT 1 FROM public.sequences WHERE is_template = TRUE LIMIT 1) THEN

    -- ============================================================
    -- TEMPLATE 1: Morning Routine
    -- ============================================================
    WITH seq AS (
      INSERT INTO public.sequences (
        id, owner_id, title, type, is_template, is_published,
        completion_action, reward_text
      ) VALUES (
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000000',
        'Morning Routine', 'routine', TRUE, TRUE,
        'celebrate', 'Ready for the day!'
      ) RETURNING id
    )
    INSERT INTO public.steps (sequence_id, order_index, title, step_type, cue_type, duration_seconds, help_text) VALUES
      ((SELECT id FROM seq), 1, 'Wake up',          'standard', 'start',      30,  'Time to wake up! Stretch your arms.'),
      ((SELECT id FROM seq), 2, 'Go to toilet',     'standard', 'transition', 120, 'Go to the toilet. Take your time.'),
      ((SELECT id FROM seq), 3, 'Wash hands',       'standard', 'pacing',     30,  'Wash your hands with soap. Count to 20.'),
      ((SELECT id FROM seq), 4, 'Get dressed',      'standard', 'transition', 300, 'Put on your clothes. Your clothes are ready for you.'),
      ((SELECT id FROM seq), 5, 'Eat breakfast',    'standard', 'pacing',     600, 'Sit down and eat your breakfast.'),
      ((SELECT id FROM seq), 6, 'Brush teeth',      'standard', 'pacing',     120, 'Brush your teeth for two minutes.'),
      ((SELECT id FROM seq), 7, 'Shoes and bag',    'standard', 'transition', 60,  'Put on your shoes and get your bag.'),
      ((SELECT id FROM seq), 8, 'Ready!',           'standard', 'celebration',NULL,'You are ready! Great job.');

    -- ============================================================
    -- TEMPLATE 2: Getting Dressed
    -- ============================================================
    WITH seq AS (
      INSERT INTO public.sequences (
        id, owner_id, title, type, is_template, is_published, completion_action, reward_text
      ) VALUES (
        '00000000-0000-0000-0000-000000000002',
        '00000000-0000-0000-0000-000000000000',
        'Getting Dressed', 'routine', TRUE, TRUE,
        'celebrate', 'You got dressed all by yourself!'
      ) RETURNING id
    )
    INSERT INTO public.steps (sequence_id, order_index, title, step_type, cue_type, duration_seconds, help_text) VALUES
      ((SELECT id FROM seq), 1, 'Underwear',    'standard', 'start',      60,  'Put on your underwear first.'),
      ((SELECT id FROM seq), 2, 'Socks',        'standard', 'transition', 60,  'Put on your socks.'),
      ((SELECT id FROM seq), 3, 'Trousers',     'standard', 'pacing',     90,  'Put on your trousers or skirt.'),
      ((SELECT id FROM seq), 4, 'Top',          'standard', 'pacing',     90,  'Put on your top.'),
      ((SELECT id FROM seq), 5, 'All done!',    'standard', 'celebration',NULL,'You are dressed! Well done.');

    -- ============================================================
    -- TEMPLATE 3: Brushing Teeth
    -- ============================================================
    WITH seq AS (
      INSERT INTO public.sequences (
        id, owner_id, title, type, is_template, is_published, completion_action, reward_text
      ) VALUES (
        '00000000-0000-0000-0000-000000000003',
        '00000000-0000-0000-0000-000000000000',
        'Brushing Teeth', 'routine', TRUE, TRUE,
        'celebrate', 'Sparkling clean teeth!'
      ) RETURNING id
    )
    INSERT INTO public.steps (sequence_id, order_index, title, step_type, cue_type, duration_seconds, help_text) VALUES
      ((SELECT id FROM seq), 1, 'Get toothbrush', 'standard', 'start',       30,  'Get your toothbrush and toothpaste.'),
      ((SELECT id FROM seq), 2, 'Put toothpaste', 'standard', 'transition',  30,  'Put a little toothpaste on your brush.'),
      ((SELECT id FROM seq), 3, 'Brush!',         'standard', 'pacing',      120, 'Brush all your teeth. Keep going!'),
      ((SELECT id FROM seq), 4, 'Spit and rinse', 'standard', 'transition',  30,  'Spit out the toothpaste and rinse your mouth.'),
      ((SELECT id FROM seq), 5, 'Done!',          'standard', 'celebration', NULL,'Your teeth are so clean!');

    -- ============================================================
    -- TEMPLATE 4: Leaving the House
    -- ============================================================
    WITH seq AS (
      INSERT INTO public.sequences (
        id, owner_id, title, type, is_template, is_published, completion_action, reward_text
      ) VALUES (
        '00000000-0000-0000-0000-000000000004',
        '00000000-0000-0000-0000-000000000000',
        'Leaving the House', 'routine', TRUE, TRUE,
        'celebrate', 'Let''s go!'
      ) RETURNING id
    )
    INSERT INTO public.steps (sequence_id, order_index, title, step_type, cue_type, duration_seconds, help_text) VALUES
      ((SELECT id FROM seq), 1, 'Shoes on',     'standard', 'start',      90,  'Put on your shoes.'),
      ((SELECT id FROM seq), 2, 'Coat on',      'standard', 'transition', 60,  'Put on your coat.'),
      ((SELECT id FROM seq), 3, 'Get your bag', 'standard', 'transition', 30,  'Pick up your bag.'),
      ((SELECT id FROM seq), 4, 'Say goodbye',  'standard', 'transition', 30,  'Say goodbye to everyone at home.'),
      ((SELECT id FROM seq), 5, 'Out the door', 'standard', 'celebration',NULL,'Off we go!');

    -- ============================================================
    -- TEMPLATE 5: School Goodbye
    -- ============================================================
    WITH seq AS (
      INSERT INTO public.sequences (
        id, owner_id, title, type, is_template, is_published, completion_action, reward_text
      ) VALUES (
        '00000000-0000-0000-0000-000000000005',
        '00000000-0000-0000-0000-000000000000',
        'School Goodbye', 'story', TRUE, TRUE,
        'celebrate', 'See you after school!'
      ) RETURNING id
    )
    INSERT INTO public.steps (sequence_id, order_index, title, step_type, cue_type, duration_seconds, help_text) VALUES
      ((SELECT id FROM seq), 1, 'Arrive at school',    'standard', 'start',      NULL,'We are at school now.'),
      ((SELECT id FROM seq), 2, 'Hang up your bag',    'standard', 'transition', 60,  'Hang your bag on your hook.'),
      ((SELECT id FROM seq), 3, 'Say goodbye',         'standard', 'transition', 30,  'Give a hug or wave goodbye.'),
      ((SELECT id FROM seq), 4, 'Go to your class',    'standard', 'transition', NULL,'Walk to your classroom.'),
      ((SELECT id FROM seq), 5, 'See you later!',      'standard', 'celebration',NULL,'See you after school. Have a great day!');

    -- ============================================================
    -- TEMPLATE 6: Coming Home from School
    -- ============================================================
    WITH seq AS (
      INSERT INTO public.sequences (
        id, owner_id, title, type, is_template, is_published, completion_action, reward_text
      ) VALUES (
        '00000000-0000-0000-0000-000000000006',
        '00000000-0000-0000-0000-000000000000',
        'Coming Home from School', 'routine', TRUE, TRUE,
        'celebrate', 'Welcome home!'
      ) RETURNING id
    )
    INSERT INTO public.steps (sequence_id, order_index, title, step_type, cue_type, duration_seconds, help_text) VALUES
      ((SELECT id FROM seq), 1, 'Come inside',      'standard', 'start',      NULL,'Come inside and close the door.'),
      ((SELECT id FROM seq), 2, 'Shoes off',        'standard', 'transition', 60,  'Take off your shoes and put them away.'),
      ((SELECT id FROM seq), 3, 'Hang up bag',      'standard', 'transition', 30,  'Hang your bag on your hook.'),
      ((SELECT id FROM seq), 4, 'Wash hands',       'standard', 'pacing',     30,  'Wash your hands.'),
      ((SELECT id FROM seq), 5, 'Snack time',       'standard', 'celebration',NULL,'Snack time! You worked hard today.');

    -- ============================================================
    -- TEMPLATE 7: Bedtime Routine
    -- ============================================================
    WITH seq AS (
      INSERT INTO public.sequences (
        id, owner_id, title, type, is_template, is_published, completion_action, reward_text
      ) VALUES (
        '00000000-0000-0000-0000-000000000007',
        '00000000-0000-0000-0000-000000000000',
        'Bedtime Routine', 'routine', TRUE, TRUE,
        'celebrate', 'Sweet dreams!'
      ) RETURNING id
    )
    INSERT INTO public.steps (sequence_id, order_index, title, step_type, cue_type, duration_seconds, help_text) VALUES
      ((SELECT id FROM seq), 1, 'Tidy toys',       'standard', 'start',      300, 'Let''s tidy away the toys.'),
      ((SELECT id FROM seq), 2, 'Bath or wash',    'standard', 'transition', 600, 'Time for a bath or a wash.'),
      ((SELECT id FROM seq), 3, 'Pyjamas on',      'standard', 'transition', 120, 'Put on your pyjamas.'),
      ((SELECT id FROM seq), 4, 'Brush teeth',     'standard', 'pacing',     120, 'Brush your teeth.'),
      ((SELECT id FROM seq), 5, 'Into bed',        'standard', 'calm',       NULL,'Get into bed and get cosy.'),
      ((SELECT id FROM seq), 6, 'Story time',      'standard', 'calm',       NULL,'Story time. Lie still and listen.'),
      ((SELECT id FROM seq), 7, 'Lights out',      'standard', 'calm',       NULL,'Time to sleep. Close your eyes. Goodnight.');

    -- ============================================================
    -- TEMPLATE 8: Calm Down
    -- ============================================================
    WITH seq AS (
      INSERT INTO public.sequences (
        id, owner_id, title, type, is_template, is_published, completion_action, reward_text
      ) VALUES (
        '00000000-0000-0000-0000-000000000008',
        '00000000-0000-0000-0000-000000000000',
        'Calm Down', 'calm', TRUE, TRUE,
        'return_to_today', NULL
      ) RETURNING id
    )
    INSERT INTO public.steps (sequence_id, order_index, title, step_type, cue_type, duration_seconds, help_text) VALUES
      ((SELECT id FROM seq), 1, 'Find a calm spot',   'standard', 'calm', NULL,'Find a quiet spot to sit or lie down.'),
      ((SELECT id FROM seq), 2, 'Breathe in',         'standard', 'calm', 4,   'Breathe in slowly… in… in… in…'),
      ((SELECT id FROM seq), 3, 'Breathe out',        'standard', 'calm', 6,   'Breathe out slowly… out… out… out…'),
      ((SELECT id FROM seq), 4, 'Breathe in again',   'standard', 'calm', 4,   'In… in… in…'),
      ((SELECT id FROM seq), 5, 'Breathe out again',  'standard', 'calm', 6,   'Out… out… out…'),
      ((SELECT id FROM seq), 6, 'Feeling better?',    'standard', 'calm', NULL,'Take your time. You are safe. When you are ready, press Done.');

    -- ============================================================
    -- TEMPLATE 9: Homework Time
    -- ============================================================
    WITH seq AS (
      INSERT INTO public.sequences (
        id, owner_id, title, type, is_template, is_published, completion_action, reward_text
      ) VALUES (
        '00000000-0000-0000-0000-000000000009',
        '00000000-0000-0000-0000-000000000000',
        'Homework Time', 'routine', TRUE, TRUE,
        'celebrate', 'Homework done!'
      ) RETURNING id
    )
    INSERT INTO public.steps (sequence_id, order_index, title, step_type, cue_type, duration_seconds, help_text) VALUES
      ((SELECT id FROM seq), 1, 'Get your homework',  'standard', 'start',       60,  'Get your homework out of your bag.'),
      ((SELECT id FROM seq), 2, 'Sit at the table',   'standard', 'transition',  30,  'Sit at the table with everything you need.'),
      ((SELECT id FROM seq), 3, 'Do your homework',   'standard', 'pacing',      1200,'Work through your homework. Ask for help if you need it.'),
      ((SELECT id FROM seq), 4, 'Pack it away',       'standard', 'transition',  60,  'Put your homework back in your bag.'),
      ((SELECT id FROM seq), 5, 'All done!',          'standard', 'celebration', NULL,'Homework finished! Well done.');

    -- ============================================================
    -- TEMPLATE 10: Dinner Time
    -- ============================================================
    WITH seq AS (
      INSERT INTO public.sequences (
        id, owner_id, title, type, is_template, is_published, completion_action, reward_text
      ) VALUES (
        '00000000-0000-0000-0000-000000000010',
        '00000000-0000-0000-0000-000000000000',
        'Dinner Time', 'routine', TRUE, TRUE,
        'celebrate', 'Great eating!'
      ) RETURNING id
    )
    INSERT INTO public.steps (sequence_id, order_index, title, step_type, cue_type, duration_seconds, help_text) VALUES
      ((SELECT id FROM seq), 1, 'Wash hands',      'standard', 'start',      30,  'Wash your hands before dinner.'),
      ((SELECT id FROM seq), 2, 'Sit at the table','standard', 'transition', 30,  'Sit at the table.'),
      ((SELECT id FROM seq), 3, 'Eat your dinner', 'standard', 'pacing',     900, 'Eat your dinner. Take small bites.'),
      ((SELECT id FROM seq), 4, 'Finished eating', 'standard', 'transition', NULL,'When you are done, wait at the table.'),
      ((SELECT id FROM seq), 5, 'Clear your plate','standard', 'celebration',NULL,'Take your plate to the kitchen. Well done!');

    -- ============================================================
    -- TEMPLATE 11: Play Time
    -- ============================================================
    WITH seq AS (
      INSERT INTO public.sequences (
        id, owner_id, title, type, is_template, is_published, completion_action, reward_text
      ) VALUES (
        '00000000-0000-0000-0000-000000000011',
        '00000000-0000-0000-0000-000000000000',
        'Play Time', 'routine', TRUE, TRUE,
        'celebrate', 'Great playing today!'
      ) RETURNING id
    )
    INSERT INTO public.steps (sequence_id, order_index, title, step_type, cue_type, duration_seconds, help_text) VALUES
      ((SELECT id FROM seq), 1, 'Choose what to play',  'standard', 'start',      60,   'What do you want to play with today? Pick something.'),
      ((SELECT id FROM seq), 2, 'Get your things',      'standard', 'transition', 60,   'Get what you need to play.'),
      ((SELECT id FROM seq), 3, 'Play!',                'standard', 'pacing',     1800, 'Play time! Have fun.'),
      ((SELECT id FROM seq), 4, 'Five more minutes',    'standard', 'transition', 300,  'Five more minutes of play, then we will tidy up.'),
      ((SELECT id FROM seq), 5, 'Tidy up time',         'standard', 'calm',       300,  'Play time is finished. Let''s tidy up together.'),
      ((SELECT id FROM seq), 6, 'All tidied!',          'standard', 'celebration',NULL, 'Everything is put away. Well done!');

    -- ============================================================
    -- TEMPLATE 12: TV / iPad Time
    -- ============================================================
    WITH seq AS (
      INSERT INTO public.sequences (
        id, owner_id, title, type, is_template, is_published, completion_action, reward_text
      ) VALUES (
        '00000000-0000-0000-0000-000000000012',
        '00000000-0000-0000-0000-000000000000',
        'TV / iPad Time', 'routine', TRUE, TRUE,
        'celebrate', 'Great job turning it off!'
      ) RETURNING id
    )
    INSERT INTO public.steps (sequence_id, order_index, title, step_type, cue_type, duration_seconds, help_text) VALUES
      ((SELECT id FROM seq), 1, 'Choose what to watch', 'standard', 'start',      60,   'Pick one show or one game. Then we start.'),
      ((SELECT id FROM seq), 2, 'Sit comfortably',      'standard', 'transition', 30,   'Find a comfy spot to sit.'),
      ((SELECT id FROM seq), 3, 'Watch or play',        'standard', 'pacing',     1800, 'Enjoy your screen time.'),
      ((SELECT id FROM seq), 4, 'Two more minutes',     'standard', 'transition', 120,  'Screen time is nearly over. Two more minutes.'),
      ((SELECT id FROM seq), 5, 'Turn it off',          'standard', 'calm',       30,   'Time to turn the screen off now. Press the button.'),
      ((SELECT id FROM seq), 6, 'Screen time done!',    'standard', 'celebration',NULL, 'You turned it off all by yourself. Well done!');

    -- ============================================================
    -- TEMPLATE 13: Bath Time
    -- ============================================================
    WITH seq AS (
      INSERT INTO public.sequences (
        id, owner_id, title, type, is_template, is_published, completion_action, reward_text
      ) VALUES (
        '00000000-0000-0000-0000-000000000013',
        '00000000-0000-0000-0000-000000000000',
        'Bath Time', 'routine', TRUE, TRUE,
        'celebrate', 'All clean and fresh!'
      ) RETURNING id
    )
    INSERT INTO public.steps (sequence_id, order_index, title, step_type, cue_type, duration_seconds, help_text) VALUES
      ((SELECT id FROM seq), 1, 'Get undressed',        'standard', 'start',      120,  'Take off your clothes and put them in the basket.'),
      ((SELECT id FROM seq), 2, 'Get in the bath',      'standard', 'transition', 30,   'Step into the bath carefully. Hold on.'),
      ((SELECT id FROM seq), 3, 'Wash your body',       'standard', 'pacing',     180,  'Use the sponge or cloth to wash all over.'),
      ((SELECT id FROM seq), 4, 'Wash your hair',       'standard', 'pacing',     120,  'Wash your hair. Close your eyes tight!'),
      ((SELECT id FROM seq), 5, 'Rinse',                'standard', 'pacing',     60,   'Rinse all the soap off. Good job.'),
      ((SELECT id FROM seq), 6, 'Get out carefully',    'standard', 'transition', 30,   'Step out of the bath carefully. Hold on.'),
      ((SELECT id FROM seq), 7, 'Dry yourself',         'standard', 'pacing',     60,   'Use your towel to dry yourself all over.'),
      ((SELECT id FROM seq), 8, 'Pyjamas on!',          'standard', 'celebration',NULL, 'Put on your pyjamas. All clean and cosy!');

    -- ============================================================
    -- TEMPLATE 14: Get in the Car
    -- ============================================================
    WITH seq AS (
      INSERT INTO public.sequences (
        id, owner_id, title, type, is_template, is_published, completion_action, reward_text
      ) VALUES (
        '00000000-0000-0000-0000-000000000014',
        '00000000-0000-0000-0000-000000000000',
        'Get in the Car', 'routine', TRUE, TRUE,
        'celebrate', 'Buckled up and ready to go!'
      ) RETURNING id
    )
    INSERT INTO public.steps (sequence_id, order_index, title, step_type, cue_type, duration_seconds, help_text) VALUES
      ((SELECT id FROM seq), 1, 'Get your things',      'standard', 'start',      60,  'Get anything you need to bring with you.'),
      ((SELECT id FROM seq), 2, 'Walk to the car',      'standard', 'transition', 30,  'Walk to the car. Stay close.'),
      ((SELECT id FROM seq), 3, 'Open the door',        'standard', 'transition', 15,  'Open your door and get in carefully.'),
      ((SELECT id FROM seq), 4, 'Sit in your seat',     'standard', 'transition', 15,  'Sit down in your seat.'),
      ((SELECT id FROM seq), 5, 'Put on your seatbelt', 'standard', 'pacing',     30,  'Pull the seatbelt across and click it in. Can you hear the click?'),
      ((SELECT id FROM seq), 6, 'Ready to go!',         'standard', 'celebration',NULL,'Seatbelt on. All ready. Let''s go!');

    -- ============================================================
    -- TEMPLATE 15: Get out of the Car
    -- ============================================================
    WITH seq AS (
      INSERT INTO public.sequences (
        id, owner_id, title, type, is_template, is_published, completion_action, reward_text
      ) VALUES (
        '00000000-0000-0000-0000-000000000015',
        '00000000-0000-0000-0000-000000000000',
        'Get out of the Car', 'routine', TRUE, TRUE,
        'celebrate', 'Out of the car — well done!'
      ) RETURNING id
    )
    INSERT INTO public.steps (sequence_id, order_index, title, step_type, cue_type, duration_seconds, help_text) VALUES
      ((SELECT id FROM seq), 1, 'Car has stopped',      'standard', 'start',      15,  'The car has stopped. Wait until it is safe.'),
      ((SELECT id FROM seq), 2, 'Undo your seatbelt',   'standard', 'transition', 15,  'Press the button and take off your seatbelt.'),
      ((SELECT id FROM seq), 3, 'Get your things',      'standard', 'transition', 30,  'Pick up anything you brought with you.'),
      ((SELECT id FROM seq), 4, 'Open the door',        'standard', 'transition', 15,  'Open your door carefully and step out.'),
      ((SELECT id FROM seq), 5, 'Stay on the pavement', 'standard', 'calm',       15,  'Step onto the pavement and wait. Do not go near the road.'),
      ((SELECT id FROM seq), 6, 'All out!',             'standard', 'celebration',NULL,'Out of the car safely. Great job!');

  END IF;
END $$;
