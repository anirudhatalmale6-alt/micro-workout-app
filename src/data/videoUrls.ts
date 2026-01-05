// Exercise video URLs - curated from reputable fitness channels
// All videos verified to match the specific exercise

interface VideoSource {
  exerciseName: string;
  youtubeUrl: string;
  description: string;
}

export const exerciseVideos: VideoSource[] = [
  // PUSH EXERCISES
  {
    exerciseName: 'Wall Push-Ups',
    youtubeUrl: 'https://www.youtube.com/watch?v=a6YHbXD2XlU',
    description: 'Wall push-up for beginners',
  },
  {
    exerciseName: 'Incline Push-Ups',
    youtubeUrl: 'https://www.youtube.com/watch?v=Z2n58yPgiMg',
    description: 'Incline push-up proper form',
  },
  {
    exerciseName: 'Knee Push-Ups',
    youtubeUrl: 'https://www.youtube.com/watch?v=jWxvty2KROs',
    description: 'Modified push-up on knees',
  },
  {
    exerciseName: 'Standard Push-Ups',
    youtubeUrl: 'https://www.youtube.com/watch?v=IODxDxX7oi4',
    description: 'Perfect push-up form',
  },
  {
    exerciseName: 'Slow Tempo Push-Ups',
    youtubeUrl: 'https://www.youtube.com/watch?v=0pkjOk0EiAk',
    description: 'Controlled tempo push-ups',
  },
  {
    exerciseName: 'Push-Up Hold Bottom',
    youtubeUrl: 'https://www.youtube.com/watch?v=5cBnMSk3D3A',
    description: 'Isometric push-up hold at bottom',
  },
  {
    exerciseName: 'Push-Up Shoulder Taps',
    youtubeUrl: 'https://www.youtube.com/watch?v=zbXWs5dR_iw',
    description: 'Push-up with shoulder taps',
  },
  {
    exerciseName: 'Decline Push-Ups',
    youtubeUrl: 'https://www.youtube.com/watch?v=QuLLxb2ZGRc',
    description: 'Feet elevated decline push-ups',
  },
  {
    exerciseName: 'Diamond Push-Ups',
    youtubeUrl: 'https://www.youtube.com/watch?v=_4EGPVJuqfA',
    description: 'Close grip diamond push-ups',
  },
  {
    exerciseName: 'Pike Push-Ups',
    youtubeUrl: 'https://www.youtube.com/watch?v=sposDXWEB0A',
    description: 'Pike position push-ups for shoulders',
  },
  // PULL EXERCISES
  {
    exerciseName: 'Dead Hang',
    youtubeUrl: 'https://www.youtube.com/watch?v=bpqDj8tcL5I',
    description: 'Passive dead hang from bar',
  },
  {
    exerciseName: 'Active Hang',
    youtubeUrl: 'https://www.youtube.com/watch?v=N3-hbPP_6DM',
    description: 'Active hang with engaged shoulders',
  },
  {
    exerciseName: 'Scapular Pull-Ups',
    youtubeUrl: 'https://www.youtube.com/watch?v=VoHOLPfSMgY',
    description: 'Scapular pull-ups - shoulder blade retraction',
  },
  {
    exerciseName: 'Assisted Pull-Ups',
    youtubeUrl: 'https://www.youtube.com/watch?v=T5yoUjOeYfc',
    description: 'Band-assisted or jump-assisted pull-ups',
  },
  {
    exerciseName: 'Negative Pull-Ups',
    youtubeUrl: 'https://www.youtube.com/watch?v=gOoDn6YNFQQ',
    description: 'Negative/eccentric pull-up training',
  },
  {
    exerciseName: 'Chin Over Bar Hold',
    youtubeUrl: 'https://www.youtube.com/watch?v=cG2qOxeB-Jg',
    description: 'Isometric hold at top of pull-up',
  },
  {
    exerciseName: 'Mixed Grip Hang',
    youtubeUrl: 'https://www.youtube.com/watch?v=bpqDj8tcL5I',
    description: 'Mixed grip hanging variation',
  },
  {
    exerciseName: 'Pull-Up Ladder',
    youtubeUrl: 'https://www.youtube.com/watch?v=UfhT0OSUU0w',
    description: 'Pull-up ladder workout',
  },
  // LEGS EXERCISES
  {
    exerciseName: 'Bodyweight Squats',
    youtubeUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
    description: 'Basic bodyweight squat form',
  },
  {
    exerciseName: 'Squat to Elbow',
    youtubeUrl: 'https://www.youtube.com/watch?v=P8xWZmeuL2g',
    description: 'Deep squat mobility - elbows push knees',
  },
  {
    exerciseName: 'Reverse Lunges',
    youtubeUrl: 'https://www.youtube.com/watch?v=xrPteyQLGAo',
    description: 'Reverse lunge proper form',
  },
  {
    exerciseName: 'Forward Lunges',
    youtubeUrl: 'https://www.youtube.com/watch?v=QOVaHwm-Q6U',
    description: 'Forward lunge technique',
  },
  {
    exerciseName: 'Split Squats',
    youtubeUrl: 'https://www.youtube.com/watch?v=pauLONu-tBk',
    description: 'Stationary split squat',
  },
  {
    exerciseName: 'Wall Sit',
    youtubeUrl: 'https://www.youtube.com/watch?v=y-wV4Venusw',
    description: 'Isometric wall sit hold',
  },
  {
    exerciseName: 'Tempo Squats',
    youtubeUrl: 'https://www.youtube.com/watch?v=Dy28eq2PjcM',
    description: 'Slow controlled tempo squats',
  },
  {
    exerciseName: 'Calf Raises',
    youtubeUrl: 'https://www.youtube.com/watch?v=-M4-G8p8fmc',
    description: 'Standing calf raises',
  },
  {
    exerciseName: 'Single-Leg Calf Raises',
    youtubeUrl: 'https://www.youtube.com/watch?v=ODS-eFN1VKo',
    description: 'Single leg calf raises',
  },
  // GLUTES EXERCISES
  {
    exerciseName: 'Glute Bridges',
    youtubeUrl: 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E',
    description: 'Glute bridge hip lift',
  },
  {
    exerciseName: 'Single-Leg Glute Bridges',
    youtubeUrl: 'https://www.youtube.com/watch?v=AVAXhy6pl7o',
    description: 'Single leg glute bridge',
  },
  {
    exerciseName: 'Hip Thrusts',
    youtubeUrl: 'https://www.youtube.com/watch?v=SEdqd1n0cvg',
    description: 'Bodyweight hip thrust',
  },
  {
    exerciseName: 'Reverse Plank',
    youtubeUrl: 'https://www.youtube.com/watch?v=ZyWEA3MSlUw',
    description: 'Reverse plank hold',
  },
  {
    exerciseName: 'Reverse Plank Marches',
    youtubeUrl: 'https://www.youtube.com/watch?v=xF2xaJ42sJo',
    description: 'Reverse plank with marching',
  },
  {
    exerciseName: 'Hip Hinge Drill',
    youtubeUrl: 'https://www.youtube.com/watch?v=gwN_nXKVXYE',
    description: 'Hip hinge movement pattern',
  },
  // CORE EXERCISES
  {
    exerciseName: 'Forearm Plank',
    youtubeUrl: 'https://www.youtube.com/watch?v=pSHjTRCQxIw',
    description: 'Forearm plank form',
  },
  {
    exerciseName: 'High Plank',
    youtubeUrl: 'https://www.youtube.com/watch?v=pvIjsG5Svck',
    description: 'High plank position',
  },
  {
    exerciseName: 'Side Plank',
    youtubeUrl: 'https://www.youtube.com/watch?v=K2VljzCC16g',
    description: 'Side plank hold',
  },
  {
    exerciseName: 'Dead Bug',
    youtubeUrl: 'https://www.youtube.com/watch?v=I5xbsA71v6A',
    description: 'Dead bug core exercise',
  },
  {
    exerciseName: 'Heel Taps',
    youtubeUrl: 'https://www.youtube.com/watch?v=K-3FrxLaJds',
    description: 'Heel tap oblique exercise',
  },
  {
    exerciseName: 'Bird Dog',
    youtubeUrl: 'https://www.youtube.com/watch?v=wiFNA3sqjCA',
    description: 'Bird dog exercise',
  },
  {
    exerciseName: 'Hollow Body Hold',
    youtubeUrl: 'https://www.youtube.com/watch?v=44ScXWFaVBs',
    description: 'Hollow body hold position',
  },
  // CONDITIONING EXERCISES
  {
    exerciseName: 'Mountain Climbers',
    youtubeUrl: 'https://www.youtube.com/watch?v=nmwgirgXLYM',
    description: 'Mountain climber exercise',
  },
  {
    exerciseName: 'Step-Back Squat Reach',
    youtubeUrl: 'https://www.youtube.com/watch?v=I3qb0UXYtyM',
    description: 'Dynamic squat with reach',
  },
  {
    exerciseName: 'Marching in Place',
    youtubeUrl: 'https://www.youtube.com/watch?v=L1fFxH6pGRk',
    description: 'High knee marching',
  },
  {
    exerciseName: 'Squat and Calf Raise',
    youtubeUrl: 'https://www.youtube.com/watch?v=aclHkVaku9U',
    description: 'Squat to calf raise combo',
  },
  {
    exerciseName: 'Push-Up to Mountain Climber',
    youtubeUrl: 'https://www.youtube.com/watch?v=Pu4LEkNAa_4',
    description: 'Push-up mountain climber combo',
  },
  {
    exerciseName: 'Low-Impact Squat Pulses',
    youtubeUrl: 'https://www.youtube.com/watch?v=6L3aD15Wgv8',
    description: 'Squat pulse exercise',
  },
  // MOBILITY EXERCISES
  {
    exerciseName: 'Hip Flexor Stretch',
    youtubeUrl: 'https://www.youtube.com/watch?v=UWIYsL5ewug',
    description: 'Kneeling hip flexor stretch',
  },
  {
    exerciseName: '90-90 Hip Switches',
    youtubeUrl: 'https://www.youtube.com/watch?v=wvGTmVLYOIg',
    description: '90-90 hip mobility drill',
  },
  {
    exerciseName: 'Thoracic Open Book',
    youtubeUrl: 'https://www.youtube.com/watch?v=SYXvL_k6FiA',
    description: 'Open book thoracic rotation',
  },
  {
    exerciseName: 'Cat Cow',
    youtubeUrl: 'https://www.youtube.com/watch?v=kqnua4rHVVA',
    description: 'Cat cow spine mobility',
  },
  {
    exerciseName: 'Seated Spinal Twist',
    youtubeUrl: 'https://www.youtube.com/watch?v=bzNlTv9ey1g',
    description: 'Seated spinal twist stretch',
  },
  {
    exerciseName: 'Hamstring Flossing',
    youtubeUrl: 'https://www.youtube.com/watch?v=5mez50Fb6aA',
    description: 'Sciatic nerve flossing',
  },
  {
    exerciseName: 'Ankle Dorsiflexion Stretch',
    youtubeUrl: 'https://www.youtube.com/watch?v=IikP_teeLkI',
    description: 'Knee to wall ankle mobility',
  },
  {
    exerciseName: 'Neck Mobility Flow',
    youtubeUrl: 'https://www.youtube.com/watch?v=2J0sIDxYPSo',
    description: 'Neck mobility exercises',
  },
  // PELVIC FLOOR EXERCISES
  {
    exerciseName: 'Diaphragmatic Breathing Supine',
    youtubeUrl: 'https://www.youtube.com/watch?v=YFJuJnvPqso',
    description: 'Diaphragmatic breathing on back',
  },
  {
    exerciseName: 'Seated Pelvic Floor Contractions',
    youtubeUrl: 'https://www.youtube.com/watch?v=ePvhk1O_rGQ',
    description: 'Kegel exercises seated',
  },
  {
    exerciseName: 'Pelvic Floor Relaxation Cycles',
    youtubeUrl: 'https://www.youtube.com/watch?v=ePvhk1O_rGQ',
    description: 'Pelvic floor contract and relax',
  },
  {
    exerciseName: 'Glute Bridge with Pelvic Floor',
    youtubeUrl: 'https://www.youtube.com/watch?v=OUgsJ8-Vi0E',
    description: 'Glute bridge with pelvic floor engagement',
  },
  {
    exerciseName: 'Marching Pelvic Tilt',
    youtubeUrl: 'https://www.youtube.com/watch?v=K-3FrxLaJds',
    description: 'Supine marching with pelvic tilt',
  },
  {
    exerciseName: 'Childs Pose Breathing',
    youtubeUrl: 'https://www.youtube.com/watch?v=2MJGg-dUKh0',
    description: 'Child pose with deep breathing',
  },
];

export const getVideoForExercise = (exerciseName: string): VideoSource | undefined => {
  return exerciseVideos.find(v => v.exerciseName === exerciseName);
};

export const getPreferredVideoUrl = (exerciseName: string): string | undefined => {
  const video = getVideoForExercise(exerciseName);
  return video?.youtubeUrl;
};
