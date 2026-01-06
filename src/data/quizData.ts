export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface ModuleQuiz {
  moduleId: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
  xpReward: number;
  passingScore: number; // percentage needed to pass
}

export const quizData: ModuleQuiz[] = [
  {
    moduleId: 1,
    title: "Recycling Basics Quiz",
    description: "Test your knowledge on proper recycling practices",
    xpReward: 100,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "Which of these items can typically be recycled in most curbside programs?",
        options: ["Plastic bags", "Aluminum cans", "Styrofoam containers", "Greasy pizza boxes"],
        correctAnswer: 1,
        explanation: "Aluminum cans are widely accepted in recycling programs and can be recycled indefinitely without losing quality."
      },
      {
        id: 2,
        question: "What should you do before recycling a peanut butter jar?",
        options: ["Nothing, just toss it in", "Rinse it out", "Remove the label", "Crush it flat"],
        correctAnswer: 1,
        explanation: "Containers should be rinsed to remove food residue, which can contaminate other recyclables."
      },
      {
        id: 3,
        question: "Which recycling symbol number indicates the most recyclable plastic?",
        options: ["#1 (PET)", "#3 (PVC)", "#6 (PS)", "#7 (Other)"],
        correctAnswer: 0,
        explanation: "#1 PET plastics are the most commonly recycled and accepted by most programs."
      },
      {
        id: 4,
        question: "What is 'wishcycling'?",
        options: [
          "Recycling while making a wish",
          "Putting non-recyclables in recycling hoping they'll be recycled",
          "Donating items to charity",
          "Composting food waste"
        ],
        correctAnswer: 1,
        explanation: "Wishcycling contaminates recycling streams and can cause entire batches to be sent to landfills."
      },
      {
        id: 5,
        question: "How many times can glass be recycled?",
        options: ["Once", "5 times", "10 times", "Infinitely"],
        correctAnswer: 3,
        explanation: "Glass can be recycled endlessly without losing quality or purity."
      }
    ]
  },
  {
    moduleId: 2,
    title: "Energy Efficiency Quiz",
    description: "How well do you know energy-saving techniques?",
    xpReward: 150,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "What is the most energy-efficient type of light bulb?",
        options: ["Incandescent", "Halogen", "CFL", "LED"],
        correctAnswer: 3,
        explanation: "LEDs use up to 90% less energy than incandescent bulbs and last much longer."
      },
      {
        id: 2,
        question: "What temperature should you set your thermostat to in winter for optimal efficiency?",
        options: ["75°F (24°C)", "68°F (20°C)", "78°F (26°C)", "62°F (17°C)"],
        correctAnswer: 1,
        explanation: "68°F is the recommended temperature for comfort while saving energy. Lower it further when away or sleeping."
      },
      {
        id: 3,
        question: "Which appliance typically uses the most energy in a home?",
        options: ["Refrigerator", "TV", "Heating/Cooling system", "Washing machine"],
        correctAnswer: 2,
        explanation: "HVAC systems account for about 50% of home energy use."
      },
      {
        id: 4,
        question: "What is 'phantom load' or 'vampire power'?",
        options: [
          "Power used by haunted houses",
          "Energy consumed by devices when turned off but plugged in",
          "Solar power at night",
          "Emergency backup power"
        ],
        correctAnswer: 1,
        explanation: "Phantom load can account for 5-10% of home energy use. Use power strips to easily cut power."
      },
      {
        id: 5,
        question: "When is the best time to run major appliances for energy efficiency?",
        options: ["Morning rush hour", "Midday", "Off-peak hours (night/early morning)", "Anytime"],
        correctAnswer: 2,
        explanation: "Running appliances during off-peak hours reduces strain on the grid and often costs less."
      }
    ]
  },
  {
    moduleId: 3,
    title: "Sustainable Shopping Quiz",
    description: "Master eco-conscious consumer choices",
    xpReward: 200,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "What does the term 'food miles' refer to?",
        options: [
          "Calories in food",
          "Distance food travels from farm to consumer",
          "How far you drive to the grocery store",
          "Expiration date range"
        ],
        correctAnswer: 1,
        explanation: "Lower food miles generally means less transportation emissions and fresher products."
      },
      {
        id: 2,
        question: "Which certification indicates a product was made with sustainable forestry practices?",
        options: ["USDA Organic", "FSC", "Energy Star", "Fair Trade"],
        correctAnswer: 1,
        explanation: "FSC (Forest Stewardship Council) certification ensures responsible forest management."
      },
      {
        id: 3,
        question: "What is the most sustainable shopping bag option?",
        options: [
          "New paper bag each trip",
          "New plastic bag each trip",
          "Reusable bag used many times",
          "Biodegradable plastic bag"
        ],
        correctAnswer: 2,
        explanation: "Reusable bags have the lowest impact when used consistently over many shopping trips."
      },
      {
        id: 4,
        question: "Which practice is part of 'fast fashion'?",
        options: [
          "Buying quality clothes that last",
          "Purchasing cheap trendy items frequently",
          "Shopping at thrift stores",
          "Repairing old clothes"
        ],
        correctAnswer: 1,
        explanation: "Fast fashion contributes to massive waste and poor labor conditions. Choose quality over quantity."
      },
      {
        id: 5,
        question: "What does 'buying in bulk' help reduce?",
        options: ["Product quality", "Packaging waste", "Product freshness", "Shopping convenience"],
        correctAnswer: 1,
        explanation: "Bulk buying reduces packaging waste per unit of product purchased."
      }
    ]
  },
  {
    moduleId: 4,
    title: "Water Conservation Quiz",
    description: "Test your water-saving knowledge",
    xpReward: 100,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "How many gallons does a typical 10-minute shower use?",
        options: ["5 gallons", "10 gallons", "20-25 gallons", "50 gallons"],
        correctAnswer: 2,
        explanation: "Standard showerheads use about 2.5 gallons per minute. Low-flow heads can cut this in half."
      },
      {
        id: 2,
        question: "Which uses less water: taking a short shower or a full bath?",
        options: ["Bath always uses less", "5-minute shower uses less", "They use the same", "It depends on the tub size only"],
        correctAnswer: 1,
        explanation: "A 5-minute shower uses about 12-15 gallons vs. 35-50 gallons for a bath."
      },
      {
        id: 3,
        question: "When is the best time to water your lawn?",
        options: ["Midday when it's hottest", "Early morning", "Late afternoon", "Midnight"],
        correctAnswer: 1,
        explanation: "Early morning watering reduces evaporation and allows grass to dry before nightfall."
      },
      {
        id: 4,
        question: "A dripping faucet can waste how much water per year?",
        options: ["10 gallons", "100 gallons", "3,000+ gallons", "Less than 1 gallon"],
        correctAnswer: 2,
        explanation: "Even a slow drip can waste over 3,000 gallons annually. Fix leaks promptly!"
      },
      {
        id: 5,
        question: "Which is more water-efficient for dishes?",
        options: [
          "Hand washing with running water",
          "Full dishwasher load",
          "Hand washing in a half-full sink",
          "Rinsing before dishwasher"
        ],
        correctAnswer: 1,
        explanation: "Modern dishwashers use less water than hand washing, especially when fully loaded."
      }
    ]
  }
];

export const getQuizByModuleId = (moduleId: number): ModuleQuiz | undefined => {
  return quizData.find(quiz => quiz.moduleId === moduleId);
};
