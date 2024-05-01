document.body.style.margin   = 0
document.body.style.overflow = `hidden`

// Get 'shapes' canvas elements
const cnv = document.getElementById (`letter_trails`)

// Setting canvas sizze
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
      this.letters = ["c", "l", "i", "c", "k", "."];

      // Choose a random letter in the letters array
      this.randomLetter = this.letters[Math.floor (Math.random() * this.letters.length)];

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
      this.maxSize = Math.random() * 50;

      // Define random angle between 0 and 6.2 (360 degree)
      this.angle = Math.random() * 6.2;

      this.length = (this.maxSize - this.size)/ 0.5 + 1

      // Define the opacity of the letter
      // based on the size of the letter
      //this.opacity = 1 - this.size/ this.length;
      this.opacity = 0;
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

         //ctx.clearRect (this.x, this.y, this.size, this.size)

         // Set font size based on root size
         // Set the font family to monospace
         ctx.font = `${this.size}px monospace`;

         // Set a random font colour in HSL value
         ctx.fillStyle = `hsl(${Math.random() * 360}, 60%, 50%, ${this.opacity})`;

         // Draw the random letter
         // according to the x and y position
         ctx.fillText (this.randomLetter, this.x, this.y);

         // Call the next animation frame
         requestAnimationFrame (this.grow.bind(this));

      }
   }

}

// Define a function to handle mouse event
// when the cursor moves over the canvas
window.addEventListener('mousemove', function(e) {
   // Draw new root 
   // in cordinate with the position of the cursor
   const root = new Root (e.x, e.y);

   // Call the grow function
   root.grow();
})















