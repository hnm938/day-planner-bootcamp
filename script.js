// Planner Block data
const PLANNER_BLOCKS = "planner-container";

// Load all the planner blocks into an array, return empty array if no planner blocks in local storage
const plannerBlockString = localStorage.getItem(PLANNER_BLOCKS);
const plannerBlocks = JSON.parse(plannerBlockString) ?? [];

const today = new Date();

// Init function
function init() {
  // Set header date
  const formattedDate = today.toLocaleDateString("en-CA", { weekday: "long", month: "long", day: "numeric"});
  document.getElementById("header-date").innerHTML = formattedDate.toString();
  
  // Generate blocks
  if (!plannerBlockString) {
    for (let hour = 1; hour < 25; hour++) {
      saveBlockData(
        null,
        "NO TASK SET",
        `${hour % 12 || 12} ${hour <= 12 ? "A.M." : "P.M."}`,
        today.getDate(),
        `${hour <= 12 ? "AM" : "PM"}`
      );
    }
  }

  loadBlocks();
}

// function to load all blocks and their data from local storage
function loadBlocks() {

  // ID of container that holds planner blocks
  const plannerBlockList = document.getElementById(PLANNER_BLOCKS);

  console.log(plannerBlocks);
  plannerBlockList.innerHTML = plannerBlocks.map(
    (data) =>
      `
      <div class="planner-block ${data.classes}" id="${data.id}">
        <div class="planner-block--data">
          <h1 class="planner-block--time">${data.time}</h1>
          <h2 class="planner-block--date">${data.date}</h2>
        </div>
        <input type="text" value="${data.description}" oninput="saveBlockData(this.parentNode.id, this.value, null, null)"></input>
        <div class="planner-block--options">
          <button>Edit</button>
          <button>Clear</button>
        </div>
      </div>`
  ).join("");

  for (let block of plannerBlockList.children) {
    // Check current time to blocks time
    let currentTime = today.getHours() % 12 || 12;
    // Check the current meridiem (if it's AM or PM)
    let currentMeridiem = today.getHours() <= 12 ? "AM" : "PM";
    let blockTime = parseInt(block.querySelector(".planner-block--time").innerHTML);
    
    // Clear all classes
    if (block.classList.contains("current-block")) {
      block.classList.remove("current-block")
    }
    if (block.classList.contains("future-block")) {
      block.classList.remove("future-block");
    }

    // Set active block background as green
    // Check if the times are the same and if the meridiems are matching
    if (blockTime === currentTime && block.classList.contains(currentMeridiem)) {
      // !! All blocks not tagged are assumed to be previous blocks
      // Tag the current block
      block.classList.add("current-block")
      
      // Tag all blocks after current as future blocks
      while ((block = block.nextElementSibling) !== null) {
        if (block.nextElementSibling === null) {
          return block.classList.add("future-block");
        }
        block.classList.add("future-block");
      }
    }
  }
}

// function to save data to a planner block
function saveBlockData(id, desc, time, date, classes) {
  if (id) {
    // Get the existing data
    let currentBlock = localStorage.getItem(PLANNER_BLOCKS);
    let key = null;

    // If no existing data, create an array
    // Otherwise, convert the localStorage string to an array
    currentBlock = currentBlock ? JSON.parse(currentBlock) : {};

    // Find key using block ID
    for (let i = 0; i < currentBlock.length; i++) {
      if (currentBlock[i].id === id) {
        key = i;
        break;
      }
    }

    // Update new data
    const newData = {
      id: id,
      time: currentBlock[key].time,
      date: currentBlock[key].date,
      description: desc,
    };

    // Set and push new data to local storage
    currentBlock[key] = newData;
    localStorage.setItem(PLANNER_BLOCKS, JSON.stringify(currentBlock));

    return;
  }
  // Generate a random ID for each block
  let randId = "x"
    .repeat(6)
    .replace(
      /./g,
      (c) =>
        "abcdefghijklmnopqrstuvwxyz0123456789"[Math.floor(Math.random() * 36)]
    );

  // Create and save new data for a block as a JSON
  const blockData = {
    id: randId,
    date: date,
    time: time,
    description: desc,
    classes: classes,
  };
  // Push the new JSON block data to array
  plannerBlocks.push(blockData);
  // Store array in local storage
  localStorage.setItem(PLANNER_BLOCKS, JSON.stringify(plannerBlocks));
}

window.onload = () => {
  init();
};
