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
  timeLimitMinutes?: number | null; // optional time limit in minutes
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
  },
  {
    moduleId: 5,
    title: "Green Home Quiz",
    description: "Transform your living space sustainably",
    xpReward: 250,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "What is the most effective way to improve home energy efficiency?",
        options: ["Smart thermostat", "Proper insulation", "Solar panels", "Energy-efficient appliances"],
        correctAnswer: 1,
        explanation: "Proper insulation prevents heat loss/gain and can reduce energy bills by up to 20%."
      },
      {
        id: 2,
        question: "Which indoor plants are best for air purification?",
        options: ["Cacti", "Snake plants and pothos", "Orchids", "Succulents"],
        correctAnswer: 1,
        explanation: "Snake plants and pothos are excellent at removing toxins and producing oxygen."
      },
      {
        id: 3,
        question: "What is VOC and why should you avoid it?",
        options: [
          "A type of energy rating",
          "Volatile Organic Compounds found in paints that harm air quality",
          "A sustainable building material",
          "A water filtration method"
        ],
        correctAnswer: 1,
        explanation: "VOCs are harmful chemicals that off-gas from paints, furniture, and cleaners. Choose low-VOC products."
      },
      {
        id: 4,
        question: "Which window treatment is most energy-efficient?",
        options: ["Sheer curtains", "Cellular/honeycomb shades", "Venetian blinds", "No window coverings"],
        correctAnswer: 1,
        explanation: "Cellular shades trap air in pockets, providing excellent insulation year-round."
      },
      {
        id: 5,
        question: "What percentage of home water use typically goes to outdoor irrigation?",
        options: ["10%", "20%", "30-50%", "5%"],
        correctAnswer: 2,
        explanation: "Outdoor watering uses 30-50% of household water. Consider drought-resistant landscaping."
      }
    ]
  },
  {
    moduleId: 6,
    title: "Eco Transportation Quiz",
    description: "Sustainable ways to get around",
    xpReward: 150,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "Which mode of transportation has the lowest carbon footprint per passenger mile?",
        options: ["Electric car", "Bus", "Bicycle", "Train"],
        correctAnswer: 2,
        explanation: "Bicycles produce zero direct emissions and have minimal manufacturing impact."
      },
      {
        id: 2,
        question: "At what speed do most cars achieve optimal fuel efficiency?",
        options: ["25-35 mph", "45-65 mph", "70-80 mph", "As fast as possible"],
        correctAnswer: 1,
        explanation: "Most vehicles achieve best fuel economy between 45-65 mph. Efficiency drops significantly above 65 mph."
      },
      {
        id: 3,
        question: "How much CO2 can you save annually by working from home 2 days a week?",
        options: ["50 pounds", "200 pounds", "500-1000 pounds", "2000+ pounds"],
        correctAnswer: 2,
        explanation: "Reducing commuting by 40% can save 500-1000+ pounds of CO2 annually depending on distance."
      },
      {
        id: 4,
        question: "What is 'trip chaining'?",
        options: [
          "Linking multiple errands into one trip",
          "Taking multiple vehicles",
          "Carpooling with strangers",
          "Using GPS navigation"
        ],
        correctAnswer: 0,
        explanation: "Trip chaining combines errands to reduce total miles driven and cold starts."
      },
      {
        id: 5,
        question: "Which driving habit wastes the most fuel?",
        options: ["Using AC on hot days", "Aggressive acceleration and braking", "Driving with windows down", "Using cruise control"],
        correctAnswer: 1,
        explanation: "Aggressive driving can lower fuel economy by 15-30% on highways and 10-40% in traffic."
      }
    ]
  },
  {
    moduleId: 7,
    title: "Sustainable Diet Quiz",
    description: "Eat well for you and the planet",
    xpReward: 200,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "Which food has the highest carbon footprint per kilogram?",
        options: ["Chicken", "Beef", "Pork", "Fish"],
        correctAnswer: 1,
        explanation: "Beef produces 60+ kg CO2 per kg, far more than other proteins due to methane and land use."
      },
      {
        id: 2,
        question: "What percentage of global greenhouse gas emissions come from food systems?",
        options: ["5%", "15%", "25-30%", "50%"],
        correctAnswer: 2,
        explanation: "Food systems account for 25-30% of global emissions including production, transport, and waste."
      },
      {
        id: 3,
        question: "Which practice reduces food waste most effectively?",
        options: [
          "Buying in bulk always",
          "Meal planning and proper storage",
          "Only buying canned goods",
          "Eating out more often"
        ],
        correctAnswer: 1,
        explanation: "Meal planning prevents overbuying, and proper storage extends food freshness."
      },
      {
        id: 4,
        question: "What does 'eating seasonally' help reduce?",
        options: ["Food taste", "Transportation emissions and energy for storage", "Nutritional value", "Meal variety"],
        correctAnswer: 1,
        explanation: "Seasonal produce requires less transportation and energy-intensive greenhouse growing or cold storage."
      },
      {
        id: 5,
        question: "How much of global food production is wasted each year?",
        options: ["5%", "10%", "One-third", "Half"],
        correctAnswer: 2,
        explanation: "About 1/3 of all food produced globally is lost or wasted, equaling 1.3 billion tons annually."
      }
    ]
  },
  {
    moduleId: 8,
    title: "Zero Waste Living Quiz",
    description: "Master the art of waste-free living",
    xpReward: 300,
    passingScore: 70,
    questions: [
      {
        id: 1,
        question: "What are the '5 Rs' of zero waste in order of priority?",
        options: [
          "Recycle, Reduce, Reuse, Rot, Refuse",
          "Refuse, Reduce, Reuse, Recycle, Rot",
          "Reduce, Refuse, Recycle, Reuse, Rot",
          "Reuse, Reduce, Refuse, Rot, Recycle"
        ],
        correctAnswer: 1,
        explanation: "Refuse what you don't need, Reduce what you do, Reuse, Recycle, and Rot (compost) the rest."
      },
      {
        id: 2,
        question: "How long does a plastic bottle take to decompose?",
        options: ["10 years", "50 years", "450+ years", "1000 years"],
        correctAnswer: 2,
        explanation: "Plastic bottles take 450+ years to decompose, and even then they become microplastics."
      },
      {
        id: 3,
        question: "What is a 'circular economy'?",
        options: [
          "An economy based on circles",
          "A system where resources are reused and recycled indefinitely",
          "A type of stock market",
          "Local-only purchasing"
        ],
        correctAnswer: 1,
        explanation: "A circular economy eliminates waste by keeping materials in use through reuse, repair, and recycling."
      },
      {
        id: 4,
        question: "Which bathroom swap has the biggest environmental impact?",
        options: ["Bamboo toothbrush", "Shampoo bars", "Safety razor instead of disposable", "All have similar impact"],
        correctAnswer: 2,
        explanation: "Safety razors eliminate billions of disposable razors from landfills and last decades."
      },
      {
        id: 5,
        question: "What percentage of textile waste could be recycled or reused?",
        options: ["25%", "50%", "75%", "95%"],
        correctAnswer: 3,
        explanation: "Up to 95% of textiles can be recycled or reused, yet most end up in landfills."
      }
    ]
  }
];

export const getQuizByModuleId = (moduleId: number): ModuleQuiz | undefined => {
  return quizData.find(quiz => quiz.moduleId === moduleId);
};
