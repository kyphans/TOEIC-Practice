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
  correct_answer?: string;
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
    // Part 5: Incomplete Sentences (3 questions)
    {
      "id": 101,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "The unexpected surge in the prices of steel and other minerals will result in a dramatic increase in tax _______ this year.",
      "options": ["rates", "charges", "expenses", "revenues"],
      "correct_answer": "revenues"
    },
    {
      "id": 102,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "The director _______ has often been seen to take his lunch in the staff canteen along with the other workers.",
      "options": ["he", "his", "himself", "he"],
      "correct_answer": "himself"
    },
    {
      "id": 103,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "_______ you are no doubt aware, the new security system requires the installation of a backup power source in case an emergency situation arises.",
      "options": ["As", "For", "With", "So"],
      "correct_answer": "As"
    },
    {
      "id": 107,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "ABC Shoe Store asked _______ to make their final selections and bring them to cashiers’ stations within 30 minutes.",
      "options": ["a shopper", "shopping", "to shop", "shoppers"],
      "correct_answer": "shoppers"
    },
    {
      "id": 108,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Naturally, our company utilizes the production process _______ guarantees the most satisfactory results.",
      "options": ["that", "who", "what", "how"],
      "correct_answer": "how"
    },
    {
      "id": 109,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "As you would expect at one of the world’s most reputable hotels, the _______ is prompt, efficient, and discreet.",
      "options": ["exertion", "decision", "challenge", "service"],
      "correct_answer": "service"
    },
    {
      "id": 110,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "_______ the recent sales campaign was not as successful as we had expected, our new range of goods has been well reviewed by consumer groups.",
      "options": ["Instead of", "Notwithstanding", "Although", "Whereas"],
      "correct_answer": "Although"
    },
    {
      "id": 111,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Once you have familiarized yourself with the basic commands, we can begin to learn some of this program’s more creative features.",
      "options": ["By now", "Before", "Once", "Earlier"],
      "correct_answer": "Once"
    },
    {
      "id": 112,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Several exciting new pieces of equipment ——— in our gymnasium, and we invite you to come and try them out at no cost during the next week.",
      "options": ["installing", "installed", "have install", "have been installed"],
      "correct_answer": "have been installed"
    },
    {
      "id": 113,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "DMC publishing company will be checking the article ——— mistakes and edit it before printing.",
      "options": ["barring", "over", "for", "from"],
      "correct_answer": "for"
    },
    {
      "id": 114,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "The giant pharmaceutical company insists that its new drug is ——— safe as long as it used under the supervision of a doctor.",
      "options": ["perfect", "perfection", "perfectly", "perfecting"],
      "correct_answer": "perfectly"
    },
    {
      "id": 115,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "After a highly profitable first six months, the restaurant’s profits for the second half of the year were a great ———.",
      "options": ["disappointing", "disappointed", "disappointment", "disappointment"],
      "correct_answer": "disappointment"
    },
    {
      "id": 116,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "The sudden rainstorm arrived ———, leaving a trail of damage which many predict will take some time to repair.",
      "options": ["unexpected", "unexpectant", "unexpectedly", "unexpectedness"],
      "correct_answer": "unexpectedly"
    },
    {
      "id": 117,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "___________ in computer technology have allowed technicians to perform multi-dimensional graphics far better than ever before.",
      "options": ["Advance", "Advancing", "Advancement", "Advances"],
      "correct_answer": "Advances"
    },
    {
      "id": 118,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Although the ——— for the best design will be very fierce, Mr. Gozalas has a good chance of getting the award.",
      "options": ["competitively", "competitive", "compete", "competition"],
      "correct_answer": "competition"
    },
    {
      "id": 119,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "The new head of marketing is already making his mark on the company even though he only ——— 6 weeks ago.",
      "options": ["carried", "elapsed", "functioned", "arrived"],
      "correct_answer": "arrived"
    },
    {
      "id": 120,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Numerous speakers came forward to express their gratitude ——— the retiring secretary’s unfailing courtesy and efficiency.",
      "options": ["for", "at", "to", "with"],
      "correct_answer": "for"
    },
    {
      "id": 121,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Company strategists ——— predicted that conditions in the Middle East would eventually stabilize and result in expanded sales.",
      "options": ["wrong", "wronged", "wrongly", "wrongness"],
      "correct_answer": "wrongly"
    },
    {
      "id": 122,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Rexington Engineering has recently set up an entire new research ——— because of the increasing interest in robotic technology.",
      "options": ["separation", "partition", "segmentation", "division"],
      "correct_answer": "division"
    },
    {
      "id": 123,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Please read the ——— passages carefully, and then answer the multiple choice questions below within the time allotted.",
      "options": ["consecutive", "constant", "following", "subsequent"],
      "correct_answer": "following"
    },
    {
      "id": 124,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "The chief financial officer believes that we should maintain the present course, and ——— his deputy.",
      "options": ["as to", "whereas", "as does", "as long as"],
      "correct_answer": "as does"
    },
    {
      "id": 125,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Once you have paid the appropriate student fees, you will be able to ——— the medical, recreational, and other facilities.",
      "options": ["access", "accessed", "accessory"],
      "correct_answer": "access"
    },
    {
      "id": 126,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "——— good evaluations from their immediate bosses should be the main objective of those who wish to be promoted this year.",
      "options": ["Attain", "Attained", "Attaining", "Attainable"],
      "correct_answer": "Attaining"
    },
    {
      "id": 127,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Although he did not perform ——— well as a student, he went on to become one of the most respected scholars in his field.",
      "options": ["efficiently", "sufficiently", "desperately", "excellently"],
      "correct_answer": "excellently"
    },
    {
      "id": 128,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "One of the leading companies, Big Star agreed to buy ——— Get-Well drug company for 10 billion dollars.",
      "options": ["rival", "compromising", "renewed", "competing"],
      "correct_answer": "rival"
    },
    {
      "id": 129,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "While we still take telephone calls, other ——— of correspondence are encouraged to avoid tying up telephone lines unnecessarily.",
      "options": ["profiles", "views", "outlines", "forms"],
      "correct_answer": "forms"
    },
    {
      "id": 130,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Because there were too many participants at the seminar, we should ——— into smaller groups for discussion.",
      "options": ["disable", "division", "dividing", "divide"],
      "correct_answer": "divide"
    },
    {
      "id": 131,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "The Department of Social Welfare’s report this year indicated that it is focusing ——— on the homeless and long-term unemployed.",
      "options": ["distinctly", "individually", "exceptionally", "particularly"],
      "correct_answer": "particularly"
    },
    {
      "id": 132,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Consultation with the appropriate experts is essential if we are to arrive at an ——— decision.",
      "options": ["informed", "obtained", "enlightened", "acquainted"],
      "correct_answer": "informed"
    },
    {
      "id": 133,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "It is true that the number of traffic accidents involving cyclists has increased ——— over the last 10 years.",
      "options": ["prosperously", "incidentally", "significantly", "adequately"],
      "correct_answer": "significantly"
    },
    {
      "id": 134,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "The Department of the Environment supports the replacement of introduced plants with ——— plants that require much less watering.",
      "options": ["native", "natively", "nativity", "nativeness"],
      "correct_answer": "native"
    },
    {
      "id": 135,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Ms. Julie Kennedy and her innovative marketing team have gained renown for creating ——— products for struggling companies.",
      "options": ["promote", "promotes", "promotion", "promotional"],
      "correct_answer": "promotional"
    },
    {
      "id": 136,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "All drivers are required to maintain ——— logbooks accurately and to hand them in to the central office before leaving on holiday night.",
      "options": ["his", "its", "our", "their"],
      "correct_answer": "their"
    },
    {
      "id": 137,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Under more ——— circumstances, the CEO would have approved the pay increases, but this year it was not possible.",
      "options": ["favorable", "favorably", "favor", "favorite"],
      "correct_answer": "favorable"
    },
    {
      "id": 138,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Electron Recycling has developed a profitable business by recycling metals retrieved from ——— electronic components.",
      "options": ["discarded", "extended", "unoccupied", "suppressed"],
      "correct_answer": "discarded"
    },
    {
      "id": 139,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "An independent investigator ——— a report on the company’s financial operations which, for some unknown reason,was never released.",
      "options": ["combined", "confirmed", "compiled", "converted"],
      "correct_answer": "compiled"
    },
    {
      "id": 140,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "The upcoming convention invites ——— from anyone working or having research interests in the field.",
      "options": ["contributions", "contribute", "contributed", "contributes"],
      "correct_answer": "contributions"
    },
    {
      "id": 141,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Health inspections are conducted _______ at restaurants throughout the province for the purpose of maintaining high standards of hygiene.",
      "options": ["extremely", "marginally", "every", "routinely"],
      "correct_answer": "routinely"
    },
    {
      "id": 142,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Students can _______ in the university’s education program starting July 6th.",
      "options": ["enroll", "admit", "apply", "subscribe"],
      "correct_answer": "enroll"
    },
    {
      "id": 143,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "The secretary filling in at the reception desk has been performing so well that management is considering offering her a _______ position.",
      "options": ["durable", "periodic", "binding", "permanent"],
      "correct_answer": "permanent"
    },
    {
      "id": 144,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "_______ we hire more factory workers, we cannot meet the deadline for the products on time.",
      "options": ["Unless", "Also", "Except", "Therefore"],
      "correct_answer": "Unless"
    },
    {
      "id": 145,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "The Technical Department is currently formulating written guidelines _______ the use of our micro-publishing facilities.",
      "options": ["in", "for", "at", "with"],
      "correct_answer": "for"
    },
    {
      "id": 146,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "According to the sign posted in front of the main office, the repair center is now _______ new management.",
      "options": ["over", "around", "between", "under"],
      "correct_answer": "under"
    },
    {
      "id": 147,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Maurice Robertson, _______ an executive at a small company, became the CEO of Bradshaw Industries four months ago.",
      "options": ["once", "often", "soon", "now"],
      "correct_answer": "once"
    },
    {
      "id": 148,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "_______ leaving school, she has worked in a variety of positions but has not yet found one which suits her talents or interests.",
      "options": ["Despite", "Since", "In spite of", "If"],
      "correct_answer": "Since"
    },
    {
      "id": 149,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "This is an excellent time to consider changing jobs because of the large number of positions _______ available in the mining sector.",
      "options": ["commonly", "currently", "actively", "approvingly"],
      "correct_answer": "currently"
    },
    {
      "id": 150,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "The waitress said there weren’t any tables open, but she would call my name once one became _______.",
      "options": ["availability", "availably", "avail", "available"],
      "correct_answer": "available"
    },
    {
      "id": 151,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "_______ wanting to apply for maternity leave should let their immediate supervisor know about their plans at least one month in advance.",
      "options": ["Them", "That", "Else", "Those"],
      "correct_answer": "Those"
    },
    {
      "id": 152,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "A light and healthy lunch followed by some exercise will make workers _______ more productive in the afternoon.",
      "options": ["complete", "much", "ample", "greatly"],
      "correct_answer": "greatly"
    },
    {
      "id": 153,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "It is becoming _______ more difficult to find designers who are familiar with this software.",
      "options": ["progress", "progressive", "progression", "progressively"],
      "correct_answer": "progressively"
    },
    {
      "id": 154,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "To gain access to confidential company documents, employees require _______ from the operations manager.",
      "options": ["clear", "clearly", "clearance", "clearance"],
      "correct_answer": "clearance"
    },
    {
      "id": 155,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Actually, the Department of Transportation is responsible _______ approving roadwork permits in the county.",
      "options": ["by", "to", "at", "for"],
      "correct_answer": "for"
    },
    {
      "id": 156,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Analysts regarded the _______ between the construction giants a win-win situation for both companies.",
      "options": ["factor", "management", "authority", "alliance"],
      "correct_answer": "alliance"
    },
    {
      "id": 157,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "After the earthquake, the building was _______ unsafe since its foundation was badly damaged.",
      "options": ["maximised", "erected", "arranged", "declared"],
      "correct_answer": "declared"
    },
    {
      "id": 158,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "For such a large building project, you’ll need to take out a massive loan to raise the necessary_______.",
      "options": ["assistance", "timeline", "institution", "capital"],
      "correct_answer": "capital"
    },
    {
      "id": 159,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "In next month’s issue, we _______ coupons was offering a steep discount for new subscriptions only.",
      "options": ["were inserting", "have been inserted", "had inserted", "will be inserting"],
      "correct_answer": "will be inserting"
    },
    {
      "id": 160,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Please place your luggage in the overhead locker, and ensure that the locker is closed _______.",
      "options": ["secure", "securely", "securable"],
      "correct_answer": "securely"
    },
    {
      "id": 161,
      "part": 5,
      "type": "sentence",
      "section": "Reading",
      "question": "Ms. Harris was extremely _______ to take an opportunity to thank you for all of the hard-working and dedication.",
      "options": ["happy", "happily", "happier", "happiness"],
      "correct_answer": "happily"
    }
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