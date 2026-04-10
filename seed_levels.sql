-- =========================================================================================
-- CODEQUEST C++ LEVEL SEEDER
-- Run this in your Supabase SQL Editor to instantly inject 4 C++ logic levels!
-- =========================================================================================

-- Optional: Clear out existing test levels to keep the dashboard clean
-- DELETE FROM public.levels;

INSERT INTO public.levels (title, level_number, xp_reward, expected_answer, description, question)
VALUES 
(
  'Matrix Breach (Array Bounds)', 
  1, 
  15, 
  '5', 
  'The C++ targeting system is crashing with an out-of-bounds error. What array index is it illegally trying to access that causes the segmentation fault?', 
  'int targets[5] = {10, 20, 30, 40, 50};

for(int i = 0; i <= 5; i++) {
    cout << "Target acquired: " << targets[i] << endl;
}'
),
(
  'Temporal Anomaly (Loops)', 
  2, 
  25, 
  'power++', 
  'The warp drive initialization is stuck in an infinite loop, freezing the entire terminal! What exact C++ statement is missing inside the loop to make it terminate properly?', 
  'int power = 0;

while (power < 10) {
    cout << "Charging warp drive..." << endl;
    
    // MISSING CODE HERE
}'
),
(
  'The False Positive (Logic)', 
  3, 
  50, 
  'Access Granted', 
  'The secure access gate is letting unauthorized cadets through because of a classic C++ logic error. Look closely at the if-statement. What exact text will this output?', 
  'bool hasPass = false;
bool isOverride = false;

// Note: Using single = instead of ==
if (hasPass = true || isOverride) {
    cout << "Access Granted";
} else {
    cout << "Access Denied";
}'
),
(
  'Null Reference Protocol (Pointers)', 
  4, 
  100, 
  'new int', 
  'A memory critical application is segfaulting instantly. The pointer hasn''t been allocated physical memory! What C++ keyword formulation is needed to allocate the integer dynamically?', 
  'int* dataPtr;

// MISSING DYNAMIC ALLOCATION HERE
// dataPtr = ???;

*dataPtr = 42; 
cout << "Data saved: " << *dataPtr;'
);
