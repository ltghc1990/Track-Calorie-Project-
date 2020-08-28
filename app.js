// local storage controller
const StorageCtrl = (function () {
  return {
    storeItems: function (item) {
      let items;
      // check local storage before storing
      if (localStorage.getItem("items") === null) {
        items = [];
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      } else {
        items = JSON.parse(localStorage.getItem("items"));
        items.push(item);
        localStorage.setItem("items", JSON.stringify(items));
      }
    },

    getItems: function () {
      let items;
      if (localStorage.getItem("items") === null) {
        items = [];
      } else {
        items = JSON.parse(localStorage.getItem("items"));
      }

      return items;
    },

    updateItems: function (updateitem) {
      console.log(updateitem);
      items = JSON.parse(localStorage.getItem("items"));
    },

    display: function () {
      let items = this.getItems();
      console.log(items);
    },
  };
})();

// -----------------------ITEM CONTROLLER----------------------
const itemCtrl = (function () {
  const Item = function (id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //   data Structure
  const data = {
    // items: [
    //   { id: 0, name: "Steak Dinner", calories: 1200 },
    //   { id: 1, name: "Pasta", calories: 1000 },
    //   { id: 2, name: "chicken", calories: 600 },
    //   { id: 3, name: "beef", calories: 800 },
    // ],
    items: StorageCtrl.getItems(),
    currentItem: null,
    totalCalories: 0,
  };

  return {
    getItems: function () {
      return data.items;
    },
    addItem: function (name, calories) {
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }
      calories = parseInt(calories);
      //   if everything checks out, add it to the data
      newItem = new Item(ID, name, calories);
      data.items.push(newItem);

      return newItem;
    },

    getTotalCal: function () {
      let total = 0;
      data.items.forEach((item) => {
        total += item.calories;
      });
      data.totalCalories = total;
      return data.totalCalories;
    },

    getItemByID: function (id) {
      let found = null;
      data.items.forEach((item) => {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },

    setCurrentItem: function (item) {
      data.currentItem = item;
    },

    getCurrentItem: function () {
      return data.currentItem;
    },

    updateItem: function (input) {
      let currentItem = this.getCurrentItem();
      currentItem.name = input.name;
      currentItem.calories = parseInt(input.calories);
      console.log(currentItem);
    },

    deleteItem: function (id) {
      // need to find the index of the id becuase the index changes when the data is deleted
      let ids = data.items.map((item) => {
        return item.id;
      });
      // find the index of the id
      index = ids.indexOf(id);
      console.log(index);
      data.items.splice(index, 1);

      console.log(data);
    },

    deleteData: function () {
      data.items = [];
    },

    logData: function () {
      return data;
    },
  };
})();

// ------------------------UI CONTROLLER------------------------
const UICtrl = (function () {
  return {
    clearEditState: function () {
      // hide the edit state upon load
      this.clearInputValue();
      document.querySelector("#add-meal").style.display = "inline-block";
      document.querySelector("#update-meal").style.display = "none";
      document.querySelector("#delete-meal").style.display = "none";
      document.querySelector("#back").style.display = "none";
    },

    showEditState: function () {
      this.clearInputValue();
      document.querySelector("#add-meal").style.display = "none";
      document.querySelector("#update-meal").style.display = "inline-block";
      document.querySelector("#delete-meal").style.display = "inline-block";
      document.querySelector("#back").style.display = "inline-block";
    },

    populateItemList: function (items) {
      let html = "";

      items.forEach((item) => {
        html += ` 
            <li id="item-${item.id}" class="list-group-item">
                <strong>${item.name}: </strong> 
                <em>${item.calories} Calories</em>
                <a href="#" class="">
                    <i class="fa fa-pencil"></i>
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
                            <i class="fa fa-pencil"></i>
                        </a>`;

      document.querySelector(".items-parent").appendChild(li);
    },

    clearInputValue: function () {
      document.querySelector("#add-item").value = "";
      document.querySelector("#add-calories").value = "";
    },

    updateCounter: function (totalcalories) {
      let counter = document.querySelector("#total-calories");
      counter.innerText = totalcalories;
    },

    loadItemValues: function () {
      document.getElementById(
        "add-item"
      ).value = itemCtrl.getCurrentItem().name;
      document.getElementById(
        "add-calories"
      ).value = itemCtrl.getCurrentItem().calories;
    },
  };
})();

// ---------------------APP CONTROLLER------------------------
const app = (function (a, b, StorageCtrl) {
  // load event listeners
  const loadEventListeners = function () {
    document
      .querySelector("#add-meal")
      .addEventListener("click", itemAddSubmit),
      document
        .querySelector("#clear-data")
        .addEventListener("click", clearList),
      document
        .querySelector(".items-parent")
        .addEventListener("click", editItem),
      document.getElementById("back").addEventListener("click", backSubmit),
      document
        .getElementById("update-meal")
        .addEventListener("click", updateMeal),
      document
        .getElementById("delete-meal")
        .addEventListener("click", deleteMeal);
  };

  //   functions for event listeners
  const itemAddSubmit = function (e) {
    e.preventDefault();
    // get input from the uictrl
    const input = UICtrl.getItemInput();
    console.log(input);
    if (input.name !== "" && input.calories !== "") {
      // if inputs are valid,  add item to data and to local storage
      const newItem = itemCtrl.addItem(input.name, input.calories);
      StorageCtrl.storeItems(newItem);
      StorageCtrl.display();
      //   after adding to data, add item to UI list
      UICtrl.addListItem(newItem);
      //   clear the input values
      UICtrl.clearInputValue();
      //   update the total calorie counter
      itemCtrl.getTotalCal();
      UICtrl.updateCounter(itemCtrl.getTotalCal());
    } else {
      alert("must enter value");
    }
  };

  const clearList = function (e) {
    e.preventDefault();
    // unfinished, take the data and clear it then update the dom
    itemCtrl.deleteData();
    // update ui
    items = itemCtrl.getItems();
    UICtrl.populateItemList(items);
    itemCtrl.getTotalCal();
    UICtrl.updateCounter(itemCtrl.getTotalCal());
    // clear state as well if in edit state
    UICtrl.clearEditState();
  };

  const editItem = (e) => {
    e.preventDefault();
    console.log(e.target);
    if (e.target.className === "fa fa-pencil") {
      //    show the edit state
      UICtrl.showEditState();
      // grab list and get its id value
      item = e.target.parentElement.parentElement.id;
      // seperate the number from the id
      const array = item.split("-");
      const ID = parseInt(array[1]);
      // find the id in the database
      const itemToEdit = itemCtrl.getItemByID(ID);
      // set itemtoedit as the current item in the data
      itemCtrl.setCurrentItem(itemToEdit);
      // load current item values into the inputs
      UICtrl.loadItemValues();
    }
  };

  const backSubmit = (e) => {
    e.preventDefault();
    UICtrl.clearEditState();
  };

  const updateMeal = (e) => {
    e.preventDefault();
    //  on click log the input values
    const input = UICtrl.getItemInput();
    // update the currentitem with the new values
    itemCtrl.updateItem(input);
    // update the local storage
    StorageCtrl.updateItems(input);
    // update the ui list
    items = itemCtrl.getItems();
    UICtrl.populateItemList(items);
    // update the total calories counter
    const totalCalories = itemCtrl.getTotalCal();
    UICtrl.updateCounter(totalCalories);
  };

  const deleteMeal = (e) => {
    e.preventDefault();
    // on click get current item
    const item = itemCtrl.getCurrentItem();
    itemCtrl.deleteItem(item.id);
    // get new data and update the ui list
    let list = itemCtrl.getItems();
    UICtrl.populateItemList(list);
    // update total calories
    const totalCalories = itemCtrl.getTotalCal();
    UICtrl.updateCounter(totalCalories);
    // clear the edit state
    UICtrl.clearEditState();
  };

  return {
    init: function () {
      console.log("Init the app, creat data");
      // hide the edit state
      UICtrl.clearEditState();

      let items = a.getItems();
      console.log(items);
      //   put the items into the ui and show them
      b.populateItemList(items);
      // calculate total calories on load
      itemCtrl.getTotalCal();
      UICtrl.updateCounter(itemCtrl.getTotalCal());

      //   load the event listeners
      loadEventListeners();
    },
  };
})(itemCtrl, UICtrl, StorageCtrl);

app.init();
