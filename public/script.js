document.body.style.margin   = 0
document.body.style.overflow = `hidden`

// Get 'letter_trails' canvas elements
const cnv = document.getElementById (`letter_trails`)

// Setting canvas size
cnv.width = innerWidth
cnv.height = innerHeight

// Set the canvas background to blue
cnv.style.backgroundColor = 'blue'

// Get canvas context
const ctx = cnv.getContext (`2d`)


// Draw a letter trail root that grows at random speed and direction
// Create a class for the root
class Root {
   constructor (x,y){

      // Define a letters array 
      // for the first trail (mouse move)
      this.letters1 = ["c", "l", "i", "c", "k", "click"];
      
      // Define a letters array 
      // for the second trail (mouse press)      
      this.letters2 = ["sound", "overtaking", "visual", "erasing"];

      // Choose a random letter in the letters1 array
      this.randomLetter1 = this.letters1[Math.floor (Math.random() * this.letters1.length)];

      // Choose a random letter in the letters2 array
      this.randomLetter2 = this.letters2[Math.floor (Math.random() * this.letters2.length)];

      // Variables x, y 
      this.x = x;
      this.y = y;

      // Random x, y direction between -2 and 6 
      this.dX = Math.random() * 8 - 2;
      this.dY = Math.random() * 8 - 2;

      // Random initial size of the root
      // between 0 and 20 
      this.size = Math.random() * 20;

      // Random maximum size of the root 
      // between 0 and 40
      this.maxSize = Math.random() * 40;

      // Random angle between 0 and 6.2 (360 degree)
      this.angle = Math.random() * 6.2;

      // Set the initial opacity of the letter
      this.opacity = 0;

      // Variable to count the seconds
      this.second = 0;
   }

   // Define a function for the grow animation
   // for the letters1 array
   // (when mouse is moved)
   grow(){

      // Move the position of the root 
      // according to the direction and the angle
      this.x += this.dX + Math.cos (this.angle);
      this.y += this.dY + Math.cos (this.angle);

      // Increase the size of the root
      this.size += 0.5;

      // Increase the angle of the root
      this.angle += 0.1;

      // Increase the opacity of the letter
      // as long as it is equal or less than 1 
      if (this.opacity <=1) this.opacity +=0.1

      // Draw the root growth 
      // as long as the initial size of the root 
      // is less than the maximum
      if (this.size < this.maxSize){

         // Set font size based on root size
         // Set the font family to monospace
         ctx.font = `${this.size}px monospace`;

         // Set a random font colour in HSL and alpha value
         ctx.fillStyle = `hsl(${Math.random() * 360}, 60%, 55%, ${this.opacity})`;

         // Draw the random letter from the letters1 array
         // according to the x and y position
         ctx.fillText (this.randomLetter1, this.x, this.y);

         // Shadow offset value horizontally
         ctx.shadowOffsetX = 2;

         // Shadow offset value vertically
         ctx.shadowOffsetY = 5;

         // Shadow blur value
         ctx.shadowBlur = 20;

         // Shadow colour
         ctx.shadowColor = 'black'

         // Call the next animation frame
         requestAnimationFrame (this.grow.bind(this));
      }
   }

   // Define a function for the sprout animation
   // for the letters2 array
   // with the 'period' value of the notes as the argument
   // (when mouse is pressed)
   sprout (period){

      // Move the position of the root 
      // according to the direction and the angle
      this.x += this.dX + Math.cos (this.angle);
      this.y += this.dY + Math.cos (this.angle);

      // Increase the size of the root
      this.size += 0.5;

      // Increase the angle of the root
      this.angle += 0.1;

      // Increase the opacity of the letter
      // as long as it is equal or less than 1       
      if (this.opacity <=1) this.opacity +=0.1

      // Draw the root sprout 
      // as long as the initial size of the root 
      // is less than the maximum
      if (this.size < this.maxSize){

         // Set font size based on root size
         // Set the font family to cursive
         ctx.font = `${this.size}px cursive`;

         // Set the font color to white
         ctx.fillStyle = `white`;

         // Draw the random letter from the letters1 array
         // accordind to the x and y position
         ctx.fillText (this.randomLetter2, this.x, this.y);

         // Shadow offset value horizontally
         ctx.shadowOffsetX = 5;

         // Shadow offset value vertically
         ctx.shadowOffsetY = 5;

         // Shadow blur value
         ctx.shadowBlur = 50;

         // Shadow colour
         ctx.shadowColor = 'blue';

         // Iterating the seconds counter
         this.second ++;

         // If less than 60 seconds
         // use setTimeout to call sprout itself,
         // after 'period' milliseconds
         // ('period' is the period of time between notes)
         if (this.second < 60) setTimeout (this.sprout.bind(this), period)  
     } 
   }
}

// 'Notes' code inspired by Transient Synths code from: 
// https://blog.science.family/240320_web_audio_api_synths

// Get 'notes' canvas elements
const cnv_2 = document.getElementById (`notes`)

// Setting canvas size
cnv_2.width = innerWidth
cnv_2.height = innerHeight

// Get the audio context
const audio_context = new AudioContext ()

// Suspend the audio context
audio_context.suspend ()
console.log (audio_context.state)

// Define an async click handler function 
async function init_audio () {

   // Wait for audio context to resume
   await audio_context.resume ()

}

// Define a function that plays a note
function play_note (note, length) {

   // If the audio context is not running, resume it
   if (audio_context.state != 'running') init_audio ()

   // Create an oscillator
   const osc = audio_context.createOscillator ()

   // Set the oscillator type to sine wave
   osc.type = 'sine'

   // Set the value using the equation 
   // for midi note to Hz
   // formula: f = 440 * 2 ** ((note - 69) / 12) 
   osc.frequency.value = 440 * 2 ** ((note - 69) / 12)

   // Create an amp node
   const amp = audio_context.createGain ()

   // Connect the oscillator 
   // to the amp
   // to the audio out
   osc.connect (amp).connect (audio_context.destination)

   // The .currentTime property of the audio context
   // contains a time value in seconds
   const now = audio_context.currentTime

   // Make a gain envelope
   // start at 0
   amp.gain.setValueAtTime (0, now)

   // Take 0.02 seconds to go to 0.4, linearly
   amp.gain.linearRampToValueAtTime (0.4, now + 0.02)

   // This method does not like going to all the way to 0
   // so take length seconds to go to 0.0001, exponentially
   amp.gain.exponentialRampToValueAtTime (0.0001, now + length)

   // Start the oscillator now
   osc.start (now)

   // Stop the oscillator 1 second from now
   osc.stop  (now + length)
}

// Make an array of midi notes 
const notes = [ 64, 63, 64, 63, 64, 59, 62, 60, 57]

// Declare a mutable variable for 
// the period of time between notes
let period = 200

// Declare a mutable variable for
// the length of the note
let len = 0

// Declare a mutable iterator
let i = 0

// Declare a mutable state value
let running = false

// Declare a function that plays the next note
function next_note () {

   // Use the iterator to select a note from 
   // the notes array and pass it to the 
   // play_note function along with the 
   // len variable to specify the length of the note
   play_note (notes[i], len)

   // iterate the iterator
   i++

   // if i gets too big
   // cycle back to 0
   i %= notes.length
}

// Define a function play notes in sequence 
// with a period of time between notes
// (a recursive function)
function note_player () {

   // Play the next note
   next_note ()

   // If running is true
   // it uses setTimeout to call itself 
   // after period milliseconds
   if (running) setTimeout (note_player, period)
}

// Declare a drawing state value
let drawing_grow = true;

// Define a function to handle the mouse event
// when the cursor moves over the canvas
window.addEventListener ("mousemove", function (e) {

   // If drawing is true
   if (drawing_grow) {

      // Draw new root 
      // in cordinate with the position of the cursor
      const root = new Root (e.x, e.y)
   
      // Initiate the grow function of the root
      root.grow();
   }

   // As the cursor goes from left to right
   // len gos from 0 to 5
   len = 3 //* e.offsetX / cnv_2.width

   // As the cursor goes from bottom to top
   // period goes from 420 to 20 (milliseconds)
   period = 100 + ((e.offsetY / cnv_2.height) ** 2) * 800
})

// Define a function to handle the mouse event
// when the mouse is pressed down on the canvas
window.addEventListener ("mousedown", function (e) {
   
   // Draw multiple roots at the same time
   for (let i = 0; i < 3; i++){

      // Draw new root 
      // in cordinate with the position of the cursor
      const root = new Root (e.x, e.y);

      // Initiate the sprout function of the root
      root.sprout(period);
   }

   // Set notes running to true
   running = true

   // Initiate the recurseive note_player function
   note_player ()

   // Set the grow drawing state to false
   drawing_grow = false;

   
})

// Define a function to handle the mouse event
// when the mouse is not pressed down on the canvas
window.addEventListener ("mouseup", function (e){

   // set notes running to false
   running = false

   // Set the grow drawing state to true
   drawing_grow = true
})

























