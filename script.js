// select dom elements

const matchContainerElement = document.getElementById("score-container");
const addMatchElement = document.getElementById("add-match");
const resetBtnElement = document.getElementById("reset");

// initial state

const initialState = {
  matches: [
    {
      id: 1,
      value: 0,
      increaseBy: 0,
      defaultValue: 0,
    },
  ],
};

//match template with id

const getMatchHTMLStringWithId = (id) =>
  `<div class="match" id="match-${id}">
  <div class="wrapper">
    <button class="lws-delete"">
      <img src="./image/delete.svg" alt="" />
    </button>
    <h3 class="lws-matchName">Match ${id.split("-")[1]}</h3>
  </div>
  <div class="inc-dec">
    <form class="incrementForm">
      <h4>Increment</h4>
      <input type="number" name="increment" class="lws-increment" id="increment-${id}" />
    </form>
    <form class="decrementForm">
      <h4>Decrement</h4>
      <input type="number" name="decrement" class="lws-decrement" id="decrement-${id}" />
    </form>
  </div>
  <div class="numbers">
    <h2 class="lws-singleResult" id="match-value-${id}">120</h2>
  </div>
</div>`;

// action creators increment

const increment = (match, incrementBy) => {
  return {
    type: "increment",
    payload: match,
    incrementBy,
  };
};

// action creators decrement

const decrement = (match, decrementBy) => {
  return {
    type: "decrement",
    payload: match,
    decrementBy,
  };
};

// Add new match

const addMatch = (match) => {
  return {
    type: "addMatch",
    payload: match,
  };
};

// Reset all matches
const resetMatches = () => {
  return {
    type: "resetMatch",
  };
};

// create reducer function

function matchReducer(state = initialState, action) {
  if (action.type === "increment") {
    return {
      ...state,
      matches: state.matches.map((match) =>
        match.id === action.payload.id
          ? { ...match, value: match.value + action.incrementBy }
          : { ...match }
      ),
    };
  } else if (action.type === "decrement") {
    return {
      ...state,
      matches: state.matches.map((match) =>
        match.id === action.payload.id
          ? {
              ...match,
              value:
                match.value - action.decrementBy < 0
                  ? 0
                  : match.value - action.decrementBy,
            }
          : { ...match }
      ),
    };
  } else if (action.type === "addMatch") {
    return {
      ...state,
      matches: [
        ...state.matches,
        {
          id: state.matches.length + 1,
          value: action.payload.defaultValue,
          ...action.payload,
        },
      ],
    };
  } else if (action.type === "resetMatch") {
    return {
      ...state,
      matches: state.matches.map((match) => ({
        ...match,
        value: match.defaultValue,
      })),
    };
  } else {
    return state;
  }
}

// create store

const store = Redux.createStore(matchReducer);

// render ui

const render = () => {
  const state = store.getState();
  state.matches.forEach((match, i) => {
    if (!document.getElementById(`${match}-div-${match.id}-{i}`)) {
      const element = document.createElement("div");
      element.setAttribute("id", `${match}-div-${match.id}-{i}`);
      element.innerHTML = getMatchHTMLStringWithId(`${i}-${match.id}`);
      matchContainerElement.insertAdjacentElement("beforeend", element);
      const incrementElement = document.getElementById(
        `increment-${i}-${match.id}`
      );
      const decrementElement = document.getElementById(
        `decrement-${i}-${match.id}`
      );
      incrementElement.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (e.target.value > 0) {
            store.dispatch(increment(match, parseInt(e.target.value)));
            e.target.value = "";
          } else {
            alert(
              "Invalid value received, make sure to enter only positive numbers"
            );
          }
        }
      });
      decrementElement.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (e.target.value > 0) {
            store.dispatch(decrement(match, parseInt(e.target.value)));
            e.target.value = "";
          } else {
            alert(
              "Invalid value received, make sure to enter only positive numbers"
            );
          }
        }
      });
    }

    const matchValueElement = document.getElementById(
      `match-value-${i}-${match.id}`
    );
    matchValueElement.innerHTML = match.value;
  });
};

// render UI on load

render();

addMatchElement.addEventListener("click", () => {
  store.dispatch(
    addMatch({
      defaultValue: 0,
      increaseBy: 0,
    })
  );
});
resetBtnElement.addEventListener("click", () => {
  store.dispatch(resetMatches());
});

// subscribe to store

store.subscribe(render);
