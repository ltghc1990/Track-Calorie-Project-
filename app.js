// local storage controller

// item controller
const itemCtrl = (function () {
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //   data Structure
  const data = {
    item: [{ id: 0, name: "Steak Dinner", calories: 1200 }],

    currentItem: null,
    totalCalories: 0,
  };

  return {
    getItems: function () {
      return data.item;
    },
    addItem: function (name, calories) {
      let ID;
      if (data.item.length > 0) {
        ID = data.item[data.item.length - 1].id + 1;
      } else {
        ID = 0;
      }
      calories = parseInt(calories);
      //   if everything checks out, add it to the data
      newItem = new Item(ID, name, calories);
      data.item.push(newItem);

      return newItem;
    },

    logData: function () {
      return data;
    },
  };
})();

// Ui controller
const UICtrl = (function () {
  return {
    populateItemList: function (items) {
      let html = "";

      items.forEach((item) => {
        html += ` 
            <li id="item-${item.id}" class="list-group-item"
                <strong>${item.name}: </strong> 
                <em>${item.calories}</em>
                <a href="#" class="">
                    <i class="fa fa-pencil"></li>
                </a>
            </li>
        `;
      });
      // append to the parent element
      document.querySelector(".items-parent").innerHTML = html;
    },

    getItemInput: function () {
      return {
        name: document.querySelector("#add-item").value,
        calories: document.querySelector("#add-calories").value,
      };
    },

    addListItem: function (item) {
      const li = document.createElement("li");
      li.classList.add("list-group-item");
      li.id = `item-${item.id}`;
      li.innerHTML = `<strong>${item.name}: </strong>
                        <em>${item.calories} Calories</em>
                        <a href="#" class="">
                            <i class=""></i>
                        </a>`;

      document.querySelector(".items-parent").appendChild(li);
    },

    clearInputValue: function () {
      document.querySelector("#add-item").value = "";
      document.querySelector("#add-calories").value = "";
    },
  };
})();

// app controller
const app = (function (a, b) {
  // load event listeners
  const loadEventListeners = function () {
    document
      .querySelector("#add-meal")
      .addEventListener("click", itemAddSubmit);
  };

  //   functions for event listeners
  const itemAddSubmit = function (e) {
    e.preventDefault();
    // get input from the uictrl
    const input = UICtrl.getItemInput();
    console.log(input);
    if (input.name !== "" && input.calories !== "") {
      // if inputs are valid,  add item to data, newitem variable to be used later
      const newItem = itemCtrl.addItem(input.name, input.calories);
      //   after adding to data, add item to UI list
      UICtrl.addListItem(newItem);
      //   clear the input values
      UICtrl.clearInputValue();
    } else {
      alert("must enter value");
    }
  };

  return {
    init: function () {
      console.log("Init the app, creat data");
      let items = a.getItems();
      console.log(items);
      //   put the items into the ui and show them
      b.populateItemList(items);

      //   load the event listeners
      loadEventListeners();
    },
  };
})(itemCtrl, UICtrl);

app.init();
