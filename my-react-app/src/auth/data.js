// authData.js
export const LEVELS = [
    { id:1, emoji:'🌱', name:'Beginner', desc:'I know almost no English', color:'#22C67A' },
    { id:2, emoji:'📗', name:'Elementary', desc:'I know basic words and simple sentences', color:'#3B8FFF' },
    { id:3, emoji:'📘', name:'Intermediate', desc:'I can hold a basic conversation', color:'#7B5EFF' },
    { id:4, emoji:'📙', name:'Upper-Intermediate', desc:'I understand most everyday English', color:'#FFB800' },
    { id:5, emoji:'📕', name:'Advanced', desc:'I speak fluently with minor mistakes', color:'#FF8C42' },
    { id:6, emoji:'🏆', name:'Proficient', desc:'I speak English at near-native level', color:'#FF5C7A' },
];

export const PLACEMENT_QUESTIONS = [
    { id:1, level:1, text:'Choose the correct sentence:', answers:['She have a cat.','She has a cat.','She haves a cat.','She is have a cat.'], correct:1 },
    { id:2, level:2, text:'What is the past tense of "go"?', answers:['Goed','Goes','Went','Gone'], correct:2 },
    { id:3, level:3, text:'Complete: "If I ___ rich, I would travel the world."', answers:['am','was','were','be'], correct:2 },
    { id:4, level:4, text:'"The report needs to be submitted by Friday." What does "submitted" mean here?', answers:['Read carefully','Handed in / delivered','Corrected','Printed'], correct:1 },
    { id:5, level:5, text:'Which sentence uses the subjunctive mood correctly?', answers:['I suggest that he goes home.','I suggest that he go home.','I suggest that he will go home.','I suggest that he should goes home.'], correct:1 },
    { id:6, level:6, text:'"The legislation was lambasted by critics." What does "lambasted" mean?', answers:['Praised','Ignored','Harshly criticized','Quickly passed'], correct:2 },
];