const playerContainer = document.getElementById("all-players-container");
playerContainer.style.display = "flex";
playerContainer.style.flexDirection = "row";
playerContainer.style.flexWrap = "wrap";
playerContainer.style.justifyContent = "space-around";
playerContainer.style.marginTop = "12%";
playerContainer.style.marginLeft = "8%";
playerContainer.style.marginRight = "8%";
playerContainer.style.marginBottom = "10%";
const newPlayerFormContainer = document.getElementById("new-player-form");

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = "2302-acc-pt-web-pt-b";
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */

const fetchAllPlayers = async () => {
  try {

    const response = await fetch(APIURL + "players");
    const playerList = await response.json();
   
    console.log(playerList.data.players);
    return playerList.data.players;
   
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${APIURL}players/${playerId}`);
    const player = await response.json();
    return player;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};
// TeamID - manipulate the TeamId to add puppies only relevent to our team.
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(APIURL + "players", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(playerObj), // playerWithId
    });
    const addedPlayer = await response.json();
    console.log(addedPlayer);
    return addedPlayer;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

const removePlayer = async (playerId) => {
  try {
    console.log(playerId);
    const response = await fetch(APIURL + "players/" + playerId, {
      method: "DELETE",
    });
    console.log(response);
    return response;
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players.
 *
 * Then it takes that larger string of HTML and adds it to the DOM.
 *
 * It also adds event listeners to the buttons in each player card.
 *
 * The event listeners are for the "See details" and "Remove from roster" buttons.
 *
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player.
 *
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster.
 *
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
// taking list of all players and painting it on the web front
// name, images, ok
// attaching each user an id
// when they click on it, delete based on id
// passing in data fromt he player list
// for each loop will render all data from All Players link

const renderAllPlayers = (playerList) => {
  try {
    const playerContainer = document.querySelector("#all-players-container");
    playerContainer.innerHTML = "";
    playerList.forEach((player) => {
      // If player.teamId is equal to our teamId
      // Encompasses entire code spread here below ->
      if (player.teamId == 398) {
        const playerElement = document.createElement("div");
        playerElement.setAttribute("id", player.id);
        playerElement.classList.add("player");
        playerElement.style.display = "grid";
        playerElement.style.width = "40%";
        playerElement.style.width = "400px";
        playerElement.style.padding = "40px";
        playerElement.innerHTML = `
        <h1>${player.name}</h1>
        <br />
        <br />
    <button class="see-details-button" id="${player.id}">See Player Details</button>
    <button class="delete-button" id="${player.id}">Delete Player</button>
        `;

        playerContainer.appendChild(playerElement);

        // See Details Button
        const detailButton = playerElement.querySelector(".see-details-button");
        detailButton.addEventListener("click", async (event) => {
          try {
            await renderSinglePlayerbyId(event.target.id);
          } catch (error) {}
        });

        // Delete Player Button
        const deleteButton = playerElement.querySelector(".delete-button");
        deleteButton.addEventListener("click", async (event) => {
          try {
            await removePlayer(event.target.id);
            const dogs = await fetchAllPlayers();
            renderAllPlayers(dogs);
          } catch (error) {
            console.error(error);
          }
        });
      }
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering players!", err);
  }
};

const renderSinglePlayerbyId = async (playerId) => {
  try {
    const player = await fetchSinglePlayer(playerId);
    const playerDetails = document.createElement("div");
    playerDetails.classList.add("player-details");
    playerDetails.innerHTML = `
        <h2>${player.data.player.name}</h2>
        <p>${player.data.player.breed}</p>
        <p>${player.data.player.status}</p>
        <img src="${player.data.player.imageUrl}" />
        <button class="close-button">Collapse</button>
        `;
    playerContainer.append(playerDetails);

    //close button below

    const closeButton = await document.querySelector(".close-button");
    closeButton.addEventListener("click", () => {
      playerDetails.remove();
    });
  } catch (error) {
    console.error(error);
  }
};

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * then renders it on the page.
 */

const renderNewPlayerForm = async () => {
  try {
    const form = document.querySelector("#new-player-form");
    form.innerHTML = `
    <form>
      <label> Doggo Name: </label>
      <input type="text" id="name" name="name"><br>
      <label> Doggo Breed: </label>
      <input type="text" id="breed" name="breed"><br>
      <label> Image Source: </label>
      <input type="text" id="img" name="img"><br>
      <button class="add-button" type="submit">Submit</button>
    </form>
    `;

    // New Player Button
    try {
    
      form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const breed = document.getElementById("breed").value;
        const imageUrl = document.getElementById("img").value;

        const newDog = {
          name,
          breed,
          imageUrl,
          teamId: 398,
        };

        await addNewPlayer(newDog);
        const dogs = await fetchAllPlayers();
        renderAllPlayers(dogs);
      });
    } catch {
      console.error("Uh oh, trouble submitting the new player!");
    }
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};


const init = async () => {
  const players = await fetchAllPlayers(); 
  await renderAllPlayers(players); 
  renderNewPlayerForm();
};

init();