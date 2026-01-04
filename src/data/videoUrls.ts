// Royalty-free exercise video URLs from Pexels and Pixabay
// These videos are free to use with no attribution required
// Videos will be streamed (not embedded) to keep app size small

interface VideoSource {
  exerciseName: string;
  pexelsUrl?: string;
  pixabayUrl?: string;
  youtubeUrl?: string; // Fallback to original YouTube links
  description: string;
}

// Note: These URLs point to video pages. For actual streaming,
// we'd need to use the Pexels API to get direct video URLs.
// For now, we'll open these in browser or use the YouTube fallbacks.

export const exerciseVideos: VideoSource[] = [
  // PUSH EXERCISES
  {
    exerciseName: 'Wall Push-Ups',
    pexelsUrl: 'https://www.pexels.com/search/videos/wall%20push%20up/',
    youtubeUrl: 'https://www.youtube.com/watch?v=5NPvvJ2F1_s',
    description: 'Wall push-up demonstration',
  },
  {
    exerciseName: 'Incline Push-Ups',
    pexelsUrl: 'https://www.pexels.com/search/videos/incline%20push%20up/',
    youtubeUrl: 'https://www.youtube.com/watch?v=0GsVJsS6474',
    description: 'Incline push-up form',
  },
  {
    exerciseName: 'Knee Push-Ups',
    pexelsUrl: 'https://www.pexels.com/search/videos/knee%20push%20up/',
    youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    description: 'Modified push-up on knees',
  },
  {
    exerciseName: 'Standard Push-Ups',
    pexelsUrl: 'https://www.pexels.com/video/a-man-doing-push-ups-4761437/',
    pixabayUrl: 'https://pixabay.com/videos/search/push%20up/',
    youtubeUrl: 'https://www.youtube.com/watch?v=_l3ySVKYVJ8',
    description: 'Standard push-up technique',
  },
  {
    exerciseName: 'Slow Tempo Push-Ups',
    youtubeUrl: 'https://www.youtube.com/watch?v=Yb9Q4x5TQ4Y',
    description: 'Controlled tempo push-ups',
  },
  {
    exerciseName: 'Push-Up Hold Bottom',
    youtubeUrl: 'https://www.youtube.com/watch?v=Z6uXzYp1NnM',
    description: 'Isometric push-up hold',
  },
  {
    exerciseName: 'Push-Up Shoulder Taps',
    pexelsUrl: 'https://www.pexels.com/search/videos/shoulder%20tap/',
    youtubeUrl: 'https://www.youtube.com/watch?v=K2VljzCC16g',
    description: 'Push-up with shoulder taps',
  },
  {
    exerciseName: 'Decline Push-Ups',
    youtubeUrl: 'https://www.youtube.com/watch?v=SKPab2YC8BE',
    description: 'Feet elevated push-ups',
  },
  {
    exerciseName: 'Diamond Push-Ups',
    pexelsUrl: 'https://www.pexels.com/search/videos/diamond%20push%20up/',
    youtubeUrl: 'https://www.youtube.com/watch?v=J0DnG1_S92I',
    description: 'Close grip push-ups',
  },
  {
    exerciseName: 'Pike Push-Ups',
    youtubeUrl: 'https://www.youtube.com/watch?v=srprqb9sKzg',
    description: 'Pike position push-ups',
  },
  // PULL EXERCISES
  {
    exerciseName: 'Dead Hang',
    pexelsUrl: 'https://www.pexels.com/search/videos/hanging%20bar/',
    youtubeUrl: 'https://www.youtube.com/watch?v=V8S3BvOqH6I',
    description: 'Passive hanging from bar',
  },
  {
    exerciseName: 'Active Hang',
    youtubeUrl: 'https://www.youtube.com/watch?v=HhWg0XQbX5s',
    description: 'Engaged shoulder hang',
  },
  {
    exerciseName: 'Scapular Pull-Ups',
    youtubeUrl: 'https://www.youtube.com/watch?v=9efgcAjQe7E',
    description: 'Scapular activation drill',
  },
  {
    exerciseName: 'Assisted Pull-Ups',
    youtubeUrl: 'https://www.youtube.com/watch?v=gbPURTSxQLY',
    description: 'Jump-assisted pull-ups',
  },
  {
    exerciseName: 'Negative Pull-Ups',
    pexelsUrl: 'https://www.pexels.com/search/videos/pull%20up/',
    youtubeUrl: 'https://www.youtube.com/watch?v=3YvfRx31xDE',
    description: 'Eccentric pull-up training',
  },
  {
    exerciseName: 'Chin Over Bar Hold',
    youtubeUrl: 'https://www.youtube.com/watch?v=bG8YwzqVQmQ',
    description: 'Isometric top position hold',
  },
  {
    exerciseName: 'Mixed Grip Hang',
    youtubeUrl: 'https://www.youtube.com/watch?v=0Vn8tZk3b3E',
    description: 'Alternating grip hang',
  },
  {
    exerciseName: 'Pull-Up Ladder',
    youtubeUrl: 'https://www.youtube.com/watch?v=YyR6g5xO9uE',
    description: 'Progressive rep ladder',
  },
  // LEGS EXERCISES
  {
    exerciseName: 'Bodyweight Squats',
    pexelsUrl: 'https://www.pexels.com/video/a-woman-in-black-activewear-doing-squat-exercise-4498155/',
    pixabayUrl: 'https://pixabay.com/videos/search/squat/',
    youtubeUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
    description: 'Basic bodyweight squat',
  },
  {
    exerciseName: 'Squat to Elbow',
    youtubeUrl: 'https://www.youtube.com/watch?v=Jj5c3HhFZkM',
    description: 'Deep squat mobility drill',
  },
  {
    exerciseName: 'Reverse Lunges',
    pexelsUrl: 'https://www.pexels.com/search/videos/lunge/',
    youtubeUrl: 'https://www.youtube.com/watch?v=QF0BQS2W80k',
    description: 'Backward stepping lunge',
  },
  {
    exerciseName: 'Forward Lunges',
    pexelsUrl: 'https://www.pexels.com/video/woman-doing-lunges-exercise-4498606/',
    youtubeUrl: 'https://www.youtube.com/watch?v=wrwwXE_x-pQ',
    description: 'Forward stepping lunge',
  },
  {
    exerciseName: 'Split Squats',
    youtubeUrl: 'https://www.youtube.com/watch?v=2C-uNgKwPLE',
    description: 'Stationary split squat',
  },
  {
    exerciseName: 'Wall Sit',
    pexelsUrl: 'https://www.pexels.com/search/videos/wall%20sit/',
    youtubeUrl: 'https://www.youtube.com/watch?v=y-wV4Venusw',
    description: 'Isometric wall squat hold',
  },
  {
    exerciseName: 'Tempo Squats',
    youtubeUrl: 'https://www.youtube.com/watch?v=QKKZ9AGYTi4',
    description: 'Slow controlled squats',
  },
  {
    exerciseName: 'Calf Raises',
    pexelsUrl: 'https://www.pexels.com/search/videos/calf%20raise/',
    youtubeUrl: 'https://www.youtube.com/watch?v=YMmgqO8Jo-k',
    description: 'Standing calf raises',
  },
  {
    exerciseName: 'Single-Leg Calf Raises',
    youtubeUrl: 'https://www.youtube.com/watch?v=eMTy3qylqnE',
    description: 'One leg calf raises',
  },
  // GLUTES EXERCISES
  {
    exerciseName: 'Glute Bridges',
    pexelsUrl: 'https://www.pexels.com/video/a-woman-doing-hip-thrust-exercise-4498261/',
    youtubeUrl: 'https://www.youtube.com/watch?v=m2Zx-57cSok',
    description: 'Hip bridge exercise',
  },
  {
    exerciseName: 'Single-Leg Glute Bridges',
    youtubeUrl: 'https://www.youtube.com/watch?v=J6VY8JwRzdA',
    description: 'Unilateral hip bridge',
  },
  {
    exerciseName: 'Hip Thrusts',
    pexelsUrl: 'https://www.pexels.com/search/videos/hip%20thrust/',
    youtubeUrl: 'https://www.youtube.com/watch?v=LM8XHLYJoYs',
    description: 'Elevated hip thrust',
  },
  {
    exerciseName: 'Reverse Plank',
    youtubeUrl: 'https://www.youtube.com/watch?v=JkE8v-y1f1E',
    description: 'Posterior chain plank',
  },
  {
    exerciseName: 'Reverse Plank Marches',
    youtubeUrl: 'https://www.youtube.com/watch?v=2e0B8zI2G0E',
    description: 'Marching reverse plank',
  },
  {
    exerciseName: 'Hip Hinge Drill',
    youtubeUrl: 'https://www.youtube.com/watch?v=ZL7B6cJ5cAk',
    description: 'Hip hinge pattern drill',
  },
  // CORE EXERCISES
  {
    exerciseName: 'Forearm Plank',
    pexelsUrl: 'https://www.pexels.com/video/woman-doing-plank-exercise-4498553/',
    pixabayUrl: 'https://pixabay.com/videos/search/plank/',
    youtubeUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    description: 'Basic forearm plank',
  },
  {
    exerciseName: 'High Plank',
    pexelsUrl: 'https://www.pexels.com/search/videos/plank/',
    youtubeUrl: 'https://www.youtube.com/watch?v=asxE2yHj7AU',
    description: 'Arms extended plank',
  },
  {
    exerciseName: 'Side Plank',
    pexelsUrl: 'https://www.pexels.com/video/woman-doing-side-plank-4498479/',
    youtubeUrl: 'https://www.youtube.com/watch?v=K2VljzCC16g',
    description: 'Lateral plank hold',
  },
  {
    exerciseName: 'Dead Bug',
    youtubeUrl: 'https://www.youtube.com/watch?v=4XLEnwUr1d8',
    description: 'Core stability exercise',
  },
  {
    exerciseName: 'Heel Taps',
    youtubeUrl: 'https://www.youtube.com/watch?v=7rRWy7-Gokg',
    description: 'Oblique heel touches',
  },
  {
    exerciseName: 'Bird Dog',
    youtubeUrl: 'https://www.youtube.com/watch?v=wiFNA3sqjCA',
    description: 'Opposite limb extension',
  },
  {
    exerciseName: 'Hollow Body Hold',
    youtubeUrl: 'https://www.youtube.com/watch?v=LL-8sQjF2E8',
    description: 'Hollow position hold',
  },
  // CONDITIONING EXERCISES
  {
    exerciseName: 'Mountain Climbers',
    pexelsUrl: 'https://www.pexels.com/video/woman-doing-mountain-climber-exercise-4498362/',
    youtubeUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
    description: 'Running plank exercise',
  },
  {
    exerciseName: 'Step-Back Squat Reach',
    youtubeUrl: 'https://www.youtube.com/watch?v=Q8hUQj3Zl0E',
    description: 'Dynamic mobility drill',
  },
  {
    exerciseName: 'Marching in Place',
    pexelsUrl: 'https://www.pexels.com/search/videos/marching/',
    youtubeUrl: 'https://www.youtube.com/watch?v=G5F2BzK4fUQ',
    description: 'Standing march exercise',
  },
  {
    exerciseName: 'Squat and Calf Raise',
    youtubeUrl: 'https://www.youtube.com/watch?v=6xwGFn-J_Qk',
    description: 'Compound squat movement',
  },
  {
    exerciseName: 'Push-Up to Mountain Climber',
    youtubeUrl: 'https://www.youtube.com/watch?v=2wK9D6t3R8U',
    description: 'Combined exercise flow',
  },
  {
    exerciseName: 'Low-Impact Squat Pulses',
    youtubeUrl: 'https://www.youtube.com/watch?v=G5JZr_6F4IM',
    description: 'Partial range squat pulses',
  },
  // MOBILITY EXERCISES
  {
    exerciseName: 'Hip Flexor Stretch',
    pexelsUrl: 'https://www.pexels.com/search/videos/hip%20stretch/',
    youtubeUrl: 'https://www.youtube.com/watch?v=7FZpJ9p5Q4k',
    description: 'Kneeling hip stretch',
  },
  {
    exerciseName: '90-90 Hip Switches',
    youtubeUrl: 'https://www.youtube.com/watch?v=0vA6vG0xQ5I',
    description: 'Hip mobility drill',
  },
  {
    exerciseName: 'Thoracic Open Book',
    youtubeUrl: 'https://www.youtube.com/watch?v=H1Z5yM4z9UE',
    description: 'Thoracic rotation stretch',
  },
  {
    exerciseName: 'Cat Cow',
    pexelsUrl: 'https://www.pexels.com/search/videos/cat%20cow/',
    youtubeUrl: 'https://www.youtube.com/watch?v=kqnua4rHVVA',
    description: 'Spinal flexion/extension',
  },
  {
    exerciseName: 'Seated Spinal Twist',
    pexelsUrl: 'https://www.pexels.com/search/videos/stretch/',
    youtubeUrl: 'https://www.youtube.com/watch?v=7QmM2m0FfGQ',
    description: 'Seated rotation stretch',
  },
  {
    exerciseName: 'Hamstring Flossing',
    youtubeUrl: 'https://www.youtube.com/watch?v=J2uN6gP9p1Q',
    description: 'Neural flossing technique',
  },
  {
    exerciseName: 'Ankle Dorsiflexion Stretch',
    youtubeUrl: 'https://www.youtube.com/watch?v=IikP_teeLkI',
    description: 'Ankle mobility drill',
  },
  {
    exerciseName: 'Neck Mobility Flow',
    youtubeUrl: 'https://www.youtube.com/watch?v=2NOsE-VPpkE',
    description: 'Gentle neck movements',
  },
  // PELVIC FLOOR EXERCISES
  {
    exerciseName: 'Diaphragmatic Breathing Supine',
    pexelsUrl: 'https://www.pexels.com/search/videos/breathing%20exercise/',
    youtubeUrl: 'https://www.youtube.com/watch?v=UB3tSaiEbNY',
    description: 'Deep belly breathing',
  },
  {
    exerciseName: 'Seated Pelvic Floor Contractions',
    youtubeUrl: 'https://www.youtube.com/watch?v=1u7t4nP8QpI',
    description: 'Kegel exercises',
  },
  {
    exerciseName: 'Pelvic Floor Relaxation Cycles',
    youtubeUrl: 'https://www.youtube.com/watch?v=ZfH0F7Xz8GI',
    description: 'Contract and relax cycles',
  },
  {
    exerciseName: 'Glute Bridge with Pelvic Floor',
    youtubeUrl: 'https://www.youtube.com/watch?v=b7FzN7V8FjE',
    description: 'Integrated bridge exercise',
  },
  {
    exerciseName: 'Marching Pelvic Tilt',
    youtubeUrl: 'https://www.youtube.com/watch?v=kZC3pPszZ0E',
    description: 'Supine marching drill',
  },
  {
    exerciseName: 'Childs Pose Breathing',
    pexelsUrl: 'https://www.pexels.com/search/videos/child%20pose/',
    youtubeUrl: 'https://www.youtube.com/watch?v=J7YFvR9v7zI',
    description: 'Restorative breathing pose',
  },
];

export const getVideoForExercise = (exerciseName: string): VideoSource | undefined => {
  return exerciseVideos.find(v => v.exerciseName === exerciseName);
};

export const getPreferredVideoUrl = (exerciseName: string): string | undefined => {
  const video = getVideoForExercise(exerciseName);
  if (!video) return undefined;

  // Prefer Pexels/Pixabay (royalty-free) over YouTube
  return video.pexelsUrl || video.pixabayUrl || video.youtubeUrl;
};
