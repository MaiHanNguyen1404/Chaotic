document.body.style.margin   = 0
document.body.style.overflow = `hidden`

// Get 'shapes' canvas elements
const cnv = document.getElementById (`shapes`)

// Setting canvas sizze
cnv.width = innerWidth
cnv.height = innerHeight

// Get canvas context
const ctx = cnv.getContext (`2d`)

// Draw a root that grows at random speed and direction
// Create a class for the root
class Root {
   constructor (x,y){
      // 
      this.letters = ["c", "l", "i", "c", "k", "."];

      //
      this.randomLetter = this.letters[Math.floor (Math.random() * this.letters.length)];

      // 
      this.x = x;
      this.y = y;

      // Define random direction between -4 and 4 
      this.dX = Math.random() * 8 - 4;
      this.dY = Math.random() * 8 -4;

      // Define the initial size of the root
      // between 0 and 20 
      this.size = Math.random() * 20;

      // Define a random maximum size of the root 
      // between 0 and 50
      this.maxSize = Math.random() * 50;

      // Define random angle between 0 and 6.2 (360 degree)
      this.angle = Math.random() * 6.2;
   }

   // Define a function for the grow animation
   grow(){
      // Move the position of the root 
      // according to the direction
      this.x += this.dX + Math.sin (this.angle);
      this.y += this.dY + Math.sin (this.angle);

      // Increase the size of the root
      this.size += 0.5;

      // Increase the angle of the root
      this.angle += 0.1;

      // Draw the root growth 
      // as long as the size of the root is less than the maximum
      if (this.size < this.maxSize){
         ctx.font = `${this.size}px monospace`;

         ctx.fillStyle = `hsl(${Math.random() * 360}, 80%, 50%)`;

         ctx.fillText (this.randomLetter, this.x, this.y);

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
