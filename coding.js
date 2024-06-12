"use strict";
const copyContent = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
    console.log("Content copied to clipboard");
  } catch (err) {
    console.error("Failed to copy: ", err);
  }
};

function createDynamicElement(parentElement, object) {
  let tag, textNode, attr;
  next: for (let [key, value] of Object.entries(object)) {
    // attributes set
    if (key.includes("@")) {
      for (let [attrName, attrValue] of Object.entries(value)) {
        attr = document.createAttribute(attrName);
        attr.value = attrValue;
        parentElement.setAttributeNode(attr);
      }
      // continue;
      // or
      // jump to next loop
      continue next;
    }

    // create Element
    tag = document.createElement(key);
    // tagNode set
    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      // append nested Tag
      parentElement.appendChild(createDynamicElement(tag, value));
      continue next;
    } else if (Array.isArray(value) && value !== null) {
      for (let extractArray of value) {
        if (typeof extractArray === "object") {
          parentElement.appendChild(createDynamicElement(tag, extractArray));
        }
      }
      continue next;
    } else {
      textNode = document.createTextNode(value);
      // append together
      tag.appendChild(textNode);
      // parent Element
      parentElement.appendChild(tag);
    }
  }
  // return tag Element HTML
  return parentElement;
}
// examples
// let tags = createDynamicElement(document.body, {
//     h1: 'hello world',
//     h2: {
//         '@': {
//             class: 'header',
//             style: `color:red`
//         },
//         p: 'i\'m not big dick'
//     },
//     ul: [x
//         {
//             li: 'section 1',
//         },
//         {
//             li: 'section 2',
//         },
//         {
//             li: 'section 3',
//         },
//         {
//             li: 'section 4',
//         }
//     ]
// });

// -----------------------------------------------------------------------------------------------------------------------------------------------------------
const string = {
  search: function (text, find, sensitive = false) {
    let countHasExistsChar = 0;
    let startPos = 0;
    let findPos = 0;

    text = text.trim();
    find = find.trim();

    if (sensitive == false) {
      text = text.toLowerCase();
      find = find.toLowerCase();
    }
    findPos = text.indexOf(find);
    if (findPos > -1) {
      let point = 10000;
      return { text: text, countTrue: point - findPos };
    }
    for (var index = 0; index < text.length; index++) {
      let response = find.indexOf(text[index], startPos);

      if (response > -1) {
        startPos = response + 1;
        countHasExistsChar++;
      }
    }
    return { text: text, countTrue: countHasExistsChar };
  },
  arraySearch: function (array, find, lenghtToFind = Infinity) {
    let ListFindBox = [];
    let ListReturnSortBox = [];

    ListFindBox = array.map((item) => {
      return this.search(item, find).countTrue;
    });

    // (math.sortNumber(ListFindBox, lenghtToFind))
    //     .forEach(({ index, value }, i) => {
    //         ListReturnSortBox = [...ListReturnSortBox, { index: index, value: array[index] }];
    //     })
    let sort_number = math.sortNumber(ListFindBox, lenghtToFind, true);
    // console.log(sort_number);
    if (sort_number.length === 0) {
      return;
    }
    // console.log(sort_number);
    for (let [i, { index, value }] of sort_number.entries()) {
      ListReturnSortBox = [
        ...ListReturnSortBox,
        { index: index, value: array[index] },
      ];
    }
    return ListReturnSortBox;
  },
};
const math = {
  sortNumber: function (
    arrayNumber,
    lengthTakeArray = Infinity,
    removeZero = false
  ) {
    let sortArray = [];
    arrayNumber.forEach((item, index) => {
      let isLessThanItem = true;
      if (item >= sortArray[0]?.value || index == 0) {
        sortArray = [{ index: index, value: item }, ...sortArray];
        return;
      }
      if (
        lengthTakeArray <= sortArray.length ||
        sortArray.length === 0 ||
        (item === 0 && removeZero === true)
      ) {
        return;
      }

      for (let i = 1; i < sortArray.length; i++) {
        if (item >= sortArray[i].value) {
          isLessThanItem = false;
          sortArray.splice(i, 0, { index: index, value: item });
          // console.log(sortArray);
          break;
        }
      }
      if (isLessThanItem) {
        sortArray = [...sortArray, { index: index, value: item }];
        return;
      }
    });

    return sortArray;
  },
};
// const math = {
//   sortNumber: function (
//     arrayNumber,
//     lengthTakeArray = Infinity,
//     removeZero = false
//   ) {
//     let sortArray = arrayNumber
//       .map((value, index) => ({ index, value }))
//       .filter((item) => !(removeZero && item.value === 0));

//     // Sort by value in descending order to get the largest number first
//     sortArray.sort((a, b) => b.value - a.value);

//     // After the first element, sort the rest by index in ascending order
//     if (sortArray.length > 1) {
//       const restSorted = sortArray.slice(1).sort((a, b) => a.index - b.index);
//       sortArray = [sortArray[0], ...restSorted];
//     }

//     return sortArray.slice(0, lengthTakeArray);
//   },
// };

const array = {
  sort: function (data) {
    const mapped = data.map((v, i) => {
      return { i, value: v };
    });

    // sorting the mapped array containing the reduced values
    mapped.sort((a, b) => {
      if (a.value > b.value) {
        return 1;
      }
      if (a.value < b.value) {
        return -1;
      }
      return 0;
    });

    const result = mapped.map((v) => data[v.i]);
    return result;
  },
};
// -----------------------------------------------------------------------------------------------------------------------------------------------------------
const convertHTML = function (string) {
  const parser = new DOMParser();
  const DOM_input = parser.parseFromString(string, "text/html");
  let parentElement = DOM_input.body.firstChild;
  return parentElement.cloneNode(true);
};
// -----------------------------------------------------------------------------------------------------------------------------------------------------------
const enableSelector = async function (
  arr_element,
  selected_element,
  name = "selected"
) {
  await Promise.resolve(
    arr_element.forEach((element) => {
      if (element.classList.contains(name)) element.classList.remove(name);
    })
  );
  selected_element.classList.add(name);
  return true;
};
// -----------------------------------------------------------------------------------------------------------------------------------------------------------

const coding_dialog = {
  name: "modal",
  btn_close_name: "screen_btn_close",
  btn_close: null,
  status: false, // false is means Off Dialog | true is means On Dialog
  opened: false,
  cssSelectorDialog: null,
  cssSelectorDialogHidden: null,
  start: function () {
    this.status = true;

    // 1. background to close dialog
    document.body.insertAdjacentHTML(
      "afterbegin",
      `<div id="${this.btn_close_name}" data-hidden="true"></div>`
    );
    // 2. config dialog element
    this.cssSelectorDialog = `.${this.name}[data-type="dialog"]`;
    this.cssSelectorDialogHidden = `.${this.name}[data-type="dialog"][data-hidden="true"]`;

    const btn_close = document.getElementById(this.btn_close_name);
    this.btn_close = btn_close;
    btn_close.addEventListener("click", () => {
      this.modal("close");
    });
  },
  modal: function (value, parentElement = undefined, callback = undefined) {
    switch (value) {
      case "open":
        this.open(parentElement);
        break;
      case "toggle":
        this.toggle(parentElement);
        break;
      case "close":
        this.close();
        break;
    }
    if (typeof callback == "function") {
      callback(this.opened);
    }
  },
  open: function (parentElement) {
    if (!this.status) {
      this.start();
    }

    // 2. check the modal is opend it will closed by default
    this.opened = true;
    this.btn_close.dataset.hidden = "false";
    parentElement.dataset.hidden = "false";
    document.body.style.overflow = "none";
  },
  toggle: function (parentElement) {
    if (!this.status) {
      this.start();
    }
    // 2. check the modal is opend it will closed by default
    if (this.opened) {
      this.close();
    } else {
      this.open(parentElement);
    }
  },
  close: function () {
    this.opened = false;
    this.btn_close.dataset.hidden = "true";
    const modals = document.querySelectorAll(this.cssSelectorDialog);
    modals.forEach((modal) => {
      if (modal.dataset.hidden != "true") {
        modal.dataset.hidden = "true";
        document.body.style.overflow = "auto";
        this.btn_close.dataset.hidden = "true";
      }
    });
  },
  shutdown: function () {
    this.status = false;
    // remove tag dialog close button
    this.btn_close.remove();
  },
};
const coding_modal = {
  element: (object) => {
    const { append, event, style, addClass, id } = object;
    const addID = id ? `id="${id}"` : "";

    const modal = `<div ${addID} class="modal ${
      addClass ?? ""
    }" data-type="dialog" data-hidden="true"></div>`;
    // --------------------------------
    // check the append is html doc or string
    var html_doc;

    if (typeof append === "string") {
      html_doc = convertHTML(append);
    } else {
      html_doc = append;
    }
    // --------------------------------
    // convert to HTML
    const parentElement = convertHTML(modal);
    parentElement.append(html_doc);
    // --------------------------------
    const root = [
      {
        variable: "--padding-coding-modal",
        cssName: "padding",
      },
      {
        variable: "--margin-coding-modal",
        cssName: "margin",
      },
      {
        variable: "--border-coding-modal",
        cssName: "border",
      },
      {
        variable: "--border-radius-coding-modal",
        cssName: "border_radius",
      },
      {
        variable: "--height-coding-modal",
        cssName: "height",
      },
      {
        variable: "--max-height-coding-modal",
        cssName: "max_height",
      },
      {
        variable: "--min-width-coding-modal",
        cssName: "min_width",
      },
      {
        variable: "--width-coding-modal",
        cssName: "width",
      },
      {
        variable: "--max-width-coding-modal",
        cssName: "max_width",
      },
      {
        variable: "--bg-color-coding-modal",
        cssName: "bg_color",
      },
      {
        variable: "--color-coding-moda",
        cssName: "color",
      },
      {
        variable: "--dark-border-coding-modal",
        cssName: "dark_border",
      },
      {
        variable: "--dark-bg-color-coding-modal",
        cssName: "dark_bg_color",
      },
      {
        variable: "--dark-color-coding-modal",
        cssName: "dark_color",
      },
    ];
    if (typeof style == "object") {
      root.forEach(({ variable, cssName }) => {
        if (style[`${cssName}`]) {
          parentElement.style.setProperty(variable, style[cssName]);
        }
      });
    }
    if (typeof event === "function") {
      event(coding_dialog, parentElement);
    }
    // ----------------------------------------------------------------

    return parentElement;
  },
  copy: function () {
    return `modal({
        id:'default_null', // optional
        addClass:'default_null', // optional
        append:"default_none",// mandatory node|string
        event:function(modal,DOM){ //modal.open(dom)|close()|toggle(dom) 
          
        },
        style:{
          padding:"default_5px", // optional
          margin:"default_0px", // optional
          border:"default_none", // optional
          border_radius:"default_none", // optional
          height:"default_500px", // optional
          max_height:"default_500px", // optional
          min_width:"default_inherit", // optional
          width:"default_100%", // optional
          max_width:"default_100%", // optional
          bg_color:"default_white", // optional
          color:"default_black", // optional
        }
      })`;
  },
  version: {
    length: 0,
  },
};

const coding_input = {
  element: function (object, version = 0) {
    // object.id
    // object.name
    // object.value
    // object.placeholder
    // object.type
    // object.label
    // object.icon
    // object.attributes
    // object.autocomplete = on
    // object.textError
    // object.style
    const {
      id,
      name,
      value,
      label,
      type,
      placeholder,
      autocomplete,
      attributes,
      icon,
      iconSide,
      direction,
      textError,
      text_gp_left,
      text_gp_right,
      style,
    } = object;

    let hasIcon = icon ? "true" : "false";
    let tag_icon = icon ? '<div class="icon">' + icon + "</div>" : "";
    // --------------------------------
    let tag_text_gp_left = text_gp_left
      ? '<div class="text-group left">' + text_gp_left + "</div>"
      : "";
    let tag_text_gp_right = text_gp_right
      ? '<div class="text-group right">' + text_gp_right + "</div>"
      : "";
    // --------------------------------
    let tag_textError = textError ? `<p>${textError}</p>` : "";
    const input = `
          <div id="${id}" data-type="input" data-name="coding" data-dir="${
      direction ?? "ltr"
    }" data-version="${version}">
              <div class="field" data-contain-icon="${hasIcon}" data-dir-icon="${iconSide}" data-status="info">
                ${tag_text_gp_left}
                ${tag_text_gp_right}

                <div class="inp">
                  <input 
                      id="${id}_input"
                      type="${name ?? type}"
                      name="${name}"
                      placeholder="${placeholder ?? "Enter Text"}"
                      value="${value ?? ""}"
                      autocomplete="${autocomplete ?? "on"}"
                      ${attributes ?? ""}
                  >
                  <label for="${id}_input">
                      <p>${label ?? ""}</p>
                  </label>
                </div>
                  ${tag_icon}
              </div>
              <div class="absolute_message">
                  <span class="message_box"> ${tag_textError}</span>
              </div>
          </div >
          `;
    // --------------------------------
    // convert to HTML
    const parentElement = convertHTML(input);
    // --------------------------------
    // style.bgColor
    // style.color
    // style.height
    const root = [
      {
        variable: "--bg-color-coding-input",
        cssName: "bgColor",
      },
      {
        variable: "--bg-color-coding-input-disabled",
        cssName: "bgColor_disabled",
      },
      {
        variable: "--bg-color-coding-input-text-gp",
        cssName: "bgColor_text_gp",
      },
      {
        variable: "--height-coding-input",
        cssName: "height",
      },
      {
        variable: "--color-coding-input",
        cssName: "color",
      },
      {
        variable: "--font-size-coding-input",
        cssName: "font_size",
      },
      {
        variable: "--font-size-coding-input-icon",
        cssName: "font_size_icon",
      },
      {
        variable: "--font-size-coding-input-label",
        cssName: "font_size_label",
      },
      {
        variable: "--font-size-coding-input-label-focus",
        cssName: "font_size_label_focus",
      },
      {
        variable: "--font-size-coding-input-message",
        cssName: "font_size_message",
      },
      {
        variable: "--font-size-coding-input-placeholder",
        cssName: "font_size_placeholder",
      },
      {
        variable: "--border-radius-coding-input",
        cssName: "border_radius",
      },
      {
        variable: "--border-style-coding-input",
        cssName: "border_style",
      },
      {
        variable: "--border-width-coding-input",
        cssName: "border_width",
      },
      {
        variable: "--border-color-coding-input",
        cssName: "border_color",
      },
      {
        variable: "--border-width-coding-input-focus",
        cssName: "border-width-focus",
      },
      {
        variable: "--border-color-coding-input-focus",
        cssName: "border_color_focus",
      },
      {
        variable: "--border-color-coding-input-filled",
        cssName: "border_width_filled",
      },
      {
        variable: "--color-placeholder-coding-input",
        cssName: "color_placeholder",
      },
      {
        variable: "--text-indent-coding-input",
        cssName: "text_indent",
      },
      {
        variable: "--outline-coding-input",
        cssName: "outline",
      },
      {
        variable: "--outline-coding-input-focus",
        cssName: "outline_focus",
      },
      {
        variable: "--outline-coding-input-filled",
        cssName: "outline_filled",
      },
      {
        variable: "--dark-bg-color-coding-input",
        cssName: "dark_bgColor",
      },
      {
        variable: "--dark-color-coding-input",
        cssName: "dark_color",
      },
      {
        variable: "--dark-bg-color-coding-input-disabled",
        cssName: "dark_bgColor_disabled",
      },
      {
        variable: "--dark-bg-color-coding-input-text-gp",
        cssName: "dark_bgColor_text_gp",
      },
      {
        variable: "--dark-border-color-coding-input",
        cssName: "dark_border_color",
      },
      {
        variable: "--dark-color-placeholder-coding-input",
        cssName: "dark_placeholder_color",
      },
      {
        variable: "--dark-border-color-coding-input-filled",
        cssName: "dark_border_color_filled",
      },
    ];
    if (typeof style == "object") {
      root.forEach(({ variable, cssName }) => {
        if (style[`${cssName}`]) {
          parentElement.style.setProperty(variable, style[cssName]);
        }
      });
    }
    // --------------------------------
    return parentElement;
    // --------------------------------
  },
  copy: (index = "verison") => {
    return `input({
            id: 'mandatory', // mandatory
            name: 'mandatory', // mandatory
            type: 'default_name', // optional
            value: 'value', // optional
            placeholder: 'placeholder', // optional
            label: 'label', // mandatory
            icon: 'icon', // optional node/ element/ text
            iconSide: 'default_right', // optional
            attributes: 'required max_length="100"',  // optional
            textError: 'text error', // optional
            autocomplete:'default_off', // optional off/on
            direction:'default_ltr', // optional
            text_gp_left:"default", node/ element // optional
            text_gp_right:"@", node/ element // optional
            style: { 
                color: 'default_inherit', // optional
                bgColor: 'default_inherit', // optional
                bgColor_disabled: 'default_inherit' // optional
                bgColor_text_gp: 'default_#4680d021' // optional
                height: 'default_50px', // optional
                font_size: 'default_1rem', // optional
                font_size_icon: 'default_1.1rem', // optional
                font_size_label: 'default_1rem', // optional
                font_size_label_focus: 'default_1rem', // optional
                font_size_message: 'default_0.8rem', // optional
                font_size_placeholder: 'default_1rem', // optional
                border_radius: 'default_0', // optional
                border_style: 'default_solid', // optional
                border_width: 'default_1px', // optional
                border_color: 'default_black', // optional
                border_width_focus: 'default_2px', // optional DEPRICATED
                border_color_focus: 'default_dodgerblue', // optional
                border_color_filled: 'default_black', // optional
                color_placeholder: 'default_gray', // optional
                text_indent: 'default_15px', // optional
                outline: 'default_none', // optional
                outline_focus: 'default_none', // optional
                outline_filled: 'default_none', // optional
                dark_color: 'default_white', // optional
                dark_bgColor: 'default_black', // optional
                dark_bgColor_disabled: 'default_none', // optional
                dark_placeholder_color: 'default_none', // optional
                dark_bgColor_text_gp: 'default_none', // optional
                dark_border_color: 'default_none', // optional
                dark_border_color_filled: 'default_none', // optional
            }
        }, ${index})`;
  },
  version: {
    length: 8,
  },
};

// output value / data-index
const coding_dropdown = {
  element: function (object, version = 0) {
    const { id, addClass, options, direction, textError, style, placeholder } =
      object;

    let attr_id = id ? `id="${id}"` : "";
    let tag_textError = textError ? `<p>${textError}</p>` : "";

    // const options =
    const dropdown = `
    <div ${attr_id} class="unselectable ${
      addClass ?? ""
    }" data-name="coding" data-type="dropdown" data-dir="${
      direction ?? "left"
    }">
      <div class="field">
        <div class="clone">
            <p>${placeholder}</p>
        </div>
        <div class="angle">
          <i class="fa-sharp fa-regular fa-angle-down"></i>
        </div>
      </div>
      <div class="absolute_message">
        <span class="message_box"> ${tag_textError}</span>
      </div>
    </div>
    `;
    const parentElement = convertHTML(dropdown);
    // ---------------------------------------
    const string_options = `<div class='options'></div>`;
    const createOption = function (options) {
      var items = "";
      options.forEach(({ img, value }, index) => {
        const image = img
          ? ` 
          <div class="img">
            <img src="${img}" alt="" height="100%" width="100%">
          </div>
           `
          : "";
        items += `
          <div class='item' data-index="${index}" data-value="${value}"> 
            ${image}
            <p>${value}</p>
          </div>
          `;
      });
      return items;
    };
    const items = createOption(options);
    const string_items = `<div class="items">${items}</div>`;

    const dom_options = convertHTML(string_options);

    const container_items = convertHTML(string_items);
    dom_options.append(container_items);
    // 3. create modal
    const options_modal = coding_modal.element({
      append: dom_options,
      event: function (modal, DOM) {
        parentElement.addEventListener("click", function () {
          modal.toggle(DOM);
        });
      },
      style: {
        // font_size: selector?.style?.font_size ?? '1rem', // optional
        padding: "8px",
        border: "1px solid black",
        border_radius: style?.border_radius ?? "5px",
        height: "auto",
        max_height: "400px",
        bg_color: style?.bg_color,
        color: style?.color,
      },
    });
    // ---------------------------------------
    // select option
    const items_option = options_modal.querySelectorAll(".item");
    const temp_clone = parentElement.querySelector(".clone");
    items_option.forEach((item) => {
      item.addEventListener("click", function () {
        temp_clone.innerHTML = "";
        temp_clone.append(this.cloneNode(true));
        enableSelector(items_option, this);
      });
    });
    // coding_modal.element({});
    parentElement.append(options_modal);
    // ---------------------------------------
    // --------------------------------
    const root = [
      {
        variable: "--border-coding-dropdown",
        cssName: "border",
      },
      {
        variable: "--border-radius-coding-dropdown",
        cssName: "border_radius",
      },
      {
        variable: "--height-coding-dropdown",
        cssName: "height",
      },
      {
        variable: "--height-item-coding-dropdown",
        cssName: "height_item",
      },
      {
        variable: "--color-coding-dropdown",
        cssName: "color",
      },
      {
        variable: "--bg-color-coding-dropdown",
        cssName: "bg_color",
      },
    ];
    if (typeof style == "object") {
      root.forEach(({ variable, cssName }) => {
        if (style[`${cssName}`]) {
          parentElement.style.setProperty(variable, style[cssName]);
        }
      });
    }

    // ---------------------------------------
    return parentElement;
    // ---------------------------------------
  },
  copy: function () {
    return `dropdown({
        id:'default_none', // optional
        addClass:'default_none', // optional
        placeholder:'default_null',//mandatory
        options:'default_none', // mandatory [{ img:'',value:''}]
        direction:"default_ltr",// optional 
        textError:'default_null', // optional
        style:{
            border:'default_1px solid black',//optional
            border_radius:'default_0', //optional
            height:'default_50px', //optional
            height_item:'default_40px', //optional
            color:'default_black', //optional
            bg_color:'default_white', //optional
        }
      })`;
  },
  version: {
    length: 1,
  },
};

const coding_button = {
  element: function (object, version = 0) {
    const {
      id,
      value,
      addClass,
      attributes,
      addStyle,
      style,
      isEnableWavePoint,
      event,
      isEnableLoading,
      loadingNode,
    } = object;

    // ----------------------------------------------------------------
    let loading = isEnableLoading
      ? `<div class="loading">${loadingNode ?? "Loading..."}</div>`
      : "";
    let idTag = id ? `id="${id}"` : "";
    let styleAttr = addStyle ? `style="${addStyle}"` : "";
    // ----------------------------------------------------------------

    const button = `
<button ${idTag} class="submit ${
      addClass ?? ""
    }" ${styleAttr} data-name="coding"
 data-loading="false" data-version="${version}" ${attributes ?? ""}>
    <div>${value ?? "button"}</div>
    ${loading}
</button>
 `;
    // ----------------------------------------------------------------
    const parentElement = convertHTML(button);
    // ----------------------------------------------------------------

    const root = [
      {
        variable: "--height-coding-button",
        cssName: "height",
      },
      {
        variable: "--bg-color-coding-button",
        cssName: "bgColor",
      },
      {
        variable: "--color-coding-button",
        cssName: "color",
      },
      {
        variable: "--fontSize-coding-button",
        cssName: "font_size",
      },
      {
        variable: "--border-radius-coding-button",
        cssName: "border_radius",
      },
      {
        variable: "--border-width-coding-button",
        cssName: "border_width",
      },
      {
        variable: "--border-color-coding-button",
        cssName: "border_color",
      },
      {
        variable: "--border-style-coding-button",
        cssName: "border_style",
      },
      {
        variable: "--border-color-hover-coding-button",
        cssName: "border_color_hover",
      },
      {
        variable: "--outline-hover-coding-button",
        cssName: "outline_hover",
      },
      {
        variable: "--outline-active-coding-button",
        cssName: "outline_active",
      },
      {
        variable: "--outline-coding-button",
        cssName: "outline",
      },
    ];
    if (typeof style == "object") {
      root.forEach(({ variable, cssName }) => {
        if (style[`${cssName}`]) {
          parentElement.style.setProperty(variable, style[cssName]);
        }
      });
    }
    // ----------------------------------------------------------------
    const startLoading = function () {
      parentElement.dataset.loading = "true";
      parentElement.setAttribute("disabled", "");
    };
    const stopLoading = function () {
      parentElement.dataset.loading = "false";
      parentElement.removeAttribute("disabled");
    };
    parentElement.addEventListener(
      "click",
      function (e) {
        if (typeof event === "function") {
          event(
            (loading = {
              stop: stopLoading,
              start: startLoading,
            })
          );
        }
        // ----------------------------------------------------------------
        if (!isEnableWavePoint) {
          return;
        }
        switch (e.target) {
          case this.querySelector(".spot"):
            return;
          default:
            break;
        }
        const spot = document.createElement("div");
        spot.classList.add("spot");

        this.append(spot);

        const spot_last = this.querySelector(".spot:last-child");
        const size = spot_last.getBoundingClientRect();
        const btn = this.getBoundingClientRect();

        spot_last.classList.add("active");

        let y = e.layerY - size.height / 2 - 1.5;
        let x = e.layerX - size.width / 2 - 1.5;

        if (
          y < -(size.height / 2) || // width greater than MouseY
          x < -(size.width / 2) || // width less than MouseX
          e.layerX > btn.width - 2.5 || // width greater than MouseX
          e.layerY > btn.height - 2.5 // height greater than MouseY
        ) {
          y = btn.height / 2 - size.height / 2 - 1.5;
          x = btn.width / 2 - size.width / 2 - 1.5;
        }

        spot_last.style.top = `${y}px`;
        spot_last.style.left = `${x}px`;
        setTimeout(() => {
          spot_last.remove();
        }, 150);
        // ----------------------------------------------------------------

        // ----------------------------------------------------------------
      },
      {
        capture: true,
      }
    );
    // ----------------------------------------------------------------

    return parentElement;
  },
  // ----------------------------------------------------------------
  copy: (index = "verison") => {
    return `button({
    id: 'default_optional', // mandatory
    value: 'value', // node /Element // mandatory
    addClass: '', // optional
    addStyle: '', // optional
    attributes: '', // optional
    isEnableLoading: false, // default false boolean // optional
    loadingNode: 'Loading...', // node /Element // optional
    isEnableWavePoint: true, // default false boolean // optional
    event: function(loading,parentElement){}, // optional |  (loading.start / loading.stop)
    style: {
        color: 'default_black', // optional
        bgColor: 'default_inherit', // optional
        height: 'default_50px', // optional
        border_width: 'default_1px', // optional
        border_color: 'default_none', // optional
        border_style: 'default_solid', // optional
        border_radius: 'default_0', // optional 
        border_color_hover: 'default_inherit', // optional
        font_size: 'default_inherit', // optional
        outline: 'default_none', // optional 
        outline_hover: 'default_none', // optional
        outline_active: 'default_none', // optional
    }
}, ${index})`;
  },
  // ----------------------------------------------------------------

  version: {
    length: 1,
  },
};

const coding_boolean = {
  element: function (object, version = 0) {
    const {
      id,
      value,
      title,
      desc,
      checked,
      type,
      boxSide,
      direction,
      addClass,
      attributes,
      addStyle,
      style,
    } = object;
    const idAttr = id ? `id="${id}"` : "";
    const styleAttr = addStyle ? `style='${addStyle}'` : "";
    const grow_2 = desc
      ? `<div class="grow-2"><div class="desc"><p>${desc}</p></div></div>`
      : "";

    const boolean = `
    <div
    ${idAttr}
    class="boolean unselectable ${addClass ?? ""}"
    data-name="coding"
    data-checked="${checked ?? "false"}"
    data-value="${value ?? ""}"
    data-type="${type ?? "checkbox"}"
    data-version="${version}"
    data-dir="${direction ?? "ltr"}"
    ${attributes ?? ""}
    ${styleAttr}
  >
    <!-- ${version} -->
    <div class="grow-1" data-dir-boolean="${boxSide ?? "straight"}">
      <div class="template_box">
        <div class="box">
          <div class="icon">
            <i class="fa-solid fa-check"></i>
          </div>
          <div class="circle">
            <i class="fa-sharp fa-solid fa-xmark"></i>
            <i class="fa-sharp fa-solid fa-check"></i>
          </div>
        </div>
      </div>
      <div class="title">${title ?? ""}</div>
    </div>
    ${grow_2}
  </div>
        `;
    // ----------------------------------------------------------------
    const parentElement = convertHTML(boolean);
    // ----------------------------------------------------------------
    const boolean_btn = parentElement.querySelector(".grow-1");
    boolean_btn.addEventListener("click", function (e) {
      if (parentElement.dataset.checked == "true") {
        parentElement.dataset.checked = "false";
      } else {
        parentElement.dataset.checked = "true";
      }
    });
    // ----------------------------------------------------------------
    const root = [
      {
        variable: "--width-coding-boolean",
        cssName: "width",
      },
      {
        variable: "--padding-coding-boolean",
        cssName: "padding",
      },
      {
        variable: "--outline-coding-boolean-hover",
        cssName: "outline_hover",
      },
      {
        variable: "--border-radius-coding-boolean",
        cssName: "border-radius",
      },
      {
        variable: "--border-bottom-coding-boolean-title",
        cssName: "border_bottom_title",
      },
      {
        variable: "--border-color-coding-boolean",
        cssName: "border_color",
      },
      {
        variable: "--color-checked-coding-boolean",
        cssName: "color_boolean",
      },
      {
        variable: "--bg-color-checked-coding-boolean",
        cssName: "bg_color_boolean",
      },
      {
        variable: "--bg-color-coding-boolean",
        cssName: "bg_color_switch",
      },
      {
        variable: "--transition-coding-boolean",
        cssName: "transition",
      },
      {
        variable: "--dark-color-title-coding-boolean",
        cssName: "dark_color_title",
      },
      {
        variable: "--dark-color-coding-boolean",
        cssName: "dark_color",
      },
      {
        variable: "--dark-border-color-coding-boolean",
        cssName: "dark_border_color",
      },
    ];
    // ----------------------------------------------------------------

    if (typeof style == "object") {
      root.forEach(({ variable, cssName }) => {
        if (style[`${cssName}`]) {
          parentElement.style.setProperty(variable, style[cssName]);
        }
      });
    }
    // ----------------------------------------------------------------

    return parentElement;
    // ----------------------------------------------------------------
  },
  copy: function () {
    return `boolean({
      id:'default_id', // mandatory
      title: 'default_title', // optional 
      desc:'default_desc', // optional 
      checked:'default_false', // optional  false|true
      type:'default_checkbox', // optional  checkbox|radio|switch
      boxSide:'default_none', // optional  reverse
      direction:'default_ltr', // optional ltr|rtl
      addClass:'default_none', // optional
      attributes:'default_none', //optional
      addStyle:'default_none', //optional
      style:{
        width:'default_20px', //optional
        padding:'default_7px', //optional
        outline_hover:'default_5px_solid_blue', //optional
        border_bottom_title:'default_none', //optional
        border_color:'default_#444', //optional
        bg_color_boolean:'default_dodgerblue', //optional
        color_boolean:'default_white', //optional
        bg_color_switch:'default_#444', //optional
        transition:'default_all_0.3s_ease-in', //optional
        dark_color_title:'default_white', //optional
        dark_color:'default_white', //optional
        dark_border_color:'default_whitesmoke', //optional
      }, //optional
    },0)`;
  },
  version: {
    length: 3,
  },
};

const coding_msg = {
  element: function (object, version = 0) {
    const {
      id,
      addClass,
      type, // none| danger | warning | info | success
      title,
      desc,
      icon,
      iconSide,
      direction,
      style,
    } = object;
    const attr_addClass = addClass ? `class="${addClass}"` : "";
    const att_id = id ? `id="${id}"` : "";
    const tag_title = title ? `<div class="title">${title}</div>` : "";
    const tag_icon = icon ? `<div class="icon">${icon}</div>` : "";

    const msg = `
    <div
        ${att_id}
        ${attr_addClass}
        data-name="coding"
        data-type="message_box"
        data-dir="${direction ?? "ltr"}"
        data-color="${type ?? "none"}"
        data-icon-side="${iconSide ?? "straight"}"
    >
        <div class="header">
          ${tag_icon}
          ${tag_title}
        </div>
        <div class="content">
          <div class="desc">
              ${desc ?? ""}
          </div>
        </div>
    </div>
    `;
    // ----------------------------------------------------------------

    const parentElement = convertHTML(msg);

    const root = [
      {
        variable: "--border-coding-msg",
        cssName: "border",
      },
      {
        variable: "--border-radius-coding-msg",
        cssName: "border_radius",
      },
      {
        variable: "--font-size-coding-msg",
        cssName: "font_size",
      },
      {
        variable: "--font-size-icon-coding-msg",
        cssName: "font_size_icon",
      },
      {
        variable: "--padding-coding-msg",
        cssName: "padding",
      },
    ];
    // ----------------------------------------------------------------

    if (typeof style == "object") {
      root.forEach(({ variable, cssName }) => {
        if (style[`${cssName}`]) {
          parentElement.style.setProperty(variable, style[cssName]);
        }
      });
    }

    // ------------------------------------
    return parentElement;
    // ------------------------------------
  },
  copy: function () {
    return `msg({
        id: 'default_none', //optional
        addClass: 'default_none', //optional
        type: 'default_none', //optional danger|info|warning|success
        title: 'default_none', //mandatory
        desc: 'default_none', //optional
        icon: 'default_none', //optional
        iconSide: 'default_straight', //optional straight | reverse  
        style:{
          border:'default_1px solid black',//optional
          border_radius:'default_0px', //optional
          font_size:'default_1rem', //optional
          font_size_icon:'default_1rem', //optional 
          padding:'default_7px', //optional
        }
      },0)`;
  },
  version: {
    length: 0,
  },
};

// output value / data-index
const coding_selector = {
  element: function (object, version) {
    const {
      selector,
      options,
      searchBox,
      version_searchBox,
      addClass,
      direction,
    } = object;
    const dom_input = coding_input.element(selector, version);

    // const options =
    const selectorParent = `<div id='${
      selector.id
    }_selector' class='unselectable ${
      addClass ?? ""
    }' data-type='selector' data-name='coding' data-direction='${
      direction ?? "ltr"
    }'></div>`;
    const parentElement = convertHTML(selectorParent);
    // ---------------------------------------
    // angle
    const field_input = dom_input.querySelector(".field");
    const angle_arrow = `
    <div class="angle">
      <i class="fa-sharp fa-regular fa-angle-down"></i>
    </div>
    `;
    const dom_angle = convertHTML(angle_arrow);
    // ---------------------------------------
    const string_options = `<div class='options'></div>`;
    const string_searchBox = `<div class='search_box'></div>`;
    const createOption = function (options) {
      var items = "";
      options.forEach(({ img, value }, index) => {
        const image = img
          ? ` 
        <div class="img">
          <img src="${img}" alt="" height="100%" width="100%">
        </div>
         `
          : "";
        items += `
        <div class='item' data-index="${index}" data-value="${value}"> 
          ${image}
          <p>${value}</p>
        </div>
        `;
      });
      return items;
    };
    const items = createOption(options);
    const string_items = `<div class="items">${items}</div>`;

    const dom_options = convertHTML(string_options);
    const dom_search = convertHTML(string_searchBox);

    // 1. check if search box exists then append
    if (searchBox) {
      const dom_searchBox = coding_input.element(
        searchBox,
        version_searchBox ?? 6
      );

      dom_search.append(dom_searchBox);
      dom_options.append(dom_search);
    }

    const dom_to_seacrh_options =
      dom_search.querySelector("input") ?? dom_input.querySelector("input");
    // 2. append options
    const container_items = convertHTML(string_items);
    dom_options.append(container_items);
    // 3. create modal
    const options_modal = coding_modal.element({
      append: dom_options,
      event: function (modal, DOM) {
        parentElement.addEventListener("click", function () {
          modal.open(DOM);
          dom_to_seacrh_options.focus();
        });
      },
      style: {
        // font_size: selector?.style?.font_size ?? '1rem', // optional
        padding: "8px",
        border: "1px solid black",
        border_radius: selector?.style?.border_radius ?? "5px",
        // height: "100%",
        max_height: "400px",
        bg_color: selector?.style?.bg_color,
        color: selector?.style?.color,
      },
    });
    // ---------------------------------------
    // select option
    const tag_input = field_input.querySelector("input");
    const items_option = options_modal.querySelectorAll(".item");
    items_option.forEach((item) => {
      item.addEventListener("click", function () {
        tag_input.value = this.dataset.value;
        tag_input.dataset.index = this.dataset.index;
        enableSelector(items_option, this);
      });
    });
    // ---------------------------------------
    // search
    const options_to_search = options.map(({ value }) => {
      return value;
    });
    // console.log(options_to_search);
    // ---------------------------------------
    // dom_search
    dom_to_seacrh_options.addEventListener("keyup", function () {
      // console.log(this.value);
      const sorted_options = string.arraySearch(
        options_to_search,
        this.value,
        10
      );
      items_option.forEach((item) => {
        if (item.hasAttribute("style")) {
          item.removeAttribute("style");
        }
      });
      // console.log(sorted_options);
      const length_found_data = sorted_options.length;
      sorted_options.forEach(({ index, value }, i) => {
        let order_flex = -length_found_data + i;
        items_option[index].style.order = order_flex;
      });
    });
    // ---------------------------------------
    field_input.append(dom_angle);
    // coding_modal.element({});
    parentElement.append(dom_input);
    parentElement.append(options_modal);
    // ---------------------------------------
    return parentElement;
    // ---------------------------------------
  },
  copy: function () {
    return `selector({
      selector:'PIXEL_coding_input', // mandatory
      options:'default_none', // mandatory [{ img:'',value:''}]
      searchBox:'PIXEL_coding_input', // optional
      version_searchBox:'default_6', // optional
      addClass:'default_null', // optional
      direction:"default_ltr",// mandatory node|string
    })`;
  },
  version: {
    length: 1,
  },
};

const config = {
  path_js: "./javascripts/module/fw-frontend/",
  modules: [
    {
      property: ["forms", "input"],
      type: "forms",
      name: coding_input,
    },
    {
      property: ["forms", "dropdown"],
      type: "forms",
      name: coding_dropdown,
    },
    {
      property: ["forms", "button"],
      type: "forms",
      name: coding_button,
    },
    {
      property: ["forms", "boolean"],
      type: "forms",
      name: coding_boolean,
    },
    {
      property: ["forms", "selector"],
      type: "forms",
      name: coding_selector,
    },
    {
      property: ["dialog", "msg"],
      type: "dialog",
      name: coding_msg,
    },
    {
      property: ["dialog", "modal"],
      type: "dialog",
      name: coding_modal,
    },
  ],
};

/**
 * app version 1.0
 * name
 * ----------------------------------------------------------------
 * app.field.input
 * ----------------------------------------------------------------
 * app.field.dropdown
 * ----------------------------------------------------------------
 *
 *
 */
var app = {
  //   fields: {
  //     input: {
  //       version: "1.0",
  //       copy: true,
  //       clone:tags,
  //     },
  //   },
};

var object = {},
  o;
function createPropertyNested(obj, property, valueObject) {
  o = object;
  for (var i = 0; i < property.length; i++) {
    if (obj[property[i]]) {
      o = obj[property[i]];
      continue;
    }
    if (i != property.length - 1) {
      o = o[property[i]] = {};
    }
    if (i == property.length - 1) {
      // console.log(valueObject);
      o[property[i]] = valueObject;
      break;
    }
  }
  return object;
}

for (let obj of config.modules) {
  let { version, copy, element } = obj.name;
  let getPropert = createPropertyNested(app, obj.property, {
    version: version,
    copy: copy,
    clone: element,
  });
  app = { ...app, ...getPropert };
}

