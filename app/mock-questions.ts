export interface Question {
  id: number;
  type: string;
  question: string;
  options: string[];
  image?: string;
  audio?: string;
  section: "Listening" | "Reading";
  part: number;
  transcript?: string;
}

export interface TestData {
  id: number;
  name: string;
  sections: {
    name: "Listening" | "Reading";
    time: number;
    questions: Question[];
  }[];
}

export const getMockTest = (testId: number): TestData => {
  const questions: Question[] = [
    // Part 1: Photographs (3 questions)
    {
      id: 1,
      part: 1,
      type: "photo",
      section: "Listening",
      question: "Look at the photograph and listen to the four statements.",
      image: "/placeholder.svg?width=300&height=300",
      options: ["A person is typing on a laptop", "A group of people are in a meeting", "Documents are scattered on a desk", "The office is empty"],
      audio: "/audio/part1-1.mp3",
      transcript: "Look at the photograph. Now listen to the four statements.",
    },
    {
      id: 2,
      part: 1,
      type: "photo",
      section: "Listening",
      question: "Look at the photograph and listen to the four statements.",
      image: "/placeholder.svg?width=300&height=300",
      options: ["The restaurant is crowded", "The tables are being cleaned", "The chef is preparing food", "The customers are leaving"],
      audio: "/audio/part1-2.mp3",
      transcript: "Look at the photograph. Now listen to the four statements.",
    },
    {
      id: 3,
      part: 1,
      type: "photo",
      section: "Listening",
      question: "Look at the photograph and listen to the four statements.",
      image: "/placeholder.svg?width=300&height=300",
      options: ["A train is arriving at the station", "People are waiting on the platform", "The ticket office is closed", "The station is under construction"],
      audio: "/audio/part1-3.mp3",
      transcript: "Look at the photograph. Now listen to the four statements.",
    },

    // Part 2: Question-Response (3 questions)
    {
      id: 4,
      part: 2,
      type: "audio",
      section: "Listening",
      question: "Listen to the question and three responses.",
      options: ["I'll be there at 3 PM", "The meeting room is on the second floor", "Yes, I received the email"],
      audio: "/audio/part2-1.mp3",
      transcript: "When will the project be completed?",
    },
    {
      id: 5,
      part: 2,
      type: "audio",
      section: "Listening",
      question: "Listen to the question and three responses.",
      options: ["I prefer the blue one", "It's in the cabinet", "Let's meet tomorrow"],
      audio: "/audio/part2-2.mp3",
      transcript: "Where did you put the files?",
    },
    {
      id: 6,
      part: 2,
      type: "audio",
      section: "Listening",
      question: "Listen to the question and three responses.",
      options: ["The flight leaves at 9 AM", "Gate 23", "I'll check the schedule"],
      audio: "/audio/part2-3.mp3",
      transcript: "Which gate is our flight departing from?",
    },

    // Part 3: Conversations (3 questions)
    {
      id: 7,
      part: 3,
      type: "conversation",
      section: "Listening",
      question: "What is the conversation mainly about?",
      options: ["Planning a business meeting", "Discussing a project deadline", "Arranging office furniture", "Scheduling a conference call"],
      audio: "/audio/part3-1.mp3",
      transcript: "Man: We need to reschedule the client meeting.\nWoman: When would be a good time?\nMan: How about next Tuesday?\nWoman: Let me check my calendar.",
    },
    {
      id: 8,
      part: 3,
      type: "conversation",
      section: "Listening",
      question: "What will the woman probably do next?",
      options: ["Check her schedule", "Call the client", "Prepare a presentation", "Book a meeting room"],
      audio: "/audio/part3-1.mp3",
      transcript: "Same conversation as above",
    },
    {
      id: 9,
      part: 3,
      type: "conversation",
      section: "Listening",
      question: "When will they likely meet?",
      options: ["Next Tuesday", "This Friday", "Next month", "Tomorrow morning"],
      audio: "/audio/part3-1.mp3",
      transcript: "Same conversation as above",
    },

    // Part 4: Short Talks (3 questions)
    {
      id: 10,
      part: 4,
      type: "talk",
      section: "Listening",
      question: "What is the announcement about?",
      options: ["A new company policy", "An upcoming event", "Office renovation", "Staff changes"],
      audio: "/audio/part4-1.mp3",
      transcript: "Attention all employees. Starting next week, we will begin renovations on the third floor...",
    },
    {
      id: 11,
      part: 4,
      type: "talk",
      section: "Listening",
      question: "When will the changes take effect?",
      options: ["Next week", "Next month", "Immediately", "In two weeks"],
      audio: "/audio/part4-1.mp3",
      transcript: "Same talk as above",
    },
    {
      id: 12,
      part: 4,
      type: "talk",
      section: "Listening",
      question: "What should employees do to prepare?",
      options: ["Clear their desks", "Attend a meeting", "Update their schedules", "Contact IT support"],
      audio: "/audio/part4-1.mp3",
      transcript: "Same talk as above",
    },

    // Part 5: Incomplete Sentences (3 questions)
    {
      id: 13,
      part: 5,
      type: "sentence",
      section: "Reading",
      question: "The new software has significantly _____ the efficiency of our data processing system.",
      options: ["improve", "improves", "improved", "improving"],
    },
    {
      id: 14,
      part: 5,
      type: "sentence",
      section: "Reading",
      question: "_____ the economic downturn, the company managed to maintain its market position.",
      options: ["Despite", "However", "Although", "Nevertheless"],
    },
    {
      id: 15,
      part: 5,
      type: "sentence",
      section: "Reading",
      question: "The conference room is _____ for the client meeting next week.",
      options: ["reserve", "reserved", "reserving", "reserves"],
    },

    // Part 6: Text Completion (3 questions)
    {
      id: 16,
      part: 6,
      type: "text_completion",
      section: "Reading",
      question: "Dear valued customer, We are writing to inform you _____ changes to our service policy.",
      options: ["of", "for", "about", "with"],
    },
    {
      id: 17,
      part: 6,
      type: "text_completion",
      section: "Reading",
      question: "These changes will _____ effect from January 1st.",
      options: ["take", "make", "do", "get"],
    },
    {
      id: 18,
      part: 6,
      type: "text_completion",
      section: "Reading",
      question: "Please do not _____ to contact us if you have any questions.",
      options: ["hesitate", "hesitates", "hesitating", "hesitated"],
    },

    // Part 7: Reading Comprehension (3 questions)
    {
      id: 19,
      part: 7,
      type: "reading",
      section: "Reading",
      question: "According to the email, what is the main purpose of the company meeting?",
      options: ["To discuss quarterly results", "To announce new management", "To review project timelines", "To introduce new policies"],
    },
    {
      id: 20,
      part: 7,
      type: "reading",
      section: "Reading",
      question: "When will the meeting take place?",
      options: ["Next Monday", "This Friday", "Tomorrow morning", "Next week"],
    },
    {
      id: 21,
      part: 7,
      type: "reading",
      section: "Reading",
      question: "What should employees bring to the meeting?",
      options: ["Their laptops", "Project reports", "Department budgets", "Nothing specific"],
    },
  ];

  const listeningQuestions = questions.filter(q => q.section === "Listening");
  const readingQuestions = questions.filter(q => q.section === "Reading");

  return {
    id: testId,
    name: `TOEIC Test ${testId}`,
    sections: [
      {
        name: "Listening",
        time: 2700, // 45 minutes in seconds
        questions: listeningQuestions,
      },
      {
        name: "Reading",
        time: 4500, // 75 minutes in seconds
        questions: readingQuestions,
      },
    ],
  };
}; 