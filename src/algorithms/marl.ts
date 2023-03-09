// Initialize the Q-value function for each agent
let qValues: any = [
  { '0': 0, '1': 0 },
  { '0': 0, '1': 0 },
];

// Set the learning rate and discount factor
const alpha = 0.1;
const gamma = 0.9;

// Define the reward function
function reward(agent: any, action: any, consensus: any) {
  if (consensus === action) {
    return 1;
  } else {
    return 0;
  }
}

// Define the update function for each agent
function update(agent: number, action: number, consensus: number) {
  const rewardValue = reward(agent, action, consensus);
  const maxQ = Math.max(qValues[1 - agent][0], qValues[1 - agent][1]);
  const currentQ = qValues[agent][action];
  const newQ = (1 - alpha) * currentQ + alpha * (rewardValue + gamma * maxQ);
  qValues[agent][action] = newQ;
}

// Define the action selection function for each agent
function selectAction(agent: number, consensus: number) {
  const q0 = qValues[agent][0];
  const q1 = qValues[agent][1];
  const epsilon = 0.1;
  if (Math.random() < epsilon) {
    return Math.floor(Math.random() * 2);
  } else {
    if (q0 > q1) {
      return 0;
    } else if (q1 > q0) {
      return 1;
    } else {
      return Math.floor(Math.random() * 2);
    }
  }
}

// Define the main function that runs the MARL algorithm
export function runMARL() {
  // Set the initial consensus value
  let consensus = Math.floor(Math.random() * 2);

  // Loop for a fixed number of iterations
  const numIterations = 1000;
  for (let i = 0; i < numIterations; i++) {
    // Select actions for each agent
    const actions = [selectAction(0, consensus), selectAction(1, consensus)];

    // Update Q-values for each agent
    update(0, actions[0], consensus);
    update(1, actions[1], consensus);

    // Update the consensus value based on the actions
    if (actions[0] === actions[1]) {
      consensus = actions[0];
    } else {
      consensus = Math.floor(Math.random() * 2);
    }
  }

  // Return the final Q-values and consensus value
  return { qValues, consensus };
}
