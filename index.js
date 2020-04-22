/*
 * This file contains the JavaScript for all the event-handling of the bubbles
 * and UI for the Aesthetic Magnetic Poetry, aka CSE 154 CP 2.
 */
"use strict";
(function() {

  // Word bank for bubbles
  const WORDS = [
    "relax", "&", "&", "&", "enjoy", "life", "as", "is", "like", "love",
    "the", "best", "good", "happy", "dream", "listen", "to", "you", "are",
    "special", "this", "be", "one", "world", "bliss", "reach", "a", "a", "a",
    "an", "have", "in", "heaven", "splendid", "place", "will", "all", "people",
    "friend", "family", "heart", "soul", "peace", "calm"
  ];

  // List of all the sound variables
  const BGM = new Audio("./sounds/ambience.ogg");
  const POPS = [
    new Audio("./sounds/g.ogg"),
    new Audio("./sounds/c.ogg")
  ];
  const POP_ALL_SOUND = new Audio("./sounds/clear-all.ogg");
  const CREATION_SOUNDS = [
    new Audio("./sounds/creation-1.ogg"),
    new Audio("./sounds/creation-2.ogg"),
    new Audio("./sounds/creation-3.ogg")
  ];
  const SELECT_SOUND = new Audio("./sounds/select.ogg");

  // Magic numbers, according to the linter

  // Milliseconds it takes to remove a bubble
  const DEATH_DURATION = 1000;

  // % of page that bubbles can't spawn to the left of
  const LEFT_SPAWN_BOUNDS = 10;

  // % of page that bubbles can't spawn above
  const TOP_SPAWN_BOUNDS = 10;

  // % width of page that bubbles can spawn in, starting at LEFT_SPAWN_BOUNDS.
  const SPAWN_BOX_WIDTH = 80;

  // % width of page that bubbles can spawn in, starting at TOP_SPAWN_BOUNDS.
  const SPAWN_BOX_HEIGHT = 80;

  // Sound playing & volume settings
  for (let i = 0; i < POPS.length; i++) {
    POPS[i].volume = 0.3;
  }
  for (let i = 0; i < CREATION_SOUNDS.length; i++) {
    CREATION_SOUNDS[i].volume = 0.3;
  }
  POP_ALL_SOUND.volume = 0.3;
  SELECT_SOUND.volume = 0.3;

  // System for ensuring that dragging (and for only one object) is functional
  let currentDragOffsetX = 0;
  let currentDragOffsetY = 0;
  let selectedBubble = null;

  window.addEventListener("load", init);
  window.addEventListener("mousemove", playBGM);

  /**
   * Selects and returns a random element from a list.
   * @param {Array} list - the list to choose a random element from.
   * @return {*} the random element chosen.
   */
  function selectRandomElement(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  /**
   * Adds some instructional bubbles and adds the button event handlers when
   * the window loads.
   */
  function init() {
    addBubble(null, "Relax\n&\nEnjoy!");
    addBubble(null, "(There's\nmusic!)");
    addBubble(null, "Drag\nme!");
    let addButton = document.getElementById("add");
    addButton.addEventListener("click", addBubble);
    let clearButton = document.getElementById("clear");
    clearButton.addEventListener("click", killAllBubbles);
  }

  /**
   * Plays the background music on loop.
   */
  function playBGM() {
    BGM.loop = true;
    BGM.play();
  }

  /**
   * Plays a sound effect from the beginning.
   * @param {HTMLAudioElement} sound - The sound to play.
   */
  function playSFX(sound) {
    sound.currentTime = 0;
    sound.play();
  }

  /**
   * Selects a bubble for dragging and plays the associated sound.
   */
  function startMoveBubble() {
    currentDragOffsetX = event.clientX - this.offsetLeft;
    currentDragOffsetY = event.clientY - this.offsetTop;
    selectedBubble = event.currentTarget;
    window.addEventListener("mousemove", moveBubble);
    playSFX(SELECT_SOUND);
  }

  /**
   * Moves the selected bubble along with the mouse.
   */
  function moveBubble() {
    selectedBubble.style.left = (event.clientX - currentDragOffsetX) + "px";
    selectedBubble.style.top = (event.clientY - currentDragOffsetY) + "px";
  }

  /**
   * Ends the dragging of a bubble.
   */
  function endMove() {
    window.removeEventListener("mousemove", moveBubble);
  }

  /**
   * Starts the "pop" animation of a bubble, destroying it after one second.
   * Plays a random "pop" sound.
   */
  function killBubble() {
    event.currentTarget.classList.add("dying");
    window.setTimeout(destroyBubble, DEATH_DURATION, event.currentTarget);
    let pop = selectRandomElement(POPS);
    playSFX(pop);
  }

  /**
   * Starts the "pop" animation for all bubbles, destroying them after one
   * second.
   * Has a special sound effect.
   */
  function killAllBubbles() {
    let bubbles = document.querySelectorAll("figure");
    for (let i = 0; i < bubbles.length; i++) {
      bubbles[i].classList.add("dying");
      window.setTimeout(destroyBubble, DEATH_DURATION, bubbles[i]);
    }
    playSFX(POP_ALL_SOUND);
  }

  /**
   * Removes an element from the DOM tree entirely.
   * @param {HTMLElement} node - The element to remove.
   */
  function destroyBubble(node) {
    node.remove();
  }

  /**
   * Adds a new bubble to the field in a random position not on the edge of
   * the screen, along with its associated event listeners.
   * Plays a random "creation" sound as well.
   * @param {Event} event - The event object. Placed in order to pass in
   * multiple parameters.
   * @param {string} text - The text string the bubble should display.
   */
  function addBubble(event, text = "") {
    let newBubble = document.createElement("figure");
    let word = document.createElement("p");
    if (text === "") {
      word.textContent = selectRandomElement(WORDS);
    } else {
      word.textContent = text;
    }
    newBubble.appendChild(word);
    newBubble.addEventListener("mousedown", startMoveBubble);
    newBubble.addEventListener("mouseup", endMove);
    newBubble.addEventListener("dblclick", killBubble);
    newBubble.style.left = (LEFT_SPAWN_BOUNDS + Math.floor(Math.random() * SPAWN_BOX_WIDTH)) + "%";
    newBubble.style.top = (TOP_SPAWN_BOUNDS + Math.floor(Math.random() * SPAWN_BOX_HEIGHT)) + "%";
    document.getElementById("bubble-container").appendChild(newBubble);
    let creationSound = selectRandomElement(CREATION_SOUNDS);
    playSFX(creationSound);
  }
})();