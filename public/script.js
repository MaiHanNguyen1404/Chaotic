document.body.style.margin   = 0
document.body.style.overflow = `hidden`

// Get 'letter_trails' canvas elements
const cnv = document.getElementById (`letter_trails`)

// Setting canvas size
cnv.width = innerWidth
cnv.height = innerHeight

// Set the canvas background
cnv.style.backgroundColor = 'blue'

// Get canvas context
const ctx = cnv.getContext (`2d`)




// Draw a letter root that grows at random speed and direction
// Create a class for the root
class Root {
   constructor (x,y){

      // Define a letters array 
      this.letters1 = ["c", "l", "i", "c", "k", "click"];
      
      this.letters2 = ["sound", "overtaking", "visual", "erasing"];

      // Choose a random letter in the letters array
      this.randomLetter1 = this.letters1[Math.floor (Math.random() * this.letters1.length)];

      this.randomLetter2 = this.letters2[Math.floor (Math.random() * this.letters2.length)];

      // Define x, y 
      this.x = x;
      this.y = y;

      // Define random direction between -2 and 2 
      this.dX = Math.random() * 8 - 2;
      this.dY = Math.random() * 8 - 2;

      // Define the initial size of the root
      // between 0 and 20 
      this.size = Math.random() * 20;

      // Define a random maximum size of the root 
      // between 0 and 50
      this.maxSize = Math.random() * 40;

      // Define random angle between 0 and 6.2 (360 degree)
      this.angle = Math.random() * 6.2;

      // Define the length of the letter trail
      //this.length = (this.maxSize - this.size)/ 0.5 + 1

      // Define the opacity of the letter
      // based on the size of the letter
      //this.opacity = 1 - this.size/ this.length;
      this.opacity = 0;

      this.second = 0;

      //this.period = period;
   }

   // Define a function for the grow animation
   grow(){

      // Move the position of the root 
      // according to the direction and the angle
      this.x += this.dX + Math.cos (this.angle);
      this.y += this.dY + Math.cos (this.angle);

      // Increase the size of the root
      this.size += 0.5;

      // Increase the angle of the root
      this.angle += 0.1;

      if (this.opacity <=1) this.opacity +=0.1

      // Draw the root growth 
      // as long as the size of the root is less than the maximum
      if (this.size < this.maxSize){

         // Set font size based on root size
         // Set the font family to monospace
         ctx.font = `${this.size}px monospace`;

         // Set a random font colour in HSL value
         ctx.fillStyle = `hsl(${Math.random() * 360}, 60%, 55%, ${this.opacity})`;

         // Draw the random letter
         // according to the x and y position
         ctx.fillText (this.randomLetter1, this.x, this.y);

         // Call the next animation frame
         requestAnimationFrame (this.grow.bind(this));
      }
   }

   sprout (period){

      // Move the position of the root 
      // according to the direction and the angle
      this.x += this.dX + Math.cos (this.angle);
      this.y += this.dY + Math.cos (this.angle);

      // Increase the size of the root
      this.size += 0.5;

      // Increase the angle of the root
      this.angle += 0.1;

      if (this.opacity <=1) this.opacity +=0.1

      // Draw the root growth 
      // as long as the size of the root is less than the maximum
      if (this.size < this.maxSize){

         //ctx.clearRect (this.x, this.y, this.size, this.size)

         // Set font size based on root size
         // Set the font family to monospace
         ctx.font = `${this.size}px cursive`;

         // Set a random font colour in HSL value
         ctx.fillStyle = `white`;

         // Draw the random letter
         // according to the x and y position
         ctx.fillText (this.randomLetter2, this.x, this.y);

         ctx.shadowOffsetX = 5;
         ctx.shadowOffsetY = 5;
         ctx.shadowBlur = 50;

         ctx.shadowColor = 'blue';

         this.second ++;

         if (this.second < 60) setTimeout (this.sprout.bind(this), period)  
     } 
   }
}

// 'Notes' code inspired by Transient Synths code from: 
// https://blog.science.family/240320_web_audio_api_synths

// 
const cnv_2 = document.getElementById (`notes`)
cnv_2.width = innerWidth
cnv_2.height = innerHeight

const audio_context = new AudioContext ()
audio_context.suspend ()
console.log (audio_context.state)

// define an async click handler function 
async function init_audio () {

   // wait for audio context to resume
   await audio_context.resume ()

}

// define a function that plays a note
function play_note (note, length) {

   // if the audio context is not running, resume it
   if (audio_context.state != 'running') init_audio ()

   // create an oscillator
   const osc = audio_context.createOscillator ()

   // make it a triangle wave this time
   osc.type            = 'triangle'

   // set the value using the equation 
   // for midi note to Hz
   osc.frequency.value = 440 * 2 ** ((note - 69) / 12)

   // create an amp node
   const amp = audio_context.createGain ()

   // connect the oscillator 
   // to the amp
   // to the audio out
   osc.connect (amp).connect (audio_context.destination)

   // the .currentTime property of the audio context
   // contains a time value in seconds
   const now = audio_context.currentTime

   // make a gain envelope
   // start at 0
   amp.gain.setValueAtTime (0, now)

   // take 0.02 seconds to go to 0.4, linearly
   amp.gain.linearRampToValueAtTime (0.4, now + 0.02)

   // this method does not like going to all the way to 0
   // so take length seconds to go to 0.0001, exponentially
   amp.gain.exponentialRampToValueAtTime (0.0001, now + length)

   // start the oscillator now
   osc.start (now)

   // stop the oscillator 1 second from now
   osc.stop  (now + length)
}

// making an array of midi notes 
const notes = [ 64, 63, 64, 63, 64, 59, 62, 60, 57]

// declaring a mutable iterator
let i = 0

// declaring a mutable state value
let running = false

// declaring a mutable variable for 
// the period of time between notes
let period = 200

// declaring a mutable variable for
// the length of the note
let len = 0

// declaring a function that plays the next note
function next_note () {

   // use the iterator to select a note from 
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

// this is a recursive function
function note_player () {

   // play the next note
   next_note ()

   // if running is true
   // it uses setTimeout to call itself 
   // after period milliseconds
   if (running) setTimeout (note_player, period)
}


let drawing_grow = true;

window.addEventListener ("mousemove", function (e) {
   // Draw new root 
   // in cordinate with the position of the cursor
   if (drawing_grow) {
      const root = new Root (e.x, e.y)
   
      root.grow();
   }

   // as the cursor goes from left to right
   // len gos from 0 to 5
   len = 3 //* e.offsetX / cnv_2.width

   // as the cursor goes from bottom to top
   // period goes from 420 to 20 (milliseconds)
   period = 100 + ((e.offsetY / cnv_2.height) ** 2) * 800
})

window.addEventListener ("mousedown", function (e) {
   
   for (let i = 0; i < 3; i++){
      // Draw new root 
      // in cordinate with the position of the cursor
      const root = new Root (e.x, e.y);

      // Call the grow function
      root.sprout(period);
   }

   // set running to true
   running = true

   // initiate the recurseive note_player function
   note_player ()

   drawing_grow = false;
})

// this function handles the mouse event
// when the cursor leaves the canvas
window.addEventListener ("mouseup", function (e){

   // set running to false
   running = false

   drawing_grow = true
})

























