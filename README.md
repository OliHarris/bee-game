# bee-game
Try it out!

Other areas to consider - use hexagons filling with honey for health - the bees inside can be holding the numerical health indicator..?

Remodel on mobile - for obvious reasons, the design can be drastically overhauled on dimensions less than 768px tablet; currently there is too much scrolling. Really the layout should all fit on the screen.

To make it more engaging, the code can be reworked as a game of skill, where the idea is to swat the Queen Bee based on a 'roulette' style.

Things I've learnt about SVGs with this project:

Applying gradients in Adobe Illustrator then exporting to SVGs proves difficult to render - this graphic code had to then be manually edited to remove this rogue gradient code. Arduously editing SVG code is not fun, so stick to solid colours!

It's a strange contradiction that the ':after' pseudoclass cannot be applied to an SVG (it is technically considered an image), even though it can otherwise be manipulated by CSS when inline... The 'shine' CSS masking effect has to be on a rectangular 'block' element rather than a more ideal SVG honeycomb image.